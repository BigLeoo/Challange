import { getUserController } from '../../../interface/controller/user/getUser/getUserIndex'
import { Request, Response, Router } from 'express'

const getUserRoute = Router()
getUserRoute.get('/:userId', async (request: Request, response: Response) => {
  await getUserController.handler(request, response)
})

export default getUserRoute
