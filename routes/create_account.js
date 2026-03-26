import express from 'express'
const createAccountRouter = express.Router()
import path from 'path'

import {getPatientByEmail, getProviderByEmail, createPatient, createProvider, createPatientProvider, getProviderById} from '../database.js'

//Allowing for file paths to be created 
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);

//Access the create_account page
createAccountRouter.get("/", async(req,res) => {
    var filePath = path.join(__dirname, '../public/createUser.html');
    res.sendFile(filePath)
})

//Create a new provider or patient account 
createAccountRouter.post("/", async (req, res) => {
    var {choice, first_name, last_name, phone_number, email, password, confirmed_password, provider_id} = req.body
    first_name = first_name.trim().toLowerCase();
    last_name = last_name.trim().toLowerCase();

    try {
        if(choice === "patient") {
            //Attempts to create a new patient
            var patientExists = await getPatientByEmail(email)
            if(patientExists === undefined) {
                //Checks if there is already a patient with the email in the database
                if(password !== confirmed_password) {
                    //Returns error if password and confirmed_password do not match
                    return res.json({passed: false, message: "Passwords do not match."})
                } else {
                    //Checks if the password is valid 
                    var passwordProblems = checkPassword(password, confirmed_password)
                    if (passwordProblems.length !== 0) {
                        //Returns error if password is invalid, with array that contains the problems
                        return res.json({passed: false, message: "Invalid password.", passwordProblems: passwordProblems})
                    } else {
                        //Creates a new patient and returns the URL to the patient portal if the password is valid
                        var patient = await createPatient(first_name, last_name, phone_number, email, password)
                        return res.json({passed: true, patientPage: `/patient/${patient.patient_id}`})
                    }
                }
            } else {
                //Returns error if there is an existing provider with the email 
                return res.json({passed: false, message: "Account already exists."})
            }   
        } else {
            //Attempts to create a new provider
            var providerExists = await getProviderByEmail(email)
            if(providerExists === undefined) {
                //Checks if there is already a provider with the email in the database
                if(password !== confirmed_password) {
                    //Returns error if password and confirmed_password do not match
                    return res.json({passed: false, message: "Passwords do not match."})
                } else {
                    var passwordProblems = checkPassword(password)
                    if (passwordProblems.length !== 0) {
                        //Return error if password is invalid, with array that contains the problems
                        return res.json({passed: false, message: "Invalid password.", passwordProblems: passwordProblems})
                    } else {
                        //Creates a new provider and returns the URL to the provider portal if the password is valid
                        var provider = await createProvider(first_name, last_name, phone_number, email, password)
                        return res.json({passed: true, providerPage: `/provider/${provider.provider_id}`})
                    }
                }
            } else {
                //Returns error if there is an existing patient with the email 
                return res.json({passed: false, message: "Account already exists."})
            }
        }
    }
    catch (err) {
        console.error("ERROR IN CREATE ACCOUNT:", err);
        res.status(500).json({passed: false, message: 'Error in Create Account.'});
    }
})

function checkPassword(password) {
    var passwordProblems = []
    if (password.length < 12) {
        passwordProblems.push("short")
    }
    if (!(/[0-9]/.test(password))) {
        passwordProblems.push("no number")
    }
    if (!(/[a-z]/.test(password))) {
        passwordProblems.push("no lowercase")
    }
    if (!(/[A-Z]/.test(password))) {
        passwordProblems.push("no uppercase")
    }
    if (!(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password))) {
        passwordProblems.push("no special character")
    }
    return passwordProblems
}

export default createAccountRouter