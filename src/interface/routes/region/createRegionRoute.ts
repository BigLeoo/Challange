import { createRegionController } from '../../../interface/controller/region/createRegion/createRegionIndex'
import { Request, Response, Router } from 'express'

const createRegionRoute = Router()
createRegionRoute.post('/', async (request: Request, response: Response) => {
  await createRegionController.handler(request, response)
})

export default createRegionRoute
