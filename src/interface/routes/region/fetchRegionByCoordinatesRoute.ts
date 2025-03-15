import { fetchRegionsByCoordinatesController } from '../../../interface/controller/region/fetchRegionsByCoordinates/fetchRegionsByCoordinateIndex'
import { Request, Response, Router } from 'express'

const fetchRegionByCoordinatesRoute = Router()
fetchRegionByCoordinatesRoute.get(
  '/:longitude/:latitude',
  async (request: Request, response: Response) => {
    await fetchRegionsByCoordinatesController.handler(request, response)
  },
)

export default fetchRegionByCoordinatesRoute
