import mongoose from "mongoose";

const doctorSchama = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, },
    licenseNo: { type: String, required: true, unique: true },
    DOB: { type: String },
    specialization: { type: String },
    hospitalId: { type: String, required: true },
    password: { type: String }
}, { timestamps: true })

export default mongoose.model('Doctor', doctorSchama)