import mongoose from "mongoose";

const hospitalAdmin = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    dob: { type: String },
    age: { type: Number },
    basicAddress: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    hospitalId: { type: String, unique: true },
    password: { type: String, required: true }
}, { timestamps: true })

export default mongoose.model('hospitalAdmin', hospitalAdmin)