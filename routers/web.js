import patientsControllers from "../controllers/patientControllers.js"
import doctorControllers from "../controllers/doctorControllers.js"
import hospitalAdmin from "../controllers/hospitalAdmin.js"
import receptionist from "../controllers/receptionist.js"
import nurse from "../controllers/nurse.js"
import pa from "../controllers/pa.js"
import diagnostics from "../controllers/diagnostics.js"
import appointment from "../controllers/appointment.js"
import hospitalInfo from "../controllers/hospitalInfo.js"
import uploadController from "../controllers/uploadController.js"
import multerUpload from '../middleware/malter.js'
import jwtVerify from "../middleware/jwtVerify.js"
import emr from "../controllers/emr.js"
import billing from "../controllers/billing.js"
import multerPdfUpload from '../middleware/malterPdf.js'


const web = (app) => {
    app.post('/admin/hospitaladmin', hospitalAdmin().hospitalAdminCreation) //admin ----Hospital Admin Creation  
    app.post('/login/admin/hospitaladmin', hospitalAdmin().hospitalAdminLogin) //admin ----Hospital Admin Login
    app.post('/admin/hospitaladmin/get/info', jwtVerify, hospitalAdmin().getHospitalAdmin) //admin ----Hospital Admin get admin info

    app.post('/patients/add', jwtVerify, patientsControllers().addPatientsBasicInfo) //Patients ----patient Add Basic Info
    app.post('/patients/otherinfo/add', jwtVerify, patientsControllers().addpatientOtherInfo) //patients ---patient Other info (Vilat,family,Risk,Medical,Diagnostics) 
    app.put('/patients/otherinfo/add', jwtVerify, patientsControllers().updatePatentOterInfo) //patients ---Update patient Other info (Vilat,family,Risk,Medical,Diagnostics) 
    app.post('/patients/otherinfo/get', jwtVerify, patientsControllers().getPatientOtherInfo) //Patient --- get patient OterInfo
    app.post('/patients/get', jwtVerify, patientsControllers().getPatient) //Patients ---get individual patients
    app.post('/patients/getall', jwtVerify, patientsControllers().getAllPatient) //patients --- get all patient according to Hospital
    app.delete('/patients/delete', jwtVerify, patientsControllers().deletePatient) //patients --- delete patients 
    app.post('/patients/prescription/get', jwtVerify, patientsControllers().getPrescription) //patients --- Prescription get 
    app.post('/patients/analytics/get', jwtVerify, patientsControllers().analytics) //Patient --- get patient analytics
    app.post('/patients/get/id', jwtVerify, patientsControllers().getPatientsById) //Patient --- get patient analytics
    app.put('/patients/edit', jwtVerify, patientsControllers().editPatientBasicInfo) //Patient --- edit Patient 


    app.post('/doctor/add', jwtVerify, doctorControllers().addDoctors) //Doctors ----- add     
    app.post('/doctor/getall', jwtVerify, doctorControllers().getAllDoctors) //Doctors --------Get all doctor
    app.post('/doctor/get/dept', jwtVerify, doctorControllers().getDoctorByDept) //Doctors -------get all doctor Dept
    app.post('/doctor/login', doctorControllers().Login) //Doctor -----Login
    app.post('/doctor/dept', jwtVerify, doctorControllers().getAllDept) //Docror ----get All Dept
    app.post('/doctor/profile/get', jwtVerify, doctorControllers().getProfile) //Docror ----get docto's profile
    app.delete('/doctor/delete', jwtVerify, doctorControllers().deleteDoctor) //Doctors ----- delete Doctor

    app.post('/receptionist/add', jwtVerify, receptionist().receptionistAdd) //Receptionist --- Creation
    app.post('/receptionist/login', receptionist().receptionistLogin) //Receptionist --- Login
    app.post('/receptionist/get', jwtVerify, receptionist().getAllReceptionist) //Receptionist --- get all Receptionist
    app.post('/receptionist/profile/get', jwtVerify, receptionist().getProfile) //Receptionist --- get Receptionist Profile

    app.post('/nurse/add', jwtVerify, nurse().nurseAdd) //Nurse --------add
    app.post('/nurse/login', nurse().nurseLogin) //Nurse -------login
    app.post('/nurse/get', jwtVerify, nurse().getAllNurse) //Nurse -------All all Nurse
    app.post('/nurse/profile/get', jwtVerify, nurse().getProfile) //Nurse -------get Nurse profile

    app.post('/pa/add', jwtVerify, pa().paAdd) //Pa --------add
    app.post('/pa/login', pa().paLogin) //Pa -------login
    app.post('/pa/get', jwtVerify, pa().getAllPa) //Pa -------get All PA
    app.post('/pa/profile/get', jwtVerify, pa().getProfile) //Pa -------get profile of PA 


    app.post('/diagnostics/add', jwtVerify, diagnostics().diagnosticsAdd) //Diagnostics --------add some worker to manage
    app.post('/diagnostics/login', diagnostics().diagnosticsLogin) //Diagnostics -------login
    app.post('/diagnostics/get', jwtVerify, diagnostics().getAllDiagnostics) //Diagnostics ------- get all diagnostics
    app.post('/diagnostics/info/add', jwtVerify, diagnostics().addDiagnosticsInfo) // Adding types of diagnostics
    app.post('/diagnostics/info/get', jwtVerify, diagnostics().getDiagosticsInfo) // Get all types of diagnostics
    app.post('/diagnostics/book', jwtVerify, diagnostics().bookDiagontics) // Diagnostics -------- Book diagnostics
    app.post('/diagnostics/book/get', jwtVerify, diagnostics().getBookDiagontics) // Diagnostics -------- Get Book diagnostics
    app.post('/diagnostics/status/change', jwtVerify, diagnostics().changeDiagnosticsStatusChange) // Diagnostics -------- Change Status
    app.post('/diagnostics/profile/get', jwtVerify, diagnostics().getProfile) // Diagnostics -------- get profile of Diagonistic
    app.post('/diagnostics/labtest/status/change', jwtVerify, diagnostics().updateLabTestStatus) // Diagnostics -------- update Diagonistic Lab Status
    app.post('/diagnostics/labtest/status/get', jwtVerify, diagnostics().getLabTestStatus) // Diagnostics -------- get Diagonistic Lab Status
    app.post('/diagnostics/labtest/results/upload', jwtVerify, multerPdfUpload.single('pdf'), diagnostics().upoladPdf) // Diagnostics -------- Upload Lab Results

    app.post('/appointment/add', jwtVerify, appointment().add) //appointment -------add
    app.post('/appointment/status/change', jwtVerify, appointment().changeStatus) //appointment -------status Change 
    app.get('/appointment/doctor/get', jwtVerify, appointment().DoctorAppointmentGet) // appointment ------get doctor appointment
    app.post('/appointment/inpatient/get', jwtVerify, appointment().getInPatientAppointment) // appointment ------get In Patient appointment
    app.post('/appointment/outpatient/get', jwtVerify, appointment().getOutPatientAppointment) // appointment ------get In Patient appointment
    app.post('/appointment/status/pending/get', jwtVerify, appointment().getPendingPatientAppointment) // appointment ------get Pending appointment
    app.post('/appointment/status/approved/get', jwtVerify, appointment().getApprovedPatientAppointment) // appointment ------get Approved appointment
    app.post('/appointment/get', jwtVerify, appointment().getAllAppointments) // appointment ------get All appointment
    app.post('/appointment/medicine/add', jwtVerify, appointment().addmedicine) // appointment ------Add Medicine  

    app.post('/hospital/add', jwtVerify, hospitalInfo().hosptalAdd)//Hospital -------add 
    app.post('/hospital/get', jwtVerify, hospitalInfo().hosptalInfoGet)//Hospital -------Info get 

    app.post('/emr/appointment/get/all', jwtVerify, emr().getAllAppointments)
    app.post('/emr/diagnostics/get/all', jwtVerify, emr().getAllDiagnostics)

    app.post('/billing/add', jwtVerify, billing().addBilling) //Billing ---------add Billings
    app.post('/billing/get', jwtVerify, billing().getBilling) //Billing ---------Get Billings
    app.put('/billing/update', jwtVerify, billing().updateBilling) //Billing ----Update Billings

    app.post('/upload/img', jwtVerify, multerUpload.single('photo'), uploadController().uploadimg) //upload imge
}

export default web