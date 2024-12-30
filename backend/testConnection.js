// testConnection.js

const dns = require('dns')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Set DNS resolver ke Google DNS
dns.setServers(['8.8.8.8', '1.1.1.1'])

// Load environment variables dari .env
dotenv.config()

const mongoURI = process.env.MONGO_URI

console.log('Attempting to connect to MongoDB...')
mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 5000, // Timeout setelah 5 detik
  })
  .then(() => {
    console.log('MongoDB connected successfully')
    mongoose.connection.close()
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
  })
