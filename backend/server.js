// backend/server.js
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const dotenv = require('dotenv')
const multer = require('multer')
const csv = require('csvtojson')
const Joi = require('joi')
const morgan = require('morgan')
const helmet = require('helmet')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat') // Import plugin

// Aktifkan plugin
dayjs.extend(customParseFormat)

// Load environment variables from .env file
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(helmet())

// Konfigurasi multer untuk menangani upload file
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/json' ||
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.geo+json'
    ) {
      cb(null, true)
    } else {
      cb(new Error('Only JSON, CSV, and GeoJSON files are allowed'), false)
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // Batas ukuran file 10MB
})

// Koneksi ke MongoDB menggunakan MONGO_URI dari .env
const mongoURI = process.env.MONGO_URI
mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err))

// Definisikan Skema dan Model
const superstoreSchema = new mongoose.Schema({
  OrderID: String,
  OrderDate: Date,
  ShipDate: Date,
  ShipMode: String,
  CustomerID: String,
  CustomerName: String,
  Segment: String,
  Country: String,
  City: String,
  State: String,
  PostalCode: Number,
  Region: String,
  ProductID: String,
  Category: String,
  SubCategory: String,
  ProductName: String,
  Sales: Number,
  Quantity: Number,
  Discount: Number,
  Profit: Number,
  ProfitPerQuantity: Number,
})

const Superstore = mongoose.model('Superstore', superstoreSchema)
const GeoData = require('./models/GeoData')

// Definisikan skema validasi menggunakan Joi
const superstoreValidationSchema = Joi.object({
  OrderID: Joi.string().required(),
  OrderDate: Joi.date().required(),
  ShipDate: Joi.date().required(),
  ShipMode: Joi.string().required(),
  CustomerID: Joi.string().required(),
  CustomerName: Joi.string().required(),
  Segment: Joi.string()
    .valid('Consumer', 'Corporate', 'Home Office')
    .required(),
  Country: Joi.string().required(),
  City: Joi.string().required(),
  State: Joi.string().required(),
  PostalCode: Joi.number().required(),
  Region: Joi.string().valid('East', 'West', 'Central', 'South').required(),
  ProductID: Joi.string().required(),
  Category: Joi.string().required(),
  SubCategory: Joi.string().required(),
  ProductName: Joi.string().required(),
  Sales: Joi.number().min(0).required(),
  Quantity: Joi.number().integer().min(1).required(),
  Discount: Joi.number().min(0).max(1).required(),
  Profit: Joi.number().required(),
  ProfitPerQuantity: Joi.number().required(),
})

superstoreSchema.index({ Category: 1 })
superstoreSchema.index({ City: 1 })
superstoreSchema.index({ State: 1 })

app.get('/', (req, res) => {
  res.send('Superstore Dashboard Backend is running.')
})

// API Endpoint untuk Mendapatkan Data Superstore
app.get('/api/superstore-data', async (req, res) => {
  try {
    const data = await Superstore.find({})
    res.json(data)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Fungsi untuk memparsing tanggal menggunakan Day.js
// Fungsi helper untuk memparsing tanggal dengan multiple format
function parseDate(dateString, recordIndex, fieldName) {
  console.log(
    `Parsing "${fieldName}" for record ${recordIndex}: "${dateString}"`
  )

  // Daftar format yang diizinkan
  const formats = ['D/M/YYYY', 'DD/MM/YYYY', 'M/D/YYYY', 'MM/DD/YYYY']

  for (let format of formats) {
    let date = dayjs(dateString, format, true)
    if (date.isValid()) {
      console.log(
        `Parsed ${fieldName} for record ${recordIndex} using '${format}' format: ${date.format()}`
      )
      return date.toDate()
    }
  }

  // Jika semua format gagal, lemparkan error
  console.log(
    `Failed to parse "${fieldName}" for record ${recordIndex}: "${dateString}"`
  )
  throw new Error(
    `Invalid date format for "${fieldName}" on record ${recordIndex}: "${dateString}". Expected one of 'D/M/YYYY', 'DD/MM/YYYY', 'M/D/YYYY', 'MM/DD/YYYY'.`
  )
}

// API Endpoint untuk Mengupload Dataset (JSON dan CSV)
app.post('/api/upload-dataset', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    let parsedData = []
    if (req.file.mimetype === 'application/json') {
      parsedData = JSON.parse(req.file.buffer.toString())
    } else if (req.file.mimetype === 'text/csv') {
      // Menggunakan csvtojson untuk parsing CSV dengan konfigurasi yang tepat
      parsedData = await csv({
        trim: true,
        ignoreEmpty: true,
      }).fromString(req.file.buffer.toString())
    }

    if (!Array.isArray(parsedData)) {
      return res.status(400).json({ error: 'Data should be an array' })
    }

    // Periksa apakah semua field yang diperlukan ada
    const requiredFields = [
      'Order ID',
      'Order Date',
      'Ship Date',
      'Ship Mode',
      'Customer ID',
      'Customer Name',
      'Segment',
      'Country',
      'City',
      'State',
      'Postal Code',
      'Region',
      'Product ID',
      'Category',
      'Sub-Category',
      'Product Name',
      'Sales',
      'Quantity',
      'Discount',
      'Profit',
      'Profit/Quantity',
    ]

    for (let i = 0; i < parsedData.length; i++) {
      const item = parsedData[i]
      const missingFields = requiredFields.filter((field) => !(field in item))

      // Jika ada 'Row ID' di CSV, Anda dapat mengabaikannya atau memastikan bahwa 'Row ID' tidak diperlukan
      // Misalnya, jika 'Row ID' ada, hapus atau abaikan:
      if ('Row ID' in item) {
        delete item['Row ID']
      }
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Record ${i + 1} is missing fields: ${missingFields.join(
            ', '
          )}`,
        })
      }
    }

    // Map data sesuai skema
    const mappedData = parsedData.map((item, index) => {
      console.log(`Processing record ${index + 1}:`, item)
      // Menggunakan parseDate untuk parsing tanggal
      const orderDateString = item['Order Date'].trim()
      const shipDateString = item['Ship Date'].trim()

      const orderDate = parseDate(orderDateString, index + 1, 'OrderDate')
      const shipDate = parseDate(shipDateString, index + 1, 'ShipDate')

      // Fungsi untuk memeriksa apakah nilai adalah string sebelum menggunakan replace
      const parseNumber = (value) => {
        if (typeof value === 'string') {
          return parseFloat(value.replace(/,/g, '.'))
        } else if (typeof value === 'number') {
          return value
        } else {
          throw new Error(`Invalid number format: ${value}`)
        }
      }

      const mappedItem = {
        OrderID: item['Order ID'],
        OrderDate: orderDate,
        ShipDate: shipDate,
        ShipMode: item['Ship Mode'],
        CustomerID: item['Customer ID'],
        CustomerName: item['Customer Name'],
        Segment: item['Segment'],
        Country: item['Country'],
        City: item['City'],
        State: item['State'],
        PostalCode: parseInt(item['Postal Code'], 10),
        Region: item['Region'],
        ProductID: item['Product ID'],
        Category: item['Category'],
        SubCategory: item['Sub-Category'],
        ProductName: item['Product Name'],
        Sales: parseNumber(item['Sales']),
        Quantity: parseInt(item['Quantity'], 10),
        Discount: parseNumber(item['Discount']),
        Profit: parseNumber(item['Profit']),
        ProfitPerQuantity: parseNumber(item['Profit/Quantity']),
      }
      console.log(`Mapped record ${index + 1}:`, mappedItem)
      return mappedItem
    })

    // Validasi setiap item dalam data yang sudah di map
    for (let item of mappedData) {
      const { error } = superstoreValidationSchema.validate(item)
      if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`)
      }
    }

    await Superstore.insertMany(mappedData)
    res.json({ message: 'Dataset uploaded successfully.' })
  } catch (error) {
    console.error('Error uploading dataset:', error)
    if (
      error.message.startsWith('Validation error') ||
      error.message.startsWith('Invalid date format')
    ) {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

// API Endpoint untuk Mengupload GeoJSON
app.post('/api/upload-geojson', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    if (
      req.file.mimetype !== 'application/vnd.geo+json' &&
      req.file.mimetype !== 'application/json'
    ) {
      return res.status(400).json({ error: 'Only GeoJSON files are allowed' })
    }

    // Parse GeoJSON
    const geoJsonData = JSON.parse(req.file.buffer.toString())
    const geoData = new GeoData(geoJsonData)
    await geoData.save()
    res.json({ message: 'GeoJSON data uploaded successfully.' })
  } catch (error) {
    console.error('Error uploading GeoJSON:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// API Endpoint untuk Mendapatkan GeoJSON Data dari MongoDB
app.get('/api/geo-data', async (req, res) => {
  try {
    const geoData = await GeoData.find({})
    res.json(geoData)
  } catch (error) {
    console.error('Error fetching GeoJSON data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Middleware untuk menangani error dari multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message })
  } else if (err) {
    return res.status(400).json({ error: err.message })
  }
  next()
})

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
