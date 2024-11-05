import bcrypt from 'bcrypt'
import doctorsModel from '../models/doctors.js'
import hospitalInfoModel from "../models/hospitalInfo.js"
import jwt from 'jsonwebtoken'

const doctorControllers = () => {
    return {
        async Login(req, res) {
            try {
                const { email, password } = req.body
                if (!email || !password) {
                    return res.status(400).send("All field Required")
                }

                const findDoctor = await doctorsModel.findOne({ email: email })
                if (findDoctor == null) {
                    return res.status(403).send("Invalid Credintials")
                }

                const passwordMatch = await bcrypt.compare(password, findDoctor.password)

                if (!passwordMatch) {
                    return res.status(403).send("Invalid Credintials")
                }

                const data = {
                    info: {
                        id: findDoctor._id,
                        adminType: "Doctor"
                    }
                }

                const jwtToken = jwt.sign(data, process.env.SECTRE_KEY)
                const DoctorInfo = {
                    token: jwtToken,
                    Id: findDoctor._id,
                    hospitalId: findDoctor.hospitalId,
                    adminType: "Doctor"
                }
                res.send(DoctorInfo)
            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async addDoctors(req, res) {
            try {
                const { name, email, phone, licenseNo, password, specialization, DOB, hospitalId } = req.body
                const headers = req.headers
                const data = jwt.decode(headers.token, process.env.SECTRE_KEY)

                if (data == null) {
                    return res.status(403).send("Access Denied")
                }

                if (data.info.adminType != 'hospitalAdmin') {
                    return res.status(403).send("Access Denied")
                }

                if (!name || !email || !licenseNo || !password) {
                    return res.status(400).send("All field Required")
                }

                if (!hospitalId) {
                    return res.status(403).send("Hospital id Required")
                }

                const findHospital = await hospitalInfoModel.findOne({ hospitalId: hospitalId })
                if (findHospital == null) {
                    return res.status(403).send("Hospital Not found")
                }

                const strongPassTrue = password.search(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
                if (strongPassTrue == -1) {
                    return res.status(400).send("Chose a Strong password")
                }

                if (phone.toString().length != 10) {
                    return res.status(400).send("Invalid Phone Number")
                }

                const findPhone = await doctorsModel.findOne({ phone: phone })
                const findEmail = await doctorsModel.findOne({ email: email })
                const findlicenseNo = await doctorsModel.findOne({ licenseNo: licenseNo })

                if (findPhone != null || findEmail != null || findlicenseNo != null) {
                    return res.status(400).send("Doctor's Info Present")
                }

                const salt = await bcrypt.genSalt(10)
                const hashPass = await bcrypt.hash(password, salt)

                const DoctorInfo = new doctorsModel({
                    name,
                    email,
                    phone,
                    licenseNo,
                    DOB,
                    specialization,
                    hospitalId,
                    password: hashPass
                })


                DoctorInfo.save().then(() => {
                    res.status(200).send("Doctor Added successfully")
                }).catch(err => {
                    res.status(500).send("Internal Server error " + err)
                })
            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async getAllDoctors(req, res) {
            try {
                const { hospitalId } = req.body

                if (!hospitalId) {
                    return res.status(403).send("Hospital Id Required")
                }

                const getAllDoctors = await doctorsModel.find().select("-password").sort({ createdAt: -1 })
                const getDoctorByHospital = getAllDoctors.filter(doctor => doctor.hospitalId == hospitalId)
                res.status(200).send(getDoctorByHospital)
            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async getDoctorByDept(req, res) {
            try {
                const { dept, hospitalId } = req.body
                if (!dept) {
                    return res.status(400).send("Department required")
                }

                if (!hospitalId) {
                    return res.status(403).send("Hospital Id required")
                }

                const getDoctor = await doctorsModel.find({ specialization: dept }).select("-password").sort({ createdAt: -1 })
                const getDoctorByHospital = getDoctor.filter(doctor => doctor.hospitalId == hospitalId)

                if (getDoctorByHospital.length === 0) {
                    return res.status(200).send("Doctor Not Found")
                }
                res.status(200).send(getDoctorByHospital)
            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async getAllDept(req, res) {
            try {
                const { hospitalId } = req.body


                if (!hospitalId) {
                    return res.status(403).send("Hospital Id required")
                }

                const getAllDoctor = await doctorsModel.find({})

                if (getAllDoctor == null) {
                    return res.status(400).send("No Doctors Added In System")
                }

                const getDoctorByHospital = getAllDoctor.filter(doctor => doctor.hospitalId == hospitalId)

                const dept = new Set(getDoctorByHospital.map((doctor) => doctor.specialization))
                res.status(200).send(Array.from(dept))

            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async getProfile(req, res) {
            try {
                const { id } = req.body
                if (!id) {
                    return res.status(403).send("Id required")
                }

                const findProfile = await doctorsModel.findOne({ _id: id }).select("-password")

                if (findProfile == null) {
                    return res.status(403).send("Invalid Id")
                }

                res.status(200).send(findProfile)

            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async deleteDoctor(req, res) {
            try {
                const { id } = req.body
                if (!id) {
                    return res.status(400).send("Access Denied")
                }

                const findDoctor = await doctorsModel.findOne({ _id: id })
                if (!findDoctor) {
                    return res.status(400).send("Access Denied")
                }

                doctorsModel.deleteOne({ _id: id }).then(() => {
                    res.status(200).send("Doctor Data Deleted Successfully")
                }).catch(err => {
                    res.status(500).send("Internal server error " + err)
                })
            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        }
    }
}

export default doctorControllers