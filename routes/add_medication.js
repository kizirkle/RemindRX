import express from 'express'
const addMedicationRouter = express.Router()
import path from 'path'

import {addMedication, getPatients} from '../database.js'

//Allowing for file paths to be created 
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);

//Access the addMedication page
addMedicationRouter.get("/", async(req,res) => {
    var filePath = path.join(__dirname, '../public/addMedication.html');
    res.sendFile(filePath)
})

//add a new medication to the database
addMedicationRouter.post("/", async (req, res) => {
    var {prescription_name,dose,start_date,end_date,frequency_hours,total_pills,side_effects,additional_notes,patient_id,provider_id} = req.body
    try {

        await addMedication(prescription_name,dose,start_date,end_date,frequency_hours,total_pills,side_effects,additional_notes,patient_id,provider_id)
        return res.json({passed: true})
    } catch (error) {
        console.error(error)
        return res.json({passed: false, message: "Error adding medication"})
    }
})

//find patient id based on first and last name
addMedicationRouter.post("/getPatientId", async(req,res) => {
    var {patientFirstName, patientLastName} = req.body;
    patientFirstName = patientFirstName.trim().toLowerCase();
    patientLastName = patientLastName.trim().toLowerCase();

    try {
        var patients = await getPatients()
        for (var i = 0; i < patients.length; i++) {
            if (patients[i].patient_first_name.toLowerCase() === patientFirstName && 
            patients[i].patient_last_name.toLowerCase() === patientLastName) {
                return res.json({passed: true, patient_id: patients[i].patient_id})
            }
        }
        return res.json({passed: false, message: "No patient found with that name."})
    } catch (error) {
        res.status(500).json({passed: false, message:'Error finding patient id.'})
    }
})

export default addMedicationRouter