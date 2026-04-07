import express from 'express'
const providerRouter = express.Router()

import {getProviderById, getPatientFromProvider, getPatientIds, getPatientNames, getPatientNamesFromProvider, getPatientById, getPastMedicationsForPatient, getPatientLogs, getCurrentMedicationsForPatient, addMedication} from '../database.js'

//View provider profile
providerRouter.get("/:id/profile", async(req, res) => {
    var provider = await getProviderById(req.params.id)
    if (!provider) {
        return res.status(404).send("Provider not found");
    }
    var providersForPatient = await getPatientFromProvider(provider.provider_id) 
    var patientNameList = []
    if (providersForPatient.length !== 0) {
        var patientsById = await getPatientIds(provider.provider_id)
        var patientIds = patientsById.map(patient => patient.patient_id)
        var patientNames = await getPatientNames(patientIds)
        patientNames.forEach((patient) => {
        patientNameList.push(`${patient.patient_first_name} ${patient.patient_last_name}`)
        })
    } 
    return res.render('providerProfile.ejs', {
        providerName: `${provider.provider_first_name} ${provider.provider_last_name}`, 
        providerId:`${provider.provider_id}`, 
        providerEmail: `${provider.provider_email}`,
        providerPhoneNumber: `${provider.provider_phone_number}`, 
        patients: patientNameList, 
        providerPortal: `/provider/${req.params.id}`,
    })
})

//Selecting a patient to view log
providerRouter.get("/:id/patient_log", async(req,res) => {
    var provider = await getProviderById(req.params.id)
    if (!provider) {
        return res.status(404).send("Provider not found");
    }
    var patients = await getPatientNamesFromProvider(provider.provider_id)
    return res.render('choosePatientLog.ejs', {
        providerName: `${provider.provider_first_name} ${provider.provider_last_name}`,
        providerPortal: `/provider/${req.params.id}`,
        patients: patients
    })
})

providerRouter.get("/:providerId/patient_log/:patientId", async(req,res)=> {
    var provider = await getProviderById(req.params.providerId)
    if (!provider) {
        return res.status(404).send("Provider not found");
    }
    var patient = await getPatientById(req.params.patientId)
    if (!patient) {
        return res.status(404).send("Patient not found");
    }
    var currentMedications = await getCurrentMedicationsForPatient(patient.patient_id)
    var pastMedications = await getPastMedicationsForPatient(patient.patient_id)
    var patientLogs = await getPatientLogs(patient.patient_id)
    return res.render('viewPatientLog.ejs', {
        patientName: `${patient.patient_first_name} ${patient.patient_last_name}`,
        currentMedications: currentMedications, 
        pastMedications: pastMedications,
        patientLog: patientLogs,
        providerPortal: `/provider/${req.params.providerId}`,
        anotherPatient: `/provider/${req.params.providerId}/patient_log`,

    })
})

//Access provider portal of specific provider
providerRouter.get("/:id", async(req,res) => {
    var provider = await getProviderById(req.params.id)
    if (!provider) {
        return res.status(404).send("Provider not found");
    }
    return res.render('providerPortal.ejs', {
        providerName: `${provider.provider_first_name} ${provider.provider_last_name}`,
        providerProfile: `/provider/${req.params.id}/profile`,
        choosePatientLog: `/provider/${req.params.id}/patient_log`,
        addMedication: `/provider/${req.params.id}/addMedication`,
    })
})

providerRouter.get("/:id/addMedication", async(req,res) => {
    var provider = await getProviderById(req.params.id)
    if (!provider) {
        return res.status(404).send("Provider not found");
    }
    return res.render('addMedication.ejs', {
        providerPortal: `/provider/${req.params.id}`,
    })
})

providerRouter.post("/:id/addMedication", async(req,res) => {
    var provider = await getProviderById(req.params.id)
    if (!provider) {
        return res.status(404).send("Provider not found");
    }
    var {prescription_name, dose, start_date, end_date, frequency_hours, total_pills, side_effects, additional_notes, patient_first_name, patient_last_name} = req.body
    try {
        var patientExists = await getPatientById(patient_id)
        if (!patientExists || patientExists.patient_first_name !== patient_first_name || patientExists.patient_last_name !== patient_last_name) {
            //If there is no patient with ID or the first or last name does not math the name associated with the ID, returns an error message
            return res.json({passed: false, message: `No patient found.`})
        }
        var providersForPatient = await getPatientProvider(patient_id, provider.provider_id)
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
            await addMedication(prescription_name,dose,start_date,end_date,frequency_hours,total_pills,side_effects,additional_notes,patient_id,provider.provider_id)
            return res.json({passed: true})
        }
        return res.json({passed: true})
    } catch{
        res.status(500).json({passed: false, message:'Error in Add Medication.'})
    }
})

export default providerRouter