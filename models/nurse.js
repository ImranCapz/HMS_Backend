import mongoose from "mongoose";

const Nurse = new mongoose.Schema({
    name: { type: String },
    phone: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    DOB: { type: String },
    licenseNo: { type: String },
    hospitalId: { type: String, required: true },
    password: { type: String, required: true },
},{ timestamps: true })

export default mongoose.model('Nurse', Nurse)