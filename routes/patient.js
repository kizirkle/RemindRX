import express from 'express'
const patientRouter = express.Router()
import path from 'path'

import {getPatientById, getProviderById, getPatientProvider, createPatientProvider, getProviderIds, getProviderNames, getProviderFromPatient, getMedicationsForPatient, getMedicationNamesByPatientId, getPrescriptionById, createLogEntry} from '../database.js'

//Allowing for file paths to be created 
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);


//Opens form to add a new provider
patientRouter.get("/:id/add_provider", async(req, res) => {
    return res.render('addProvider.ejs', {
        patientPortal: `/patient/${req.params.id}` 
    })
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
        if (process.env.NODE_ENV !== 'test') {
            createPatientProvider(patient_id, provider_id)
            return res.json({passed: true, patientPage: `/patient/${patient_id}`})
        }
        return res.json({passed: true})
    } catch{
        res.status(500).json({passed: false, message:'Error in Add Provider.'})
    }
})

//Opens medications that have been added for patient
patientRouter.get("/:id/medications", async(req, res) => {
    var patient = await getPatientById(req.params.id)
    if (!patient) {
        return res.status(404).send("Patient not found");
    }
    var medications = await getMedicationsForPatient(patient.patient_id)
    return res.render('medications.ejs', {
        patientPortal: `/patient/${req.params.id}`, 
        medications: medications
    })
})

//Opens page for patient to log medications
patientRouter.get("/:id/log", async(req, res) => {
    var patient = await getPatientById(req.params.id)
    if (!patient) {
        return res.status(404).send("Patient not found");
    }
    var medications = await getMedicationNamesByPatientId(patient.patient_id)
    return res.render('logIntake.ejs', {
        patientPortal: `/patient/${req.params.id}`, 
        medications: medications
    })
})

//Logs medication status for patient
patientRouter.post("/:id/log", async(req, res) => {
    var{status, intake_date, intake_time, additional_notes, patient_id, prescription_id} = req.body
    try {
        if(status === "taken") {
            createLogEntry(status, intake_date, intake_time, additional_notes, patient_id, prescription_id)
        } else {
            createLogEntry(status, null, null, additional_notes, patient_id, prescription_id)
        }
        return res.json({passed: true, patientPage: `/patient/${patient_id}`})
    } catch{
        res.status(500).json({passed: false, message:'Error in Add Provider.'})
    }
})

//View patient profile
patientRouter.get("/:id/profile", async(req, res) => {
    var patient = await getPatientById(req.params.id)
    if (!patient) {
        return res.status(404).send("Patient not found");
    }
    var providersForPatient = await getProviderFromPatient(patient.patient_id) 
    var providerNameList = []
    if (providersForPatient.length !== 0) {
        var providersById = await getProviderIds(patient.patient_id)
        var providerIds = providersById.map(provider => provider.provider_id)
        var providerNames = await getProviderNames(providerIds)
        providerNames.forEach((provider) => {
            providerNameList.push(`${provider.provider_first_name} ${provider.provider_last_name}`)
        })
    } 
    return res.render('patientProfile.ejs', {
        patientName: `${patient.patient_first_name} ${patient.patient_last_name}`, 
        patientId:`${patient.patient_id}`, 
        patientEmail: `${patient.patient_email}`,
        patientPhoneNumber: `${patient.patient_phone_number}`, 
        providers: providerNameList, 
        addProvider: `/patient/${req.params.id}/add_provider`, 
        patientPortal: `/patient/${req.params.id}`
    })
})


//Access patient portal of specific patient
patientRouter.get("/:id", async(req,res) => {
    var patient = await getPatientById(req.params.id)
    if (!patient) {
        return res.status(404).send("Patient not found");
    }
    var providersForPatient = await getProviderFromPatient(patient.patient_id) 
    var providerNameList = []
    if (providersForPatient.length !== 0) {
        var providersById = await getProviderIds(patient.patient_id)
        var providerIds = providersById.map(provider => provider.provider_id)
        var providerNames = await getProviderNames(providerIds)
        providerNames.forEach((provider) => {
            providerNameList.push(`${provider.provider_first_name} ${provider.provider_last_name}`)
        })
    } 
    return res.render('patientPortal.ejs', {
        patientName: `${patient.patient_first_name} ${patient.patient_last_name}`,
        addProvider: `/patient/${req.params.id}/add_provider`, 
        providers: providerNameList, 
        patientProfile: `/patient/${req.params.id}/profile`,
        medications: `/patient/${req.params.id}/medications`, 
        logIntake: `/patient/${req.params.id}/log`
    })
})

export default patientRouter