import billingModel from "../models/billing.js"
import hospoitalModel from '../models/hospitalInfo.js'
import patientBasicInfoModel from '../models/patientBasicInfo.js'

const billing = () => {
    return {
        async addBilling(req, res) {
            try {
                const { bill, patientId, hospitalId } = req.body

                if (!bill || !patientId || !hospitalId) {
                    return res.status(403).send("All field Required")
                }

                if (bill.length == 0) {
                    return res.status(403).send("Billing Info required")
                }

                let isBroken = false
                bill.map(item => {
                    if (!item.subject || !item.amount || !item.paid) {
                        isBroken = true;
                    }
                })
                if (isBroken) {
                    return res.status(403).send("Broken Bill")
                }


                const findHospital = await hospoitalModel.findOne({ hospitalId })
                if (findHospital == null) {
                    return res.status(403).send("Hospital Not found")
                }

                const findPatient = await patientBasicInfoModel.findOne({ _id: patientId })

                if (findPatient == null) {
                    return res.status(403).send("Patient not Found")
                }

                const formatedData = bill.map(item => ({
                    bill: item,
                    patientId: patientId,
                    hospitalId: hospitalId
                }))

                for (const item of formatedData) {
                    const data = new billingModel({
                        patientId: item.patientId,
                        hospitalId: item.hospitalId,
                        bill: item.bill
                    })

                    await data.save()
                }

                res.status(200).send("Bill added successfully")

            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async getBilling(req, res) {
            try {
                const { hospitalId, patientId } = req.body

                if (!patientId || !hospitalId) {
                    return res.status(403).send("All field Required")
                }

                const findHospital = await hospoitalModel.findOne({ hospitalId })
                if (findHospital == null) {
                    return res.status(403).send("Hospital Not found")
                }

                const findPatient = await patientBasicInfoModel.findOne({ _id: patientId })

                if (findPatient == null) {
                    return res.status(403).send("Patient not Found")
                }

                const getAllBill = await billingModel.find({}).sort({ createdAt: -1 })
                const getBillingByPatientAndHospital = getAllBill.filter(bill => bill.patientId == patientId && bill.hospitalId == hospitalId)
                res.send(getBillingByPatientAndHospital)

            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        },
        async updateBilling(req, res) {
            try {
                const { id, amount } = req.body
                if (!id || !amount) {
                    return res.status(403).send("All field required")
                }

                const findbilling = await billingModel.findOne({ _id: id })

                if (findbilling == null) {
                    return res.status(403).send("Invalid Billing id")
                }

                billingModel.updateOne({ _id: id }, {
                    $set: {
                        "bill.paid": amount
                    }
                }).then(() => {
                    return res.status(200).send("Updated successfully")
                }).catch(err => {
                    return res.status(500).send("Internal server error " + err)
                })

            } catch (error) {
                res.status(500).send("Internal Server error " + error)
            }
        }
    }
}

export default billing
