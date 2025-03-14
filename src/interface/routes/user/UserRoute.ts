import express from 'express'

import createUserRoute from './createUserRoute'

const userRoute = express.Router()
userRoute.use('/users', createUserRoute)

export default userRoute
