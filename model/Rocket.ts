import mongoose, { Schema } from 'mongoose'

const rocketSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  diameter: {
    type: Number,
    required: true
  },
  mass: {
    type: Number,
    required: true
  },
  photo: {
    type: String
  }
})

export default mongoose.model('Rocket', rocketSchema)
