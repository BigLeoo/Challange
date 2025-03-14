import 'reflect-metadata'
import { DatabaseConnection } from './core/database/DatabaseConnection'
import { MongoDatabase } from './core/database/MongoDatabase'
import { ExpressServer } from './core/server/ExpressServer'
import { env } from './infrastructure/config/env'
import { App } from './infrastructure/App'
import userRoute from './interface/routes/user/UserRoute'

const database = new MongoDatabase(env.MONGO_URL)
const databaseConnection = new DatabaseConnection(database)

const server = new ExpressServer(env.SERVER_PORT, [userRoute])

const app = new App(databaseConnection, server)

app.start()
