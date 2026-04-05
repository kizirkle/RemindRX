//Provider Router

import express from 'express'
const providerRouter = express.Router()

import {
        getProviderById, 
        getPatientIdsFromProviders, 
        getPatientNames, 
        getPatientNamesFromProvider, 
        getPatientById, 
        getPastMedicationsForPatient, 
        getPatientLogs, 
        getCurrentMedicationsForPatient, 
        deleteProviderAccount, deletePatientProvider
    } from '../database.js'

//View provider profile
providerRouter.get("/:id/profile", async(req, res) => {
    var provider = await getProviderById(req.params.id)
    if (!provider) {
        return res.status(404).send("Provider not found");
    }
    var patientsById = await getPatientIdsFromProviders(provider.provider_id) 
    var patientNameList = []
    if (patientsById.length !== 0) {
        var patientIds = patientsById.map(patient => patient.patient_id)
        var patientNames = await getPatientNames(patientIds)
        patientNames.forEach((patient) => {
        patientNameList.push(`${patient.patient_first_name} ${patient.patient_last_name}`)
        })
    } 
    return res.status(200).render('providerProfile.ejs', {
        providerName: `${provider.provider_first_name} ${provider.provider_last_name}`, 
        providerId:`${provider.provider_id}`, 
        providerEmail: `${provider.provider_email}`,
        providerPhoneNumber: `${provider.provider_phone_number}`, 
        patients: patientNameList, 
        removeProvider: `/provider/${req.params.id}/remove_patient`,
        providerPortal: `/provider/${req.params.id}`,
        deleteAccount: `/provider/${req.params.id}/delete_account`
    })
})

//Selecting a patient to view log
providerRouter.get("/:id/patient_log", async(req,res) => {
    var provider = await getProviderById(req.params.id)
    if (!provider) {
        return res.status(404).send("Provider not found");
    }
    var patients = await getPatientNamesFromProvider(provider.provider_id)
    return res.status(200).render('choosePatientLog.ejs', {
        providerName: `${provider.provider_first_name} ${provider.provider_last_name}`,
        providerPortal: `/provider/${req.params.id}`,
        patients: patients
    })
})

//Viewing patient logs
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
    return res.status(200).render('viewPatientLog.ejs', {
        patientName: `${patient.patient_first_name} ${patient.patient_last_name}`,
        currentMedications: currentMedications, 
        pastMedications: pastMedications,
        patientLog: patientLogs,
        providerPortal: `/provider/${req.params.providerId}`,
        anotherPatient: `/provider/${req.params.providerId}/patient_log`,

    })
})

//View delete account page
providerRouter.get("/:id/delete_account", async(req, res) => {
    return res.status(200).render('deleteProviderAccount.ejs', {
        providerProfile: `/provider/${req.params.id}/profile`,
    })
})

//Delete account
providerRouter.delete("/:id/delete_account", async(req, res) => {
    var provider = await getProviderById(req.params.id)
    if (!provider) {
        return res.status(404).send("Provider not found");
    }
    await deleteProviderAccount(req.params.id)
    return res.status(200).json({success: true, redirect: '/' })
})

//View delete patient page
providerRouter.get("/:id/remove_patient", async(req, res) => {
    var provider = await getProviderById(req.params.id)
    var patients = await getPatientNamesFromProvider(provider.provider_id)
    return res.status(200).render('removePatient.ejs', {
        patients: patients,
        providerProfile: `/provider/${req.params.id}/profile`,
    })
})

//Remove patient
providerRouter.delete("/:providerId/remove_patient/:patientId", async(req, res) => {
    var patient = await getPatientById(req.params.patientId)
    if (!patient) {
        return res.status(404).send("Patient not found");
    }
    await deletePatientProvider(req.params.patientId, req.params.providerId)
    return res.status(200).json({success: true, redirect: `/provider/${req.params.providerId}/profile`})
})

//Access provider portal of specific provider
providerRouter.get("/:id", async(req,res) => {
    var provider = await getProviderById(req.params.id)
    if (!provider) {
        return res.status(404).send("Provider not found");
    }
    return res.status(200).render('providerPortal.ejs', {
        providerName: `${provider.provider_first_name} ${provider.provider_last_name}`,
        providerProfile: `/provider/${req.params.id}/profile`,
        choosePatientLog: `/provider/${req.params.id}/patient_log`,
    })
})


export default providerRouter