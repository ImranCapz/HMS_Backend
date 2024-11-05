import mongoose from "mongoose";

const bookDiagonistic = new mongoose.Schema({
    patientId: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    hospitalId: { type: String, required: true },
    status: { type: String, default: "pending" },
    diagnosticsInfo: {},
    patientBasicInfo: {},
    labTestStatus: { type: String, default: "yet to test" },
    labTestResult: { type: String }
}, { timestamps: true })

export default mongoose.model('diagonisticBooking', bookDiagonistic)