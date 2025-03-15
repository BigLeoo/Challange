import { updateUserController } from '../../../interface/controller/user/updateUser/updateUserIndex'
import { Request, Response, Router } from 'express'

const updateUserRoute = Router()
updateUserRoute.put(
  '/:userId',
  async (request: Request, response: Response) => {
    await updateUserController.handler(request, response)
  },
)

export default updateUserRoute
