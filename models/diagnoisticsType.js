import mongoose from "mongoose";

const diagnoisticsType = new mongoose.Schema({
    diagnoisticsName: { type: String },
    diagnoisticsSubGroup: {},
    hospitalId: { type: String, required: true }
})

export default mongoose.model('DiagnoisticsType', diagnoisticsType)