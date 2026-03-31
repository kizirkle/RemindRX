import express from 'express'
const providerRouter = express.Router()

import {getProviderById, getPatientFromProvider, getPatientIds, getPatientNames} from '../database.js'

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

//Access provider portal of specific provider
providerRouter.get("/:id", async(req,res) => {
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
    return res.render('providerPortal.ejs', {
        providerName: `${provider.provider_first_name} ${provider.provider_last_name}`,
        providerProfile: `/provider/${req.params.id}/profile`,
        patients: patientNameList
    })
})

export default providerRouter