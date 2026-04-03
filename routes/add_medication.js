import express from 'express'
const addMedicationRouter = express.Router()
import path from 'path'

import {addMedication, getPatientById, getPatientProvider, getCurrentMedicationsByName} from '../database.js'

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

//Add a new medication to the database
addMedicationRouter.post("/", async (req, res) => {
    var {prescription_name, dose, start_date, end_date, frequency_hours, total_pills, side_effects, additional_notes, patient_first_name, patient_last_name, patient_id, provider_id} = req.body
    try {
        var patientExists = await getPatientById(patient_id)
        if (!patientExists || patientExists.patient_first_name !== patient_first_name || patientExists.patient_last_name !== patient_last_name) {
            //If there is no patient with ID or the first or last name does not math the name associated with the ID, returns an error message
            return res.json({passed: false, message: `No patient found.`})
        } 
        var providersForPatient = await getPatientProvider(patient_id, provider_id)
        if(!providersForPatient) {
            //If the patient is not associated with the provider, returns an error message
            return res.json({passed: false, message: `No patient found.`})
        }
        var medication = await getCurrentMedicationsByName(prescription_name, patient_id)
        if(medication.length !== 0) {
            //If the medication has already been added, returns an error message
            return res.json({passed: false, message: `${prescription_name} has already been added for ${patient_first_name} ${patient_last_name}.`})
        }
        if(dose > total_pills) {
            //If the dose is greater than the total number of pills, returns an error message
            return res.json({passed: false, message: `Dose must be less than total number of pills.`})
        }
        if (process.env.NODE_ENV !== 'test') {
            //If the patient exists and is associated with the provider, create new prescription entry
            await addMedication(prescription_name,dose,start_date,end_date,frequency_hours,total_pills,side_effects,additional_notes,patient_id,provider_id)
            return res.json({passed: true})
        }
        return res.json({passed: true})
    } catch{
        res.status(500).json({passed: false, message:'Error in Add Medication.'})
    }
})

//find patient id based on first and last name
// addMedicationRouter.post("/getPatientId", async(req,res) => {
//     var {patientFirstName, patientLastName} = req.body;
//     patientFirstName = patientFirstName.trim().toLowerCase();
//     patientLastName = patientLastName.trim().toLowerCase();

//     try {
//         var patients = await getPatients()
//         for (var i = 0; i < patients.length; i++) {
//             if (patients[i].patient_first_name.toLowerCase() === patientFirstName && 
//             patients[i].patient_last_name.toLowerCase() === patientLastName) {
//                 return res.json({passed: true, patient_id: patients[i].patient_id})
//             }
//         }
//         return res.json({passed: false, message: "No patient found with that name."})
//     } catch (error) {
//         res.status(500).json({passed: false, message:'Error finding patient id.'})
//     }
// })

export default addMedicationRouter