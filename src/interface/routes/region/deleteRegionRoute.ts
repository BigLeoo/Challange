import { deleteRegionController } from '../../../interface/controller/region/deleteRegion/deleteRegionIndex'
import { Request, Response, Router } from 'express'

const deleteRegionRoute = Router()
deleteRegionRoute.delete(
  '/:regionId',
  async (request: Request, response: Response) => {
    await deleteRegionController.handler(request, response)
  },
)

export default deleteRegionRoute
