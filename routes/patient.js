//Patient Router

import express from 'express'
const patientRouter = express.Router()

import {
        getPatientById, 
        getProviderById, 
        getPatientProvider, 
        createPatientProvider, 
        getProviderNames, 
        getProviderNamesFromPatient,
        getProviderIdsFromPatientId, 
        getCurrentMedicationsForPatient, 
        getPastMedicationsForPatient, 
        createLogEntry, 
        deletePatientAccount, 
        deletePatientProvider, 
    } from '../database.js'


//Opens form to add a new provider
patientRouter.get("/:id/reminders", async(req, res) => {
    var date = new Date()
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dayOfWeek = days[date.getDay()]
    var day = date.getDate()
    var month = months[date.getMonth()]
    var year = date.getFullYear()
    var currentDate = `${dayOfWeek}, ${month} ${day}, ${year}`
    return res.status(200).render('reminders.ejs', {
        date: currentDate,
        patientPortal: `/patient/${req.params.id}/`
    })
})

//Opens form to add a new provider
patientRouter.get("/:id/add_provider", async(req, res) => {
    return res.status(200).render('addProvider.ejs', {
        patientProfile: `/patient/${req.params.id}/profile` 
    })
})

//Connect provider to patient upon patient entering valid provider ID
patientRouter.post("/:id/add_provider", async(req, res) => {
    var{patient_id, provider_id, provider_first_name, provider_last_name} = req.body
    try {
        var providerExists = await getProviderById(provider_id)
        if (!providerExists || providerExists.provider_first_name !== provider_first_name ||providerExists.provider_last_name !== provider_last_name) {
            //If there is no provider with ID or the first or last name does not math the name associated with the ID, returns an error message
            return res.status(200).json({passed: false, message: `No healthcare provider found.`})
        } 
        var providerPatientAssociationExists = await getPatientProvider(patient_id, provider_id)
        if (providerPatientAssociationExists) {
            //If the patient as already associated with the provider in the database, returns an error message 
            return res.status(200).json({passed: false, message: `Healthcare provider ${providerExists.provider_first_name} ${providerExists.provider_last_name} has already been added.`})
        }
        //If the provider ID exists and is not already associated with patient, creates new entry in PatientProvider table and return to patient portal
        if (process.env.NODE_ENV !== 'test') {
            createPatientProvider(patient_id, provider_id)
            return res.status(201).json({passed: true, patientPage: `/patient/${patient_id}/profile`})
        }
        return res.status(201).json({passed: true})
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
    var currentMedications = await getCurrentMedicationsForPatient(patient.patient_id)
    var pastMedications = await getPastMedicationsForPatient(patient.patient_id)
    return res.status(200).render('medications.ejs', {
        patientPortal: `/patient/${req.params.id}`, 
        currentMedications: currentMedications, 
        pastMedications: pastMedications
    })
})

//Opens page for patient to log medications
patientRouter.get("/:id/log", async(req, res) => {
    var patient = await getPatientById(req.params.id)
    if (!patient) {
        return res.status(404).send("Patient not found");
    }
    var medications = await getCurrentMedicationsForPatient(patient.patient_id)
    return res.status(200).render('logIntake.ejs', {
        patientPortal: `/patient/${req.params.id}`, 
        medications: medications
    })
})

//Logs medication status for patient
patientRouter.post("/:id/log", async(req, res) => {
    var{status, report_date, intake_time, additional_notes, patient_id, prescription_id} = req.body
    try {
        if(status === "taken") {
            createLogEntry(status, report_date, intake_time, additional_notes, patient_id, prescription_id)
        } else {
            createLogEntry(status, report_date, null, additional_notes, patient_id, prescription_id)
        }
        return res.status(201).json({passed: true, patientPage: `/patient/${patient_id}`})
    } catch{
        res.status(500).json({passed: false, message:'Error in Log Intake.'})
    }
})

//View patient profile
patientRouter.get("/:id/profile", async(req, res) => {
    var patient = await getPatientById(req.params.id)
    if (!patient) {
        return res.status(404).send("Patient not found");
    }
    var providersById = await getProviderIdsFromPatientId(patient.patient_id) 
    var providerNameList = []
    if (providersById.length !== 0) {
        var providerIds = providersById.map(provider => provider.provider_id)
        var providerNames = await getProviderNames(providerIds)
        providerNames.forEach((provider) => {
            providerNameList.push(`${provider.provider_first_name} ${provider.provider_last_name}`)
        })
    } 
    return res.status(200).render('patientProfile.ejs', {
        patientName: `${patient.patient_first_name} ${patient.patient_last_name}`, 
        patientId:`${patient.patient_id}`, 
        patientEmail: `${patient.patient_email}`,
        patientPhoneNumber: `${patient.patient_phone_number}`, 
        providers: providerNameList, 
        addProvider: `/patient/${req.params.id}/add_provider`, 
        removeProvider: `/patient/${req.params.id}/remove_provider`,
        patientPortal: `/patient/${req.params.id}`, 
        deleteAccount: `/patient/${req.params.id}/delete_account`
    })
})

//View delete account page
patientRouter.get("/:id/delete_account", async(req, res) => {
    return res.status(200).render('deletePatientAccount.ejs', {
        patientProfile: `/patient/${req.params.id}/profile`,
    })
})

//Delete account
patientRouter.delete("/:id/delete_account", async(req, res) => {
    var patient = await getPatientById(req.params.id)
    if (!patient) {
        return res.status(404).send("Patient not found");
    }
    await deletePatientAccount(req.params.id)
    return res.status(200).json({success: true, redirect: '/' })
})

//View delete provider page
patientRouter.get("/:id/remove_provider", async(req, res) => {
    var providers = await getProviderNamesFromPatient(req.params.id)
    return res.status(200).render('removeProvider.ejs', {
        providers: providers,
        patientProfile: `/patient/${req.params.id}/profile`,
    })
})

//Remove provider
patientRouter.delete("/:patientId/remove_provider/:providerId", async(req, res) => {
    var patient = await getPatientById(req.params.patientId)
    if (!patient) {
        return res.status(404).send("Patient not found");
    }
    await deletePatientProvider(req.params.patientId, req.params.providerId)
    return res.status(200).json({success: true, redirect: `/patient/${req.params.patientId}/profile`})
})


//Access patient portal of specific patient
patientRouter.get("/:id", async(req,res) => {
    var patient = await getPatientById(req.params.id)
    if (!patient) {
        return res.status(404).send("Patient not found");
    }
    return res.render('patientPortal.ejs', {
        patientName: `${patient.patient_first_name} ${patient.patient_last_name}`,
        patientProfile: `/patient/${req.params.id}/profile`,
        medications: `/patient/${req.params.id}/medications`, 
        logIntake: `/patient/${req.params.id}/log`
    })
})

export default patientRouter