require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const router = require('./src/routes')

app.set('trust proxy', 1)
app.use(helmet())
app.use(compression())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
app.use(bodyParser.json())
app.use(router)

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started at port: ${process.env.PORT}`)
})