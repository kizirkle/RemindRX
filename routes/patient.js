import express from 'express'
const patientRouter = express.Router()

import {getPatientById} from '../database.js'

//Access patient portal of specific patient
patientRouter.get("/:id", async(req,res) => {
    var patient = await getPatientById(req.params.id)
    return res.render('patientPortal.ejs', {patientName: `${patient.patient_first_name} ${patient.patient_last_name}`})
})

export default patientRouter