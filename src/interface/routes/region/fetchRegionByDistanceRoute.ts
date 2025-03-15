import { fetchRegionsByDistanceController } from '../../../interface/controller/region/fetchRegionByDistance/fetchRegionsByDistanceIndex'
import { Request, Response, Router } from 'express'

const fetchRegionByDistanceRoute = Router()
fetchRegionByDistanceRoute.get(
  '/:longitude/:latitude/:maxDistance/:userId?',
  async (request: Request, response: Response) => {
    await fetchRegionsByDistanceController.handler(request, response)
  },
)

export default fetchRegionByDistanceRoute
