import express from 'express'
import createUserRoute from './createUserRoute'
import fetchUsersRoute from './fetchUsersRoute'
import getUserRoute from './getUserRoute'
import updateUserRoute from './updateUserRoute'
import deleteUserRoute from './deleteUserRoute'

const userRoute = express.Router()
userRoute.use('/users', createUserRoute)
userRoute.use('/users', fetchUsersRoute)
userRoute.use('/users', getUserRoute)
userRoute.use('/users', updateUserRoute)
userRoute.use('/users', deleteUserRoute)

export default userRoute
