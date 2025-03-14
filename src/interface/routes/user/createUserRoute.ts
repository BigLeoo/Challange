import { createUserController } from '../../../interface/controller/user/createUser/createUserIndex'
import { Request, Response, Router } from 'express'

const createUserRoute = Router()
createUserRoute.post('/', async (request: Request, response: Response) => {
  await createUserController.handler(request, response)
})

export default createUserRoute
