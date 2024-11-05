import hospitalInfoModel from "../models/hospitalInfo.js"
import hospitalAdminModal from "../models/hospitalAdmin.js"
import bcrypt from 'bcrypt'

const hospitalInfo = () => {
    return {
        async hosptalAdd(req, res) {
            try {
                const { hospitalName, password, imageUrl, adminId } = req.body
                if (!hospitalName || !password) {
                    return res.status(400).send("All field Required")
                }

                if (!adminId) {
                    return res.status(403).send("Hospital Admin Id required")
                }

                const findhospitalAdmin = await hospitalAdminModal.findOne({ _id: adminId })

                if (findhospitalAdmin == null) {
                    return res.status(403).send("Invalid Admin")
                }

                const strongPassTrue = password.search(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
                if (strongPassTrue == -1) {
                    return res.status(400).send("Chose a Strong password")
                }

                const hospitalId = Math.floor(100000 + Math.random() * 900000)
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password, salt)

                const hospitalInfo = new hospitalInfoModel({
                    hospitalName,
                    password: hashPassword,
                    imageUrl,
                    hospitalId: hospitalId
                })


                const Data = {
                    hospitalId: hospitalInfo.hospitalId
                }

                await hospitalAdminModal.updateOne({ _id: adminId },
                    {
                        $set: {
                            hospitalId
                        }
                    }
                )

                hospitalInfo.save().then(() => {
                    res.status(200).send(Data)
                }).catch(err => {
                    res.status(500).send("Unable to save " + err)
                })

            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }
        },
        async hosptalInfoGet(req, res) {
            try {
                const { hospitalId } = req.body

                if (!hospitalId) {
                    return res.status(400).send("Hospital Id required")
                }


                const getinfo = await hospitalInfoModel.findOne({ hospitalId: hospitalId }).select('-password')

                if (getinfo == null) {
                    return res.send("Hospital Not Found")
                }

                res.status(200).send(getinfo)

            } catch (error) {
                res.status(500).send("Some error is Going on -- " + error)
            }

        }
    }
}

export default hospitalInfo
