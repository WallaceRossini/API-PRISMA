import { Request, Response, Router } from 'express'
import { AuthController } from '../controller/AuthController'
import { Authenticated } from '../middleware/Authenticated'

const routes = Router()

const authController = new AuthController()

routes.post('/register', authController.register)

routes.post('/authentication', authController.authentication)

routes.get('/home', Authenticated(), (request:Request, response:Response) => {
  return response.json('lista')
})

export { routes }
