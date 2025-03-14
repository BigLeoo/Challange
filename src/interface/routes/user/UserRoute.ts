import express from 'express'

import createUserRoute from './createUserRoute'
import fetchUsersRoute from './fetchUsersRoute'

const userRoute = express.Router()
userRoute.use('/users', createUserRoute)
userRoute.use('/users', fetchUsersRoute)

export default userRoute
