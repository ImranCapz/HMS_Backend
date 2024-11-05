import mongoose from "mongoose";

const Receptionist = new mongoose.Schema({
    name: { type: String },
    phone: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    hospitalId: { type: String, required: true },
    password: { type: String, required: true }
}, { timestamps: true })

export default mongoose.model('Receptionist', Receptionist)