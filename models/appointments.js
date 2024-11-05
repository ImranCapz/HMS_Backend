import mongoose from "mongoose";

const appointment = new mongoose.Schema({
    doctorId: { type: String, required: true },
    patientId: { type: String, required: true },
    patientType: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, default: "pending" },
    appointmentStart: { type: String, required: true },
    appointmentEnd: { type: String, required: true },
    hospitalId: { type: String, required: true },
    patientInfo: {},
    doctorInfo: {}
}, { timestamps: true })

export default mongoose.model('appointment', appointment)