import express from 'express'
import createRegionRoute from './createRegionRoute'
import getRegionRoute from './getRegionRoute'
import fetchRegionsRoute from './fetchRegionRoute'

const regionRoute = express.Router()
regionRoute.use('/regions', createRegionRoute)
regionRoute.use('/regions', getRegionRoute)
regionRoute.use('/regions', fetchRegionsRoute)

export default regionRoute
