import hospitalAdminModel from "../models/hospitalAdmin.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const hospitalAdmin = () => {
    return {
        async hospitalAdminCreation(req, res) {
            try {
                const { firstName, lastName, phone, email, dob, age, basicAddress, city, state, pincode, password } = req.body

                if (!password) {
                    return res.status(400).send("Password is required")
                }
                const strongPassTrue = password.search(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
                if (strongPassTrue == -1) {
                    return res.status(400).send("Chose a Strong password")
                }

                if (phone.length != 10) {
                    return res.status(400).send("Enter a Valid Phone")
                }

                const findPhone = await hospitalAdminModel.findOne({ phone: phone })
                if (findPhone != null) {
                    return res.status(400).send("Phone Number exist")
                }

                const findEmail = await hospitalAdminModel.findOne({ email: email })
                if (findEmail != null) {
                    return res.status(400).send("Email exist")
                }

                const salt = await bcrypt.genSalt(10)
                const hashPass = await bcrypt.hash(password, salt)

                const adminData = new hospitalAdminModel({
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    email: email,
                    dob: dob,
                    age: age,
                    basicAddress: basicAddress,
                    city: city,
                    state: state,
                    pincode: pincode,
                    password: hashPass
                })

                adminData.save().then((respons) => {
                    res.status(200).send("Hospital Admin Created Successfully")
                }).catch((err) => {
                    res.status(500).send("Internal Server Error " + err)
                })


            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async hospitalAdminLogin(req, res) {
            try {

                const { email, password } = req.body
                if (!email || !password) {
                    return res.status(400).send("All field Required")
                }

                const Admin = await hospitalAdminModel.findOne({ email: email })
                if (Admin == null) {
                    return res.status(400).send("Invalid Email or Password")
                }

                const compPass = await bcrypt.compare(password, Admin.password)

                if (!compPass) {
                    return res.status(400).send("Invalid Email or Password")
                }

                const data = {
                    info: {
                        id: Admin._id,
                        adminType: "hospitalAdmin"
                    }
                }

                const jwt_Token = jwt.sign(data, process.env.SECTRE_KEY)
                const userInfo = {
                    token: jwt_Token,
                    Id: Admin._id,
                    hospitalId: Admin.hospitalId == undefined ? "NA" : Admin.hospitalId,
                    adminType: "hospitalAdmin"
                }
                res.status(200).json(userInfo)


            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async getHospitalAdmin(req, res) {
            try {
                const { id } = req.body
                if (!id) {
                    return res.status(403).send("Id required")
                }

                const hospitalAdmin = await hospitalAdminModel.findOne({ _id: id }).select("-password")

                if (hospitalAdmin == null) {
                    return res.status(403).send("Hospital Admin Not Found")
                }

                res.status(200).send(hospitalAdmin)

            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        }
    }
}

export default hospitalAdmin
