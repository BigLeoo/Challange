import { fetchUsersController } from '../../controller/user/fetchUsers/fetchUserIndex'
import { Request, Response, Router } from 'express'

const fetchUsersRoute = Router()
fetchUsersRoute.get('/', async (request: Request, response: Response) => {
  await fetchUsersController.handler(request, response)
})

export default fetchUsersRoute
