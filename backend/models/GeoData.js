// backend/models/GeoData.js
const mongoose = require('mongoose')

const geoDataSchema = new mongoose.Schema({
  type: { type: String, required: true }, // biasanya "FeatureCollection"
  features: [
    {
      type: { type: String, required: true }, // biasanya "Feature"
      geometry: {
        type: { type: String, required: true }, // misalnya "Polygon"
        coordinates: [[]], // koordinat
      },
      properties: {
        name: { type: String, required: true }, // nama state
        // tambahkan properti lain jika diperlukan
      },
    },
  ],
})

const GeoData = mongoose.model('GeoData', geoDataSchema)

module.exports = GeoData
