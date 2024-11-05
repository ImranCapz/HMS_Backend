import appointmentsModel from "../models/appointments.js"
import patientBasicInfoModel from "../models/patientBasicInfo.js"
import bookDiagonisticModel from "../models/bookDiagonistic.js"

const emr = () => {
    return {
        async getAllAppointments(req, res) {
            try {
                const { patientId } = req.body
                if (!patientId) {
                    return res.status(403).send("Patient Id required")
                }

                const findPatient = await patientBasicInfoModel.findOne({ _id: patientId })
                if (findPatient == null) {
                    return res.status(403).send("Invalid Patient Id")
                }

                const getPatient = await appointmentsModel.find({ patientId })
                res.send(getPatient)
            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async getAllDiagnostics(req, res) {
            try {

                const { patientId } = req.body
                if (!patientId) {
                    return res.status(403).send("Patient Id required")
                }

                const findPatient = await patientBasicInfoModel.findOne({ _id: patientId })
                if (findPatient == null) {
                    return res.status(403).send("Invalid Patient Id")
                }

                const getDiagnostics = await bookDiagonisticModel.find({ patientId })
                res.status(200).send(getDiagnostics)

            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        }
    }
}

export default emr
