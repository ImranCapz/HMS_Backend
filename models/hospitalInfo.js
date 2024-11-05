import mongoose from "mongoose";

const hospitalInfo = new mongoose.Schema({
    hospitalName: { type: String },
    password: { type: String, required: true },
    imageUrl: { type: String, },
    hospitalId: { type: String, unique: true }
}, { timestamps: true })

export default mongoose.model('hospitalInfo', hospitalInfo)