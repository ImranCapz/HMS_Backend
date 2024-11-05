import mongoose from "mongoose";

const billing = new mongoose.Schema({
    patientId: { type: String, required: true },
    hospitalId: { type: String, required: true },
    bill: {},
}, { timestamps: true })

export default mongoose.model('billing', billing)