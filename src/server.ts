import fastify from 'fastify'
import { memoriesRoutes } from './routes/memories'
import { usersRoutes } from './routes/users'
import cors from '@fastify/cors'

const app = fastify()

app.register(cors, { origin: true })

// Routes
app.register(memoriesRoutes, usersRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('server running on http://localhost:3333 🚀')
  })
