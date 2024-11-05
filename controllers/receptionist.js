import receptionistModel from "../models/receptionist.js"
import hospitalInfoModel from "../models/hospitalInfo.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

const receptionist = () => {
    return {
        async receptionistAdd(req, res) {
            try {
                const { name, phone, email, password, hospitalId } = req.body
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

                const findHospital = await hospitalInfoModel.findOne({ hospitalId })
                if (findHospital == null) {
                    return res.status(403).send("Hospital Not found")
                }

                const findEmail = await receptionistModel.findOne({ email: email })
                const findPhone = await receptionistModel.findOne(({ phone: phone }))

                if (findEmail != null || findPhone != null) {
                    return res.status(403).send("Receptionist's Info Present")
                }

                const salt = await bcrypt.genSalt(10)
                const hashPass = await bcrypt.hash(password, salt)

                const receptionist = new receptionistModel({
                    name,
                    email,
                    phone,
                    hospitalId,
                    password: hashPass,

                })


                receptionist.save().then((response) => {
                    res.status(200).send("Receptionist Added Successfully")
                }).catch(err => {
                    res.status(500).send("Internal Server error " + err)
                })
            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async receptionistLogin(req, res) {
            try {
                const { email, password } = req.body
                if (!email || !password) {
                    return res.status(400).send("All field Required")
                }

                const findReceptionist = await receptionistModel.findOne({ email: email })
                if (findReceptionist == null) {
                    return res.status(403).send("Invalid Credintials")
                }

                const passwordMatch = await bcrypt.compare(password, findReceptionist.password)

                if (!passwordMatch) {
                    return res.status(403).send("Invalid Credintials")
                }

                const data = {
                    info: {
                        id: findReceptionist._id,
                        adminType: "Receptionist"
                    }
                }

                const jwtToken = jwt.sign(data, process.env.SECTRE_KEY)
                const ReceptionistInfo = {
                    token: jwtToken,
                    Id: findReceptionist._id,
                    adminType: "Receptionist",
                    hospitalId: findReceptionist.hospitalId
                }
                res.send(ReceptionistInfo)
            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async getAllReceptionist(req, res) {
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

                const getAllReceptionist = await receptionistModel.find({}).select("-password").sort({ createdAt: -1 })
                const getRepByHospital = getAllReceptionist.filter(Receptionist => Receptionist.hospitalId == hospitalId)
                res.send(getRepByHospital)
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

                const findProfile = await receptionistModel.findOne({ _id: id }).select("-password")

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

export default receptionist
