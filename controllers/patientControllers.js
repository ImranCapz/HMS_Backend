import patientModel from "../models/patientBasicInfo.js"
import patientOtherInfo from "../models/patientOtherInfo.js"
import hospitalInfoModel from "../models/hospitalInfo.js"
import appointmentsModel from "../models/appointments.js"
import doctorsModel from "../models/doctors.js"

const patientsControllers = () => {

    const generateUserId = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";

        const randomLetter = () =>
            letters.charAt(Math.floor(Math.random() * letters.length));
        const randomNumber = () =>
            numbers.charAt(Math.floor(Math.random() * numbers.length));

        return (
            randomLetter() +
            randomLetter() +
            randomNumber() +
            randomNumber() +
            randomNumber() +
            randomNumber()
        );
    };

    return {
        async addPatientsBasicInfo(req, res) {
            try {
                const { patientFirstName, patientLastName, maritalStatus, patientDOB, patientEmail, phoneno, patientAge, landmark, localityAddress, patientCity, patientState, hospitalId, familyInfo, riskFactor } = req.body

                if (!hospitalId) {
                    return res.status(403).send("Hospital id Required")
                }

                if (!patientFirstName) {
                    return res.status(400).send("First Name Required")
                }

                if (!phoneno) {
                    return res.status(400).send("Phone Number Required")
                }


                if (phoneno.length != 10) {
                    return res.status(400).send("Invalid Phone Number")
                }

                const findHospital = await hospitalInfoModel.findOne({ hospitalId })
                if (findHospital == null) {
                    return res.status(403).send("Hospital Not found")
                }


                const findPhone = await patientModel.findOne({ phoneno: phoneno })
                if (findPhone != null) {
                    return res.status(403).send("Phone Number Exist")
                }

                if (patientEmail !== "") {
                    const findPatientEmail = await patientModel.findOne({ patientEmail: patientEmail })
                    if (findPatientEmail != null) {
                        return res.status(403).send("Email Id Exist")
                    }
                }


                //****************UHID Part*****************

                //Createing Unique Id
                let uhid;
                let userExists;


                // Ensure the generated PatientId is unique
                do {
                    uhid = generateUserId();
                    userExists = await patientModel.findOne({ uhid, })
                } while (userExists);

                //Save data Into db
                const patientInfo = new patientModel({
                    patientFirstName,
                    patientLastName,
                    maritalStatus,
                    patientDOB,
                    patientEmail,
                    phoneno,
                    patientAge,
                    landmark,
                    localityAddress,
                    patientCity,
                    patientState,
                    uhid,
                    hospitalId,
                    familyInfo,
                    riskFactor
                })

                const info = {
                    uhid: uhid,
                    patientid: patientInfo._id,
                }


                patientInfo.save().then(() => {
                    res.status(200).send(info)
                }).catch(err => {
                    res.status(500).send("Internal Server error " + err)
                })

            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async addpatientOtherInfo(req, res) {
            try {
                const { patientId, diagnostics, familyInfo, medicalProblem, riskFactor, vitals, hospitalId, appointmentId, diagnosis, medicine, basicStatus } = req.body

                if (!patientId || !diagnostics || !familyInfo || !medicalProblem || !riskFactor || !vitals) {
                    return res.status(403).send("All field Required")
                }

                if (!hospitalId) {
                    return res.status(403).send("Hospital id Required")
                }

                if (!patientId) {
                    return res.status(403).send("Patiend Id Required")
                }

                if (!appointmentId) {
                    return res.status(403).send("Appointment Id Required")
                }

                const findAppointment = await patientOtherInfo.findOne({ appointmentId })

                if (findAppointment !== null) {
                    return res.status(400).send("Appointment Id present")
                }

                const findHospital = await hospitalInfoModel.findOne({ hospitalId })
                if (findHospital == null) {
                    return res.status(403).send("Hospital Not found")
                }

                const Data = new patientOtherInfo({
                    patientId,
                    diagnostics,
                    familyInfo,
                    medicalProblem,
                    riskFactor,
                    vitals,
                    hospitalId,
                    appointmentId,
                    diagnosis,
                    medicine,
                    basicStatus
                })

                Data.save().then(() => {
                    res.status(200).send("Patient Other Info Added")
                }).catch(err => {
                    res.status(500).send("Internal Server Error" + err)
                })
            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async updatePatentOterInfo(req, res) {
            try {
                const { appointmentId, medicalProblem, diagnosis, diagnostics, medicine } = req.body

                if (!appointmentId) {
                    return res.status(400).send("AppointmentId Required")
                }

                const findAppointment = await appointmentsModel.findOne({ _id: appointmentId })

                if (findAppointment == null) {
                    return res.status(400).send("Appointment not found")
                }

                const findOtherInfo = await patientOtherInfo.findOne({ appointmentId })

                findOtherInfo.medicalProblem = medicalProblem
                findOtherInfo.diagnosis = diagnosis
                findOtherInfo.diagnostics = diagnostics
                findOtherInfo.medicine = medicine

                findOtherInfo.save().then(() => {
                    res.send("Data Updated Successfully")
                }).catch(err => {
                    res.status(500).send('Internal Server Error ' + err)
                });

            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async getPatient(req, res) {
            try {
                const { uhid, phone } = req.body

                let query = {};

                if (phone && phone.length === 10) {
                    query = { 'phoneno': phone };
                }

                if (uhid) {
                    query = { ...query, 'uhid': uhid };
                }

                if (Object.keys(query).length === 0) {
                    return res.status(400).send("Invalid parameters");
                }

                const getPatientInfo = await patientModel.find({ $or: [query] });

                if (getPatientInfo.length === 0) {
                    return res.status(400).send("Patiend Not Found")
                }
                res.status(200).send(getPatientInfo)
            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async getAllPatient(req, res) {
            try {
                const { hospitalId } = req.body

                if (!hospitalId) {
                    return res.status(403).send("Hospital id Required")
                }

                const findHospital = await hospitalInfoModel.findOne({ hospitalId })
                if (findHospital == null) {
                    return res.status(403).send("Hospital Not found")
                }

                const getPatient = await patientModel.find().sort({ createdAt: -1 })
                const getPatientbyHospital = getPatient.filter(patients => patients.hospitalId == hospitalId)
                res.status(200).send(getPatientbyHospital)
            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async deletePatient(req, res) {
            try {
                const { id } = req.body
                if (!id) {
                    return res.status(403).status("Access Denied")
                }

                const findPatient = await patientModel.findOne({ _id: id })

                if (!findPatient) {
                    return res.status(403).send("Patient Not Found")
                }

                patientModel.deleteOne({ _id: id }).then(() => {
                    res.status(200).send("Patiend Deleted Successfully")
                }).catch(err => {
                    res.status(500).send("Internal Server Error " + err)
                })
            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async getPrescription(req, res) {
            try {
                const { patientId, appointmentId } = req.body

                if (!patientId || !appointmentId) {
                    return res.status(403).send("Patient Id and Appointment Id required")
                }

                const getPatientinfo = await patientModel.findOne({ _id: patientId })

                if (getPatientinfo == null) {
                    return res.status(403).send("invalid Patient Id")
                }

                const getOtherInfo = await patientOtherInfo.findOne({ appointmentId })
                const findAppointMent = await appointmentsModel.findOne({ _id: appointmentId })


                const getDoctor = await doctorsModel.findOne({ _id: findAppointMent.doctorId }).select("-password")



                const data = {
                    patientBasicInfo: getPatientinfo,
                    patientOtherInfo: getOtherInfo,
                    DoctorInfo: getDoctor
                }

                res.status(200).send(data)
            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async getPatientOtherInfo(req, res) {
            try {
                const { appointmentId } = req.body

                if (!appointmentId) {
                    return res.status(400).send("Appointment Id Required")
                }

                const otherInfo = await patientOtherInfo.findOne({ appointmentId })
                res.status(200).send(otherInfo)
            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async analytics(req, res) {
            try {
                const { hospitalId } = req.body

                if (!hospitalId) {
                    return res.status(403).send("Hospital id Required")
                }

                const findHospital = await hospitalInfoModel.findOne({ hospitalId })
                if (findHospital == null) {
                    return res.status(403).send("Hospital Not found")
                }

                const getPatient = await appointmentsModel.find({})

                const getPatientByHospital = getPatient.filter(patient => patient.hospitalId == hospitalId)

                const inPatient = getPatientByHospital.filter(patient => patient.patientType.toLowerCase() == 'in patient')
                const outPatient = getPatientByHospital.filter(patient => patient.patientType.toLowerCase() == 'out patient')

                const today = new Date();
                const todayFormatted = today.toISOString().split('T')[0];

                const todayAppointments = getPatientByHospital.filter(appointment => {
                    const createdAtDate = new Date(appointment.createdAt);
                    const createdAtFormatted = createdAtDate.toISOString().split('T')[0];

                    return createdAtFormatted === todayFormatted;
                });

                const data = {
                    inPatient: inPatient.length,
                    outPatient: outPatient.length,
                    todayPatient: todayAppointments.length
                }

                res.send(data)



            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async getPatientsById(req, res) {
            try {
                const { patientId } = req.body
                if (!patientId) {
                    return res.status(400).send({
                        message: "Patient Id required",
                        code: 400
                    })
                }
                const getPatientInfo = await patientModel.findById(patientId)
                res.status(200).send({
                    data: getPatientInfo,
                    status: 'ok',
                    code: 200
                })
            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async editPatientBasicInfo(req, res) {
            try {
                const { _id, patientFirstName, patientLastName, phoneno, patientEmail, patientAge } = req.body

                if (!phoneno) return res.status(202).send({ code: 202, message: "Phone No Required" });
                if (!_id) return res.status(202).send({ code: 202, message: "Patient id Required" });

                //Search patient
                const findPatient = await patientModel.findOne({ _id, })

                if (!findPatient) return res.status(202).send({ code: 202, message: "Invalid Patient Id" });

                //Check Phone 
                const findPhone = await patientModel.findOne({ phoneno: phoneno })
                if (findPhone != null && findPhone._id != _id) return res.status(202).send({ code: 202, message: "Phone Number Exist" });

                //check Email
                const findEmail = await patientModel.findOne({ phoneno: phoneno })
                if (findEmail != null && findEmail._id != _id) return res.status(202).send({ code: 202, message: "Email Exist" });

                const updatePatient = await patientModel.findByIdAndUpdate(_id, {
                    patientFirstName,
                    patientLastName,
                    phoneno,
                    patientEmail,
                    patientAge
                }, { new: true })

                if (!updatePatient) return res.status(202).send({ code: 202, message: "Unable to update Patient" });

                res.status(200).send({ code: 200, message: "Patient Updated Successfully" })

            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        }
    }
}

export default patientsControllers