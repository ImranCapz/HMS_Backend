import nurseModel from '../models/nurse.js'
import hospitalInfoModel from "../models/hospitalInfo.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const nurse = () => {
    return {
        async nurseAdd(req, res) {
            try {
                const { name, phone, email, password, nurseId, DOB, hospitalId } = req.body
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

                const findEmail = await nurseModel.findOne({ email: email })
                const findPhone = await nurseModel.findOne(({ phone: phone }))
                const findnurseId = await nurseModel.findOne(({ licenseNo: nurseId }))

                if (findEmail != null || findPhone != null || findnurseId != null) {
                    return res.status(403).send("Nurse's Info Present")
                }

                const salt = await bcrypt.genSalt(10)
                const hashPass = await bcrypt.hash(password, salt)

                const nurse = new nurseModel({
                    name,
                    email,
                    phone,
                    DOB,
                    licenseNo: nurseId,
                    hospitalId,
                    password: hashPass
                })


                nurse.save().then((response) => {
                    res.status(200).send("Nurse Added Successfully")
                }).catch(err => {
                    res.status(500).send("Internal Server error " + err)
                })


            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async nurseLogin(req, res) {
            try {
                const { email, password } = req.body
                if (!email || !password) {
                    return res.status(400).send("All field Required")
                }

                const findNurse = await nurseModel.findOne({ email: email })
                if (findNurse == null) {
                    return res.status(403).send("Invalid Credintials")
                }

                const passwordMatch = await bcrypt.compare(password, findNurse.password)

                if (!passwordMatch) {
                    return res.status(403).send("Invalid Credintials")
                }

                const data = {
                    info: {
                        id: findNurse._id,
                        adminType: "Nurse"
                    }
                }

                const jwtToken = jwt.sign(data, process.env.SECTRE_KEY)
                const NurseInfo = {
                    token: jwtToken,
                    Id: findNurse._id,
                    hospitalId: findNurse.hospitalId,
                    adminType: "Nurse"
                }


                res.send(NurseInfo)

            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async getAllNurse(req, res) {
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
                    return res.status(403).send("Hospital id required")
                }

                const getAllNurse = await nurseModel.find({}).select("-password").sort({ createdAt: -1 })
                const getnurseByHospital = getAllNurse.filter(nurse => nurse.hospitalId == hospitalId)
                res.send(getnurseByHospital)
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

                const findProfile = await nurseModel.findOne({ _id: id }).select("-password")

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

export default nurse
