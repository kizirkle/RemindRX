import express from 'express'
const loginRouter = express.Router()
import path from 'path'

import {getPatientByEmail, getProviderByEmail} from '../database.js'

//Allowing for file paths to be created 
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);

//Access the login page
loginRouter.get("/", async(req,res) => {
    var filePath = path.join(__dirname, '../public/logUser.html');
    res.sendFile(filePath)
})

//Login a provider or patient
loginRouter.post("/", async (req, res) => {
    var {choice, entered_email, entered_password} = req.body
    try {
        if (choice === 'patient') {
            //Attempts to log in a patient
            var patient = await getPatientByEmail(entered_email)
            if(patient === undefined) {
                //Return error if there is not a patient with the given email
                return res.json({passed: false, message: "No account found. Create a new account or enter a different email."})
            } else if(patient.patient_password != entered_password) {
                //Return error if there if the password is not correct for the given email
                return res.status(401).json({passed: false, message: "Incorrect password."})
            } else {
                //Logs the user in and returns the URL to the patient portal
                return res.json({passed: true, patientPage: `/patient/${patient.patient_id}`})
            }
        } else {
            //Attempt to log in a provider
            var provider = await getProviderByEmail(entered_email)
            if(provider === undefined) {
                //Return error if there is not a provider with the given email
                res.json({passed: false, message: "No account found. Create a new account or enter a different email."})
            } else if(provider.provider_password != entered_password) {
                //Return error if there if the password is not correct for the given email
                res.status(401).json({passed: false, message: "Incorrect password."})
            } else {
                //Logs the user in and returns the URL to the provider portal
                return res.json({passed: true, providerPage: `/provider/${provider.provider_id}`})
            }
        }
    } catch{
        res.status(500).json({passed: false, message:'Error in Login'})
    }
})

export default loginRouter