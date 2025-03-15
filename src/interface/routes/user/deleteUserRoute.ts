import { deleteUserController } from '../../../interface/controller/user/deleteUser/deleteUserIndex'
import { Request, Response, Router } from 'express'

const deleteUserRoute = Router()
deleteUserRoute.delete(
  '/:userId',
  async (request: Request, response: Response) => {
    await deleteUserController.handler(request, response)
  },
)

export default deleteUserRoute
