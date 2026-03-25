import express from 'express'
const patientRouter = express.Router()
import path from 'path'

import {getPatientById, getProviderById, getPatientProvider, createPatientProvider, getPatients} from '../database.js'

//Allowing for file paths to be created 
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);

//Opens form to add a new provider
patientRouter.get("/:id/add_provider", async(req, res) => {
    var filePath = path.join(__dirname, '../public/addProvider.html');
    res.sendFile(filePath)
})

//Connect provider to patient upon patient entering valid provider ID
patientRouter.post("/:id/add_provider", async(req, res) => {
    var{patient_id, provider_id, provider_first_name, provider_last_name} = req.body
    try {
        var providerExists = await getProviderById(provider_id)
        if (!providerExists || providerExists.provider_first_name !== provider_first_name ||providerExists.provider_last_name !== provider_last_name) {
            //If there is no provider with ID or the first or last name does not math the name associated with the ID, returns an error message
            return res.json({passed: false, message: `No healthcare provider found.`})
        } 
        var providerPatientAssociationExists = await getPatientProvider(patient_id, provider_id)
        if (providerPatientAssociationExists) {
            //If the patient as already associated with the provider in the database, returns an error message 
            return res.json({passed: false, message: `Healthcare provider ${providerExists.provider_first_name} ${providerExists.provider_last_name} has already been added.`})
        }
        //If the provider ID exists and is not already associated with patient, creates new entry in PatientProvider table and return to patient portal
        createPatientProvider(patient_id, provider_id)
        return res.json({passed: true, patientPage: `/patient/${patient_id}`})
    } catch{
        res.status(500).json({passed: false, message:'Error in Add Provider.'})
    }
})

//Access patient portal of specific patient
patientRouter.get("/:id", async(req,res) => {
    var patient = await getPatientById(req.params.id)
    return res.render('patientPortal.ejs', {
        patientName: `${patient.patient_first_name} ${patient.patient_last_name}`,
        providerPortal: `/patient/${req.params.id}/add_provider`
    })
})

//find patient id based on first and last name
patientRouter.get("/findPatientId", async(req,res) => {
    var {patientFirstName, patientLastName} = req.body
    try {
        var patients = await getPatients()
        for (var i = 0; i < patients.length; i++) {
            if (patients[i].patient_first_name === patientFirstName && patients[i].patient_last_name === patientLastName) {
                return res.json({passed: true, patient_id: patients[i].patient_id})
            }
            else{
                return res.json({passed: false, message: "No patient found with that name."})
            }
        }
    } catch (error) {
        res.status(500).json({passed: false, message:'Error finding patient id.'})
    }
})

export default patientRouter