import mongoose from "mongoose";

const patient = new mongoose.Schema({
    patientFirstName: { type: String, reuqire: true },
    patientLastName: { type: String },
    maritalStatus: { type: String },
    patientDOB: { type: String },
    patientEmail: { type: String, },
    phoneno: { type: String, reuqire: true, unique: true },
    patientAge: { type: String },
    landmark: { type: String },
    localityAddress: { type: String },
    patientCity: { type: String },
    patientState: { type: String },
    uhid: { type: String, unique: true, required: true },
    hospitalId: { type: String, required: true },
    familyInfo: {},
    riskFactor: {}

}, { timestamps: true })

export default mongoose.model('patientBasicInfo', patient)