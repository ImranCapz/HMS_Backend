import appointmentModel from "../models/appointments.js"
import patientBasicInfoModel from '../models/patientBasicInfo.js'
import hospitalInfoModel from "../models/hospitalInfo.js"
import doctorsModel from "../models/doctors.js"
import medicineModel from "../models/medicine.js"
import jwt from 'jsonwebtoken'

const appointment = () => {
    return {
        async add(req, res) {
            try {
                const { doctorId, patientId, patientType, date, time, hospitalId } = req.body
                if (!doctorId || !patientId || !patientType || !date || !time) {
                    return res.status(400).send("All field required")
                }

                if (!hospitalId) {
                    return res.status(403).send("Hospital id Required")
                }

                const findHospital = await hospitalInfoModel.findOne({ hospitalId: hospitalId })
                if (findHospital == null) {
                    return res.status(403).send("Hospital Not found")
                }

                const findPatient = await patientBasicInfoModel.findOne({ _id: patientId })

                if (findPatient == null) {
                    return res.status(403).send("Patient not Found")
                }

                const findDoctor = await doctorsModel.findOne({ _id: doctorId }).select('-password')

                if (findDoctor == null) {
                    return res.status(403).send("Doctor not Found")
                }

                //2023-11-01  //13:30 - 14:30
                //2023-11-01T13:30:00
                //2023-11-01T14:30:00

                //2023-11-18T10:00:00

                const [startTime, endTime] = time.split(' - ');
                const startDateTime = `${date}T${startTime}:00`
                const endDateTime = `${date}T${endTime}:00`

                // res.send(`start:${startDateTime} end:${endDateTime}`)

                const appointmentInfo = new appointmentModel({
                    doctorId: doctorId,
                    patientId: patientId,
                    patientType: patientType,
                    date: date,
                    time: time,
                    patientInfo: findPatient,
                    doctorInfo: findDoctor,
                    appointmentStart: startDateTime,
                    appointmentEnd: endDateTime,
                    hospitalId: hospitalId
                })

                appointmentInfo.save().then((response) => {
                    res.status(200).send(`Appontment Sent to ${appointmentInfo.doctorInfo.name}`)
                }).catch(err => {
                    res.status(500).send("Unable to save " + err)
                })
            } catch (error) {
                res.status(500).send("Internal Server error " + err)
            }
        },
        async changeStatus(req, res) {
            try {
                const { status, appointmentId } = req.body
                if (!status || !appointmentId) {
                    return res.status(400).send("All field Required")
                }

                const findAppointment = await appointmentModel.findOne({ _id: appointmentId })
                if (findAppointment == null) {
                    return res.status(403).send("Access denided")
                }

                appointmentModel.updateOne({ _id: appointmentId },
                    {
                        $set: {
                            status: status
                        }
                    }
                ).then(() => {
                    res.status(200).send("status updated Successfully")
                }).catch(err => {
                    res.status(500).send("Internal server error " + err)
                })
            } catch (error) {
                res.status(500).send("Internal Server error " + err)
            }
        },
        async DoctorAppointmentGet(req, res) {
            try {
                const headers = req.headers
                const data = jwt.decode(headers.token, process.env.SECTRE_KEY)

                if (data == null) {
                    return res.status(403).send("Access Denied")
                }


                if (data.info.adminType != 'Doctor') {
                    return res.status(403).send("Access Denied")
                }

                const getAllAppointments = await appointmentModel.find({})

                const getDoctorAppointments = getAllAppointments.filter(appointment => appointment.doctorId == data.info.id)

                res.status(200).send(getDoctorAppointments)
            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async getInPatientAppointment(req, res) {
            try {
                const { hospitalId } = req.body
                if (!hospitalId) {
                    return res.status(403).send("Hospital Id Required")
                }
                const getAllAppointments = await appointmentModel.find({})
                const getAllAppointmentsByHospital = getAllAppointments.filter(appointment => appointment.hospitalId == hospitalId)
                const getInPatientAppointments = getAllAppointmentsByHospital.filter(appointment => appointment.patientType == 'In Patient')
                res.send(getInPatientAppointments)
            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async getOutPatientAppointment(req, res) {
            try {
                const { hospitalId } = req.body
                if (!hospitalId) {
                    return res.status(403).send("Hospital Id Required")
                }
                const getAllAppointments = await appointmentModel.find({})
                const getAllAppointmentsByHospital = getAllAppointments.filter(appointment => appointment.hospitalId == hospitalId)
                const getInPatientAppointments = getAllAppointmentsByHospital.filter(appointment => appointment.patientType == 'Out Patient')
                res.send(getInPatientAppointments)
            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async getPendingPatientAppointment(req, res) {
            try {
                const { doctorId } = req.body
                if (!doctorId) {
                    return res.status(403).send("Doctor Id required")
                }
                const getAllAppointments = await appointmentModel.find({ doctorId: doctorId })
                if (getAllAppointments.length == 0) {
                    return res.status(200).send("Appointment not found")
                }
                const Appointments = getAllAppointments.filter(appointment => appointment.status.toLowerCase() === 'pending')
                if (Appointments.length == 0) {
                    return res.status(200).send("Appointment not found")
                }
                res.send(Appointments)
            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async getApprovedPatientAppointment(req, res) {
            try {
                const { doctorId } = req.body
                if (!doctorId) {
                    return res.status(403).send("Doctor Id required")
                }

                const getAllAppointments = await appointmentModel.find({ doctorId: doctorId })

                if (getAllAppointments.length == 0) {
                    return res.status(200).send("Appointment not found")
                }
                const Appointments = getAllAppointments.filter(appointment => appointment.status.toLowerCase() === 'approved')

                if (Appointments.length == 0) {
                    return res.status(200).send("Some appointments are pending Not Confierm Yeat")
                }
                res.send(Appointments)
            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async getAllAppointments(req, res) {
            try {
                const { hospitalId } = req.body
                if (!hospitalId) {
                    return res.status(403).send("Hospital Id Required")
                }

                const findHospital = await hospitalInfoModel.findOne({ hospitalId: hospitalId })
                if (findHospital == null) {
                    return res.status(403).send("Hospital Not found")
                }

                const getAllAppointments = await appointmentModel.find({}).sort({ createdAt: -1 })
                const getAllAppointmentsByHospital = getAllAppointments.filter(appointment => appointment.hospitalId == hospitalId)
                res.status(200).send(getAllAppointmentsByHospital)
            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async addmedicine(req, res) {
            try {
                const { medicine, appointmentId, patientId } = req.body;

                if (!medicine || !appointmentId || !patientId) {
                    return res.status(400).send("All field Required")
                }

                const findAppointment = await appointmentModel.find({ _id: appointmentId })
                const patientBasicInfo = await patientBasicInfoModel.find({ _id: patientId })

                if (findAppointment == null) {
                    return res.status(400).send("Invalid Appointment Id")
                }


                if (patientBasicInfo == null) {
                    return res.status(400).send("Invalid Patient Id")
                }

                const medicineData = new medicineModel({
                    medicine,
                    appointmentId,
                    patientId
                })

                medicineData.save().then(response => {
                    res.status(200).send("Medicine Added")
                }).catch(err => {
                    res.status(500).send("Internal server Error " + err)
                })

            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        }
    }
}

export default appointment
