import { fetchRegionsController } from '../../../interface/controller/region/fetchRegion/fetchRegionIndex'
import { Request, Response, Router } from 'express'

const fetchRegionsRoute = Router()
fetchRegionsRoute.get('/', async (request: Request, response: Response) => {
  await fetchRegionsController.handler(request, response)
})

export default fetchRegionsRoute
