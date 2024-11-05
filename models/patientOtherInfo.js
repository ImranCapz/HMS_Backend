import mongoose from "mongoose";

const patientOtherInfo = new mongoose.Schema({
    patientId: { type: String, required: true },
    hospitalId: { type: String, required: true },
    appointmentId: { type: String, required: true, unique: true },
    diagnostics: {},
    familyInfo: {},
    medicalProblem: {},
    riskFactor: {},
    diagnosis: { type: String },
    medicine: [],
    vitals: {},
    basicStatus: { type: Boolean }
}, { timestamps: true })

export default mongoose.model('patientOtherInfo', patientOtherInfo)