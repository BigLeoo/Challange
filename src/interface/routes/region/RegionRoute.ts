import express from 'express'
import createRegionRoute from './createRegionRoute'
import getRegionRoute from './getRegionRoute'
import fetchRegionsRoute from './fetchRegionRoute'
import updateRegionRoute from './updateRegionRoute'
import deleteRegionRoute from './deleteRegionRoute'
import fetchRegionByCoordinatesRoute from './fetchRegionByCoordinatesRoute'
import fetchRegionByDistanceRoute from './fetchRegionByDistanceRoute'

const regionRoute = express.Router()
regionRoute.use('/regions', createRegionRoute)
regionRoute.use('/regions', getRegionRoute)
regionRoute.use('/regions', fetchRegionsRoute)
regionRoute.use('/regions', updateRegionRoute)
regionRoute.use('/regions', deleteRegionRoute)
regionRoute.use('/regions', fetchRegionByCoordinatesRoute)
regionRoute.use('/regions', fetchRegionByDistanceRoute)

export default regionRoute
