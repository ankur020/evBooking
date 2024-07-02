import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price:{
        type:Number,
        required:true
    },
  },
  {
    timestamps: true,
  }
);

stationSchema.index({ location: '2dsphere' });

export const Station = mongoose.model('Station', stationSchema);