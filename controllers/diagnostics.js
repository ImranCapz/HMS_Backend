import diagnosticsModel from "../models/diagnostics.js"
import hospitalInfoModel from "../models/hospitalInfo.js"
import diagnoisticsTypeModel from "../models/diagnoisticsType.js"
import patientBasicInfoModel from '../models/patientBasicInfo.js'
import bookDiagonisticModel from "../models/bookDiagonistic.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const diagnostics = () => {
    return {
        async diagnosticsAdd(req, res) {
            try {
                const { phone, email, password, hospitalId } = req.body
                const headers = req.headers
                const data = jwt.decode(headers.token, process.env.SECTRE_KEY)

                if (data == null) {
                    return res.status(403).send("Access Denied")
                }

                if (data.info.adminType != 'hospitalAdmin') {
                    return res.status(403).send("Access Denied")
                }

                if (!hospitalId) {
                    return res.status(403).send("Hospital id Required")
                }

                const findHospital = await hospitalInfoModel.findOne({ hospitalId: hospitalId })
                if (findHospital == null) {
                    return res.status(403).send("Hospital Not found")
                }

                const findEmail = await diagnosticsModel.findOne({ email: email })
                const findPhone = await diagnosticsModel.findOne(({ phone: phone }))

                if (findEmail != null || findPhone != null) {
                    return res.status(403).send("diagnostics Info Present")
                }

                const salt = await bcrypt.genSalt(10)
                const hashPass = await bcrypt.hash(password, salt)

                const diagnostics = new diagnosticsModel({
                    email,
                    phone,
                    hospitalId,
                    password: hashPass
                })


                diagnostics.save().then((response) => {
                    res.status(200).send("Diagnostics Info Added Successfully")
                }).catch(err => {
                    res.status(500).send("Internal Server error " + err)
                })


            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async diagnosticsLogin(req, res) {
            try {
                const { email, password } = req.body
                if (!email || !password) {
                    return res.status(400).send("All field Required")
                }

                const findDiagnostics = await diagnosticsModel.findOne({ email: email })
                if (findDiagnostics == null) {
                    return res.status(403).send("Invalid Credintials")
                }

                const passwordMatch = await bcrypt.compare(password, findDiagnostics.password)

                if (!passwordMatch) {
                    return res.status(403).send("Invalid Credintials")
                }

                const data = {
                    info: {
                        id: findDiagnostics._id,
                        adminType: "Diagnostics"
                    }
                }

                const jwtToken = jwt.sign(data, process.env.SECTRE_KEY)
                const DiagnosticsInfo = {
                    token: jwtToken,
                    Id: findDiagnostics._id,
                    hospitalId: findDiagnostics.hospitalId,
                    adminType: "Diagnostics"
                }

                res.send(DiagnosticsInfo)

            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async getAllDiagnostics(req, res) {
            try {
                const { hospitalId } = req.body
                const headers = req.headers
                const data = jwt.decode(headers.token, process.env.SECTRE_KEY)

                if (data == null) {
                    return res.status(403).send("Access Denied")
                }

                if (data.info.adminType != 'hospitalAdmin') {
                    return res.status(403).send("Access Denied")
                }

                if (!hospitalId) {
                    return res.status(403).send("Hospital Id required")
                }

                const getAllDiagnostics = await diagnosticsModel.find({}).select("-password")
                const getDiagnosticsByHospital = getAllDiagnostics.filter(digo => digo.hospitalId == hospitalId)
                res.send(getDiagnosticsByHospital)
            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async addDiagnosticsInfo(req, res) {
            try {
                const { hospitalId, diagnoisticsName, diagnoisticsSubGroup } = req.body

                if (!diagnoisticsSubGroup || !diagnoisticsName) {
                    return res.status(400).send("Diagnoistics Info Required")
                }

                if (!hospitalId) {
                    return res.status(403).send("Hospital id Required")
                }

                const findHospital = await hospitalInfoModel.findOne({ hospitalId })
                if (findHospital == null) {
                    return res.status(403).send("Hospital Not found")
                }

                const diagnoisticsData = new diagnoisticsTypeModel({
                    diagnoisticsName,
                    diagnoisticsSubGroup,
                    hospitalId
                })

                diagnoisticsData.save().then(() => {
                    res.status(200).send("Data Saved Successfully")
                }).catch(err => {
                    res.status(500).send("Internal Server Error" + err)
                })

            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async getDiagosticsInfo(req, res) {
            try {
                const { hospitalId } = req.body

                if (!hospitalId) {
                    return res.status(403).send("Hospital id Required")
                }

                const findHospital = await hospitalInfoModel.findOne({ hospitalId })
                if (findHospital == null) {
                    return res.status(403).send("Hospital Not found")
                }

                const getDiagnoisticsType = await diagnoisticsTypeModel.find()

                const getDiagnoisticsTypeByHospital = getDiagnoisticsType.filter(diagn => diagn.hospitalId == hospitalId)
                res.send(getDiagnoisticsTypeByHospital)

            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async bookDiagontics(req, res) {
            try {

                const { patientId, diagnosticsInfo, date, time, hospitalId } = req.body

                if (!patientId || !diagnosticsInfo || !date || !time || !hospitalId) {
                    return res.status(403).send("All field Required")
                }

                if (!hospitalId) {
                    return res.status(403).send("Hospital id Required")
                }

                const findHospital = await hospitalInfoModel.findOne({ hospitalId })
                if (findHospital == null) {
                    return res.status(403).send("Hospital Not found")
                }


                const findPatient = await patientBasicInfoModel.findOne({ _id: patientId }).select('-password')
                if (findPatient == null) {
                    return res.status(403).send("Patient Not Found")
                }

                const data = new bookDiagonisticModel({
                    patientId,
                    patientBasicInfo: findPatient,
                    diagnosticsInfo,
                    date,
                    time,
                    hospitalId
                })

                data.save().then(() => {
                    res.status(200).send("Appointment Booked Successfully")
                }).catch((err) => {
                    res.status(500).send("Internal Server error " + err)
                })

            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async getBookDiagontics(req, res) {
            try {
                const { hospitalId } = req.body

                if (!hospitalId) {
                    return res.status(403).send("Hospital id Required")
                }

                const findHospital = await hospitalInfoModel.findOne({ hospitalId })
                if (findHospital == null) {
                    return res.status(403).send("Hospital Not found")
                }

                const getDiagnois = await bookDiagonisticModel.find().sort({ createdAt: -1 })
                const getDiagnoisByHospital = getDiagnois.filter(Diagnois => Diagnois.hospitalId == hospitalId)

                res.status(200).send(getDiagnoisByHospital)
            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async changeDiagnosticsStatusChange(req, res) {
            try {
                const { diagnostiscId, hospitalId, status } = req.body

                if (!hospitalId) {
                    return res.status(403).send("Hospital id Required")
                }

                if (!diagnostiscId) {
                    return res.status(403).send("Diagnostisc Id required")
                }

                if (!status) {
                    return res.status(403).send("Status Required")
                }

                const findHospital = await hospitalInfoModel.findOne({ hospitalId })
                if (findHospital == null) {
                    return res.status(403).send("Hospital Not found")
                }

                const findDiagnoistics = await bookDiagonisticModel.findOne({ _id: diagnostiscId })
                if (findDiagnoistics == null) {
                    return res.status(403).send("Invalid Diagnostisc id")
                }

                bookDiagonisticModel.updateOne({ _id: diagnostiscId },
                    {
                        $set: {
                            status: status
                        }
                    }
                ).then(() => {
                    res.status(200).send("Status Updated successfully")
                }).catch(err => {
                    res.status(500).send("Internal Sever Error" + err)
                })


            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async getProfile(req, res) {
            try {
                const { id } = req.body
                if (!id) {
                    return res.status(403).send("Id required")
                }

                const findProfile = await diagnosticsModel.findOne({ _id: id }).select("-password")

                if (findProfile == null) {
                    return res.status(403).send("Invalid Id")
                }

                res.status(200).send(findProfile)

            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async updateLabTestStatus(req, res) {
            try {
                const { hospitalId, diagonisticId, labTestStatus } = req.body
                if (!hospitalId) {
                    return res.status(400).send({
                        message: "Hospital id Required",
                        code: 400,
                        status: "Bad Request"
                    })
                }

                if (!diagonisticId) {
                    return res.status(400).send({
                        message: "Diagnostisc Id required",
                        code: 400,
                        status: "Bad Request"
                    })
                }


                const findHospital = await hospitalInfoModel.findOne({ hospitalId })
                if (findHospital == null) {
                    return res.status(403).send({
                        message: "Hospital Not found",
                        code: 403,
                        status: "Forbidden"
                    })
                }

                const findDiagnoistics = await bookDiagonisticModel.findOne({ _id: diagonisticId })
                if (findDiagnoistics == null) {
                    return res.status(403).send({
                        message: "Invalid Diagnostisc id",
                        code: 403,
                        status: "Forbidden"
                    })
                }

                bookDiagonisticModel.updateOne({ _id: diagonisticId },
                    {
                        $set: {
                            labTestStatus,
                        }
                    }
                ).then((response => {
                    res.status(200).send({
                        message: "Updated Successfully",
                        code: 200,
                        status: "ok"
                    })
                })).catch(err => {
                    res.status(200).send({
                        message: "" + err,
                        status: "Internal server Error",
                        code: 500
                    })
                })

            } catch (error) {
                return (
                    res.status(200).send({
                        message: "" + error,
                        status: "Internal server Error",
                        code: 500
                    })
                )
            }
        },
        async getLabTestStatus(req, res) {
            try {
                const { hospitalId, diagonisticId, labTestStatus } = req.body
                if (!hospitalId) {
                    return res.status(400).send({
                        message: "Hospital id Required",
                        code: 400,
                        status: "Bad Request"
                    })
                }

                if (!diagonisticId) {
                    return res.status(400).send({
                        message: "Diagnostisc Id required",
                        code: 400,
                        status: "Bad Request"
                    })
                }


                const findHospital = await hospitalInfoModel.findOne({ hospitalId })
                if (findHospital == null) {
                    return res.status(403).send({
                        message: "Hospital Not found",
                        code: 403,
                        status: "Forbidden"
                    })
                }

                const findDiagnoistics = await bookDiagonisticModel.findOne({ _id: diagonisticId })
                if (findDiagnoistics == null) {
                    return res.status(403).send({
                        message: "Invalid Diagnostisc id",
                        code: 403,
                        status: "Forbidden"
                    })
                }

                res.status(200).send({
                    data: findDiagnoistics.labTestStatus,
                    message: "Lab Test Status",
                    code: 200,
                    status: "ok"
                })
            } catch (error) {
                return (
                    res.status(500).send({
                        message: "" + error,
                        status: "Internal server Error",
                        code: 500
                    })
                )
            }
        },
        async upoladPdf(req, res) {
            try {

                const { hospitalId, _id } = req.body;

                const findHospital = await hospitalInfoModel.findOne({ hospitalId })
                if (findHospital == null) {
                    return res.status(403).send({
                        message: "Hospital Not found",
                        code: 403,
                        status: "Forbidden"
                    })
                }

                const findDiagnoistics = await bookDiagonisticModel.findOne({ _id })
                if (findDiagnoistics == null) {
                    return res.status(403).send({
                        message: "Invalid Diagnostisc id",
                        code: 403,
                        status: "Forbidden"
                    })
                }

                bookDiagonisticModel.updateOne({ _id },
                    {
                        $set: {
                            labTestResult: req.file.filename,
                        }
                    }
                ).then(() => {
                    res.send({
                        message: "File uploaded Successfully",
                        status: "ok",
                        code: 200
                    })
                }).catch(error => {
                    res.status(500).send({
                        message: "" + error,
                        status: "Internal server Error",
                        code: 500
                    })
                })

            } catch (error) {
                res.status(500).send({
                    message: "" + error,
                    status: "Internal server Error",
                    code: 500
                })
            }
        }
    }
}

export default diagnostics
