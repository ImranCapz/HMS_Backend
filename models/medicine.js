import mongoose from "mongoose";

const medicine = new mongoose.Schema({
    appointmentId: { type: String,  required: true },
    patientId: { type: String,  required: true },
    medicine:{}
}, { timestamps: true })

export default mongoose.model('Medicine', medicine)