import express from "express"
import cors from "cors"
import { CORS_ORIGIN_RESOURCES } from "./constants.js"

const app = express()

//For backup if proxy doesn't work
app.use(cors({
    origin : CORS_ORIGIN_RESOURCES,
    credentials : true
}))

//for security purposes , @sayan2002-github you may change it if require
app.use(express.json({limit : "32kb"}))

app.use(express.urlencoded({extended : true}))

//For handling static files like image and pdf, we may store it in our public dir for some time, if usecase comes
app.use(express.static("public"))


//routes import

import { authRoute } from "./routes/auth.routes.js"


//routes declaration
app.use("/api/v1/auth",authRoute )
export {app}