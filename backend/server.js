// backend/server.js

// 1. Import Dependencies
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const multer = require('multer')
const csv = require('csvtojson')
const Joi = require('joi')
const morgan = require('morgan')
const helmet = require('helmet')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const dns = require('dns')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const auth = require('./middleware/auth')
const { v4: uuidv4 } = require('uuid')
const {
  Types: { ObjectId },
} = mongoose

// Import Models
const User = require('./models/User')
const GeoData = require('./models/GeoData')

// 2. Konfigurasi Middleware dan Environment
dotenv.config()
dayjs.extend(customParseFormat)
dns.setServers(['8.8.8.8', '1.1.1.1'])

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(helmet())

// 3. Koneksi ke MongoDB menggunakan MONGO_URI dari .env
const mongoURI = process.env.MONGO_URI
mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 5000, // Timeout setelah 5 detik
    // family: 4, // Paksa menggunakan IPv4
    // Additional options if needed
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err))

// Listener untuk connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB')
})

// Menangani proses termination untuk menutup koneksi secara bersih
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('Mongoose disconnected on app termination')
  process.exit(0)
})

// 4. Definisi Model
const superstoreSchema = new mongoose.Schema({
  uploadId: { type: String, required: true, index: true, default: 'manual' },
  uploadDate: { type: Date, default: Date.now },
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

// Indexing untuk performa
superstoreSchema.index({ Category: 1 })
superstoreSchema.index({ City: 1 })
superstoreSchema.index({ State: 1 })

const Superstore = mongoose.model('Superstore', superstoreSchema)

// Definisikan skema validasi menggunakan Joi
const superstoreValidationSchema = Joi.object({
  uploadId: Joi.string().optional(),
  uploadDate: Joi.date().optional(),
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

// 5. Definisi Rute

// Rute Utama
app.get('/', (req, res) => {
  res.send('Superstore Dashboard Backend is running.')
})

// Rute Register
app.post(
  '/api/register',
  [
    body('username')
      .isLength({ min: 3, max: 30 })
      .withMessage('Username harus antara 3 hingga 30 karakter'),
    body('email').isEmail().withMessage('Email tidak valid'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password harus minimal 6 karakter'),
  ],
  async (req, res) => {
    // Validasi Input
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { username, email, password } = req.body

    try {
      // Cek apakah pengguna sudah ada
      let user = await User.findOne({ $or: [{ email }, { username }] })
      if (user) {
        return res
          .status(400)
          .json({ error: 'Username atau email sudah digunakan' })
      }

      // Buat User Baru
      user = new User({
        username,
        email,
        password,
      })

      // Hash Password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)

      await user.save()

      // Buat JWT
      const payload = {
        id: user.id,
        username: user.username,
      }

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
      })

      res.json({ token, username: user.username })
    } catch (error) {
      console.error('Error during registration:', error)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// Rute Login
app.post(
  '/api/login',
  [
    body('username').not().isEmpty().withMessage('Username diperlukan'),
    body('password').not().isEmpty().withMessage('Password diperlukan'),
  ],
  async (req, res) => {
    // Validasi Input
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { username, password } = req.body

    try {
      // Cari User
      const user = await User.findOne({ username })
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' })
      }

      // Cek Password
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' })
      }

      // Buat JWT
      const payload = {
        id: user.id,
        username: user.username,
      }

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
      })

      res.json({ token, username: user.username })
    } catch (error) {
      console.error('Error during login:', error)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// Rute Terproteksi Contoh
app.get('/api/protected', auth, (req, res) => {
  res.json({
    message: `Hello, ${req.user.username}! This is a protected route.`,
  })
})

// 6. Konfigurasi Multer untuk Menangani Upload File
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

// 7. Fungsi untuk Memparsing Tanggal Menggunakan Day.js
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

// 8. Middleware untuk Menangani Error dari Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message })
  } else if (err) {
    return res.status(400).json({ error: err.message })
  }
  next()
})

// 9. API Endpoint untuk Mengupload Dataset (JSON dan CSV)
app.post(
  '/api/upload-dataset',
  auth,
  upload.single('file'),
  async (req, res) => {
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

        // Jika ada 'Row ID' di CSV, hapus
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

      const uploadId = uuidv4()
      const uploadDate = new Date() // Tanggal saat ini
      let processedRecords = 0

      // Map data sesuai skema dengan emit progress
      const mappedData = []
      for (let i = 0; i < parsedData.length; i++) {
        const item = parsedData[i]
        const orderDateString = item['Order Date'].trim()
        const shipDateString = item['Ship Date'].trim()

        const orderDate = parseDate(orderDateString, i + 1, 'OrderDate')
        const shipDate = parseDate(shipDateString, i + 1, 'ShipDate')

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
          uploadId,
          uploadDate,
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
        console.log(`Mapped record ${i + 1}:`, mappedItem)
        mappedData.push(mappedItem)

        processedRecords++
      }

      // Validasi setiap item dalam data yang sudah di map
      for (let item of mappedData) {
        const { error } = superstoreValidationSchema.validate(item)
        if (error) {
          throw new Error(`Validation error: ${error.details[0].message}`)
        }
      }

      await Superstore.insertMany(mappedData)
      res.json({
        message: 'Dataset uploaded successfully.',
        uploadId,
        uploadDate,
      })
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
  }
)

// API Endpoint untuk Mengupload GeoJSON
app.post(
  '/api/upload-geojson',
  auth,
  upload.single('file'),
  async (req, res) => {
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
  }
)

// API Endpoint untuk Mendapatkan GeoJSON Data dari MongoDB
app.get('/api/geo-data', auth, async (req, res) => {
  try {
    const geoData = await GeoData.find({})
    res.json(geoData)
  } catch (error) {
    console.error('Error fetching GeoJSON data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// API Endpoint untuk Mengambil Semua Data Superstore
app.get('/api/superstore-data', auth, async (req, res) => {
  try {
    const records = await Superstore.find({})
    res.json(records)
  } catch (error) {
    console.error('Error fetching all Superstore data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// API Endpoint untuk Menambahkan Data Superstore Secara Manual
app.post('/api/superstore-data', auth, async (req, res) => {
  try {
    const data = req.body

    // Validasi Data Menggunakan Joi
    const { error } = superstoreValidationSchema.validate(data)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    // Buat Dokumen Baru
    const newRecord = new Superstore(data)
    await newRecord.save()

    res
      .status(201)
      .json({ message: 'Data berhasil ditambahkan.', data: newRecord })
  } catch (error) {
    console.error('Error adding data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// API Endpoint untuk Mengambil Data Superstore Berdasarkan ID
app.get('/api/superstore-data/:id', auth, async (req, res) => {
  try {
    const { id } = req.params

    // Validasi ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format.' })
    }

    const record = await Superstore.findById(id)
    if (!record) {
      return res.status(404).json({ error: 'Data tidak ditemukan.' })
    }

    res.json(record)
  } catch (error) {
    console.error('Error fetching data by ID:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// API Endpoint untuk Memperbarui Data Superstore Berdasarkan ID
app.put('/api/superstore-data/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const updatedData = req.body

    // Validasi ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format.' })
    }

    // Validasi Data Menggunakan Joi
    const { error } = superstoreValidationSchema.validate(updatedData)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const record = await Superstore.findByIdAndUpdate(id, updatedData, {
      new: true,
    })
    if (!record) {
      return res.status(404).json({ error: 'Data tidak ditemukan.' })
    }

    res.json({ message: 'Data berhasil diperbarui.', data: record })
  } catch (error) {
    console.error('Error updating data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// API Endpoint untuk Menghapus Data Superstore Berdasarkan ID
app.delete('/api/superstore-data/:id', auth, async (req, res) => {
  try {
    const { id } = req.params

    // Validasi ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format.' })
    }

    const record = await Superstore.findByIdAndDelete(id)
    if (!record) {
      return res.status(404).json({ error: 'Data tidak ditemukan.' })
    }

    res.json({ message: 'Data berhasil dihapus.' })
  } catch (error) {
    console.error('Error deleting data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// API Endpoint untuk Menghapus Data Superstore Berdasarkan uploadId (Penghapusan Massal)
app.delete('/api/superstore-data/batch/:uploadId', auth, async (req, res) => {
  try {
    const { uploadId } = req.params

    // Validasi uploadId (format UUID jika diperlukan)
    if (!uploadId) {
      return res.status(400).json({ error: 'uploadId is required.' })
    }

    const result = await Superstore.deleteMany({ uploadId })

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: 'No records found for the given uploadId.' })
    }

    res.json({
      message: `${result.deletedCount} records deleted successfully.`,
    })
  } catch (error) {
    console.error('Error deleting records:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// API Endpoint untuk Menghapus Semua Data Superstore
app.delete('/api/superstore-data', auth, async (req, res) => {
  try {
    const result = await Superstore.deleteMany({})

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'No records found to delete.' })
    }

    res.json({
      message: `${result.deletedCount} records deleted successfully.`,
    })
  } catch (error) {
    console.error('Error deleting all records:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// API Endpoint untuk Mengambil Daftar Upload
app.get('/api/uploads', auth, async (req, res) => {
  try {
    // Menggunakan aggregation untuk mendapatkan daftar uploadId dengan jumlah record dan tanggal upload
    const uploads = await Superstore.aggregate([
      {
        $group: {
          _id: '$uploadId',
          recordCount: { $sum: 1 },
          uploadDate: { $first: '$uploadDate' }, // Asumsi OrderDate adalah tanggal upload
        },
      },
      {
        $project: {
          uploadId: '$_id',
          recordCount: 1,
          uploadDate: 1,
          _id: 0,
        },
      },
      {
        $sort: { uploadDate: -1 },
      },
    ])

    res.json(uploads)
  } catch (error) {
    console.error('Error fetching uploads data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
