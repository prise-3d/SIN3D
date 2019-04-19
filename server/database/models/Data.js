'use strict'

import mongoose, { Schema } from 'mongoose'

export default mongoose.model('Data', new Schema({
  date: {
    type: Date,
    default: () => new Date()
  },
  data: Object
}))
