import express from 'express'
import createRegionRoute from './createRegionRoute'
import getRegionRoute from './getRegionRoute'
import fetchRegionsRoute from './fetchRegionRoute'
import updateRegionRoute from './updateRegionRoute'
import deleteRegionRoute from './deleteRegionRoute'

const regionRoute = express.Router()
regionRoute.use('/regions', createRegionRoute)
regionRoute.use('/regions', getRegionRoute)
regionRoute.use('/regions', fetchRegionsRoute)
regionRoute.use('/regions', updateRegionRoute)
regionRoute.use('/regions', deleteRegionRoute)

export default regionRoute
