import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { createWriteStream } from 'node:fs'
import { extname, resolve } from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, replay) => {
    const data = await request.file({
      limits: {
        fileSize: 5_242_880, // For multipart forms, the max file size in bytes
      },
    })

    if (!data) {
      return replay.status(400).send()
    }

    const mimetypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimetypeRegex.test(data.mimetype)

    if (!isValidFileFormat) {
      return replay.status(400).send()
    }

    const fileId = randomUUID()
    const extension = extname(data.filename)

    const fileName = fileId.concat(extension)
    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads', fileName),
    )

    await pump(data.file, writeStream)

    const fullUrl = request.protocol.concat(':/').concat(request.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    console.log(fileUrl)
    return { fileUrl }
  })
}
