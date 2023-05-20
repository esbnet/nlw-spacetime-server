import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  // ensures that the user is logged in
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  // list memories
  app.get('/memories', async (request) => {
    const memories = await prisma.memory.findMany({
      where: { userId: request.user.sub },
      orderBy: { createAt: 'asc' },
    })
    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
      }
    })
  })

  // list memories by id
  app.get('/memories/:id', async (request, replay) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: { id },
    })

    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return replay.status(401).send()
    }

    return memory
  })

  // add memorie
  app.post('/memories', async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: request.user.sub,
      },
    })

    return memory
  })
  // update memorie
  app.put('/memories/:id', async (request, replay) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    let memory = await prisma.memory.findUniqueOrThrow({
      where: { id },
    })

    if (memory.userId !== request.user.sub) {
      return replay.status(401).send()
    }

    memory = await prisma.memory.update({
      where: { id },
      data: { content, coverUrl, isPublic },
    })

    return memory
  })

  // delete memorie
  app.delete('/memories/:id', async (request, replay) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: { id },
    })

    if (memory.userId !== request.user.sub) {
      return replay.status(401).send()
    }

    await prisma.memory.delete({ where: { id } })
  })
}
