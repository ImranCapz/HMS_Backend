import paModel from '../models/Pa.js'
import hospitalInfoModel from "../models/hospitalInfo.js"
import doctorsModel from '../models/doctors.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const pa = () => {
    return {
        async paAdd(req, res) {
            try {
                const { name, phone, email, password, doctorEmail, hospitalId } = req.body
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

                if (!doctorEmail) {
                    return res.status(400).send("Doctor's Email Required")
                }

                const findEmail = await paModel.findOne({ email: email })
                const findPhone = await paModel.findOne(({ phone: phone }))

                if (findEmail != null || findPhone != null) {
                    return res.status(403).send("Pa's Info Present")
                }

                const salt = await bcrypt.genSalt(10)
                const hashPass = await bcrypt.hash(password, salt)

                const nurse = new paModel({
                    name,
                    email,
                    phone,
                    doctorEmail,
                    hospitalId,
                    password: hashPass,
                })


                nurse.save().then((response) => {
                    res.status(200).send("Pa Added Successfully")
                }).catch(err => {
                    res.status(500).send("Internal Server error " + err)
                })


            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async paLogin(req, res) {
            try {
                const { email, password } = req.body
                if (!email || !password) {
                    return res.status(400).send("All field Required")
                }

                const findPa = await paModel.findOne({ email: email })
                if (findPa == null) {
                    return res.status(403).send("Invalid Credintials")
                }

                const passwordMatch = await bcrypt.compare(password, findPa.password)

                if (!passwordMatch) {
                    return res.status(403).send("Invalid Credintials")
                }

                // const odcrotEmail = findPa.doctorEmail
                const doctorInfo = await doctorsModel.findOne({ email: findPa.doctorEmail }).select("-password")

                const data = {
                    info: {
                        id: findPa._id,
                        adminType: "Pa"
                    }
                }

                const jwtToken = jwt.sign(data, process.env.SECTRE_KEY)
                const PaInfo = {
                    token: jwtToken,
                    Id: findPa._id,
                    hospitalId: findPa.hospitalId,
                    adminType: "Pa",
                    doctor_id: doctorInfo._id
                }


                res.status(200).send(PaInfo)

            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async getAllPa(req, res) {
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
                    return res.status(403).send("Hospital id Required")
                }

                const getAllPa = await paModel.find({}).select("-password").sort({ createdAt: -1 })
                const getAllPaByHospital = getAllPa.filter(pa => pa.hospitalId == hospitalId)
                res.send(getAllPaByHospital)
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

                const findProfile = await paModel.findOne({ _id: id }).select("-password")

                if (findProfile == null) {
                    return res.status(403).send("Invalid Id")
                }

                res.status(200).send(findProfile)

            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        }
    }
}

export default pa
