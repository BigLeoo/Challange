import { updateRegionController } from '../../../interface/controller/region/updateRegion/updateRegionIndex'
import { Request, Response, Router } from 'express'

const updateRegionRoute = Router()
updateRegionRoute.put(
  '/:regionId',
  async (request: Request, response: Response) => {
    await updateRegionController.handler(request, response)
  },
)

export default updateRegionRoute
