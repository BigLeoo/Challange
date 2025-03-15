import { getRegionController } from '../../../interface/controller/region/getRegion/getRegionIndex'
import { Request, Response, Router } from 'express'

const getRegionRoute = Router()
getRegionRoute.get(
  '/:regionId',
  async (request: Request, response: Response) => {
    await getRegionController.handler(request, response)
  },
)

export default getRegionRoute
