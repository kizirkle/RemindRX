//Add Medications Router

import express from 'express'
const addMedicationRouter = express.Router()
import path from 'path'

import {
        addMedication, 
        getPatientById, 
        getPatientProvider, 
        getMedicationWithinDates
    } from '../database.js'

//Allowing for file paths to be created 
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);

//Access the addMedication page
addMedicationRouter.get("/", async(req,res) => {
    res.status(200).render("addMedication.ejs")
})

//Add a new medication to the database
addMedicationRouter.post("/", async (req, res) => {
    var {prescription_name, dose, start_date, end_date, frequency_hours, total_pills, side_effects, additional_notes, patient_first_name, patient_last_name, patient_id, provider_id} = req.body
    try {
        var patientExists = await getPatientById(patient_id)
        if (!patientExists || patientExists.patient_first_name.trim().toLowerCase() !== patient_first_name.trim().toLowerCase() || patientExists.patient_last_name.trim().toLowerCase() !== patient_last_name.trim().toLowerCase()) {
            //If there is no patient with ID or the first or last name does not math the name associated with the ID, returns an error message
            return res.status(200).json({passed: false, message: `No patient found.`})
        } 
        var providersForPatient = await getPatientProvider(patient_id, provider_id)
        if(!providersForPatient) {
            //If the patient is not associated with the provider, returns an error message
            return res.status(200).json({passed: false, message: `No patient found.`})
        }
        var medicationOverlap = await getMedicationWithinDates(patient_id, prescription_name, start_date, end_date)
        if(medicationOverlap.length !== 0) {
            //If the medication has already been added, returns an error message
            return res.status(200).json({passed: false, message: `${prescription_name} has already been added for ${patient_first_name} ${patient_last_name}.`})
        }
        if(dose > total_pills) {
            //If the dose is greater than the total number of pills, returns an error message
            return res.status(200).json({passed: false, message: `Dose must be less than total number of pills.`})
        }
        if (process.env.NODE_ENV !== 'test') {
            //If the patient exists and is associated with the provider, create new prescription entry
            await addMedication(prescription_name,dose,start_date,end_date,frequency_hours,total_pills,side_effects,additional_notes,patient_id,provider_id)
            return res.status(201).json({passed: true})
        }
        return res.status(201).json({passed: true})
    } catch{
        res.status(500).json({passed: false, message:'Error in Add Medication.'})
    }
})

export default addMedicationRouter