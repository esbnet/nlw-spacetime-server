import axios from 'axios'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from '../lib/prisma'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request) => {
    const bodySchema = z.object({
      code: z.string(),
      platform: z.string(),
    })

    const { code, platform } = bodySchema.parse(request.body)

    let clientId = process.env.GITHUB_CLIENT_ID_WEB
    let clientSecret = process.env.GITHUB_CLIENT_SECRET_WEB

    if (platform === 'app') {
      clientId = process.env.GITHUB_CLIENT_ID_APP
      clientSecret = process.env.GITHUB_CLIENT_SECRET_APP
    }

    const accessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      },
    )

    const { access_token } = accessTokenResponse.data

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    })

    const userInfo = userSchema.parse(userResponse.data)

    let user = await prisma.user.findUnique({
      where: { githubId: userInfo.id },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
          avatarUrl: userInfo.avatar_url,
        },
      })
    }

    const token = app.jwt.sign(
      { name: user.name, avatarUrl: user.avatarUrl },
      { sub: user.id, expiresIn: '30 days' },
    )

    return { token }
  })
}
