//Server side JavaScript

import express from 'express'
import path from 'path'
//app.set('view engine', 'ejs');

//Functions that query SQL database from database.js
import {getPatientByEmail, getProviderByEmail, createPatient, createProvider, createPatientProvider, getProviderById} from './database.js'

//Allowing for file paths to be created 
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);

//Setting up Express
var app = express() 
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))

//Access the create_account page
app.get("/create_account", async(req,res) => {
    var filePath = path.join(__dirname, '/public/createUser.html');
    res.sendFile(filePath)
})

//Create a new provider or patient account 
app.post("/create_account", async (req, res) => {
    var {choice, first_name, last_name, phone_number, email, password, confirmed_password, provider_id} = req.body
    //Returns error if password and confirmed_password do not match
    if(password !== confirmed_password) {
        return res.json({passed: false, message: "Passwords do not match"})
    }
    try {
        if(choice === "patient") {
            //Attempts to create a new patient
            var patientExists = await getPatientByEmail(email)
            if(patientExists === undefined) {
                //Checks if there is already a patient with the email in the database
                if(password !== confirmed_password) {
                    //Returns error if password and confirmed_password do not match
                    return res.json({passed: false, message: "Passwords do not match"})
                } else {
                    //Checks if the password is valid 
                    var passwordProblems = checkPassword(password, confirmed_password)
                    if (passwordProblems.length !== 0) {
                        //Returns error if password is invalid, with array that contains the problems
                        return res.json({passed: false, message: "Invalid password", passwordProblems: passwordProblems})
                    } else {
                        //Checks if provider exists for given provider ID
                        var providerExists = await getProviderById(provider_id)
                        if(providerExists === undefined) {
                            //Return error if there is not a provider with the given ID
                            return res.json({passed: false, message: "No healthcare provider with ID"})
                        }  else {
                            //Creates a new patient and returns the URL to the patient portal if the password is valid
                            var patient = await createPatient(first_name, last_name, phone_number, email, password)
                            createPatientProvider(patient.patient_id, provider_id)
                            return res.json({passed: true, patientPage: `/patient/${patient.patient_first_name}/${patient.patient_last_name}/${patient.patient_id}`})
                        }
                    }
                }
            } else {
                //Returns error if there is an existing provider with the email 
                return res.json({passed: false, message: "Account already exists"})
            }   
        } else {
            //Attempts to create a new provider
            var providerExists = await getProviderByEmail(email)
            if(providerExists === undefined) {
                //Checks if there is already a provider with the email in the database
                if(password !== confirmed_password) {
                    //Returns error if password and confirmed_password do not match
                    return res.json({passed: false, message: "Passwords do not match"})
                } else {
                    var passwordProblems = checkPassword(password)
                    if (passwordProblems.length !== 0) {
                        //Return error if password is invalid, with array that contains the problems
                        return res.json({passed: false, message: "Invalid password", passwordProblems: passwordProblems})
                    } else {
                    //Creates a new provider and returns the URL to the provider portal if the password is valid
                    var provider = await createProvider(first_name, last_name, phone_number, email, password)
                    return res.json({passed: true, providerPage: `/provider/${provider.provider_first_name}/${provider.provider_last_name}/${provider.provider_id}`})
                    }
                }
            } else {
                //Returns error if there is an existing patient with the email 
                return res.json({passed: false, message: "Account already exists"})
            }
        }
    }
    catch (err) {
        console.error("ERROR IN CREATE ACCOUNT:", err);
        res.status(500).json({passed: false, message: 'Error in Create Account'});
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

//Access the login page
app.get("/login", async(req,res) => {
    var filePath = path.join(__dirname, '/public/logUser.html');
    res.sendFile(filePath)
})

//Login a provider or patient
app.post("/login", async (req, res) => {
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
                return res.json({passed: true, patientPage: `/patient/${patient.patient_first_name}/${patient.patient_last_name}/${patient.patient_id}`})
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
                return res.json({passed: true, providerPage: `/provider/${provider.provider_first_name}/${provider.provider_last_name}/${provider.provider_id}`})
            }
        }
    } catch{
        res.status(500).json({passed: false, message:'Error in Login'})
    }
})

//Access patient portal of specific patient
app.get("/patient/:firstName/:lastName/:id", async(req,res) => {
    var filePath = path.join(__dirname, '/public/patientPortal.html');
    res.sendFile(filePath)
})

//Access patient portal of specific provider
app.get("/provider/:firstName/:lastName/:id", async(req,res) => {
    var filePath = path.join(__dirname, '/public/providerPortal.html');
    res.sendFile(filePath)
})

//Alert if failure occured
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({passed: false, message:'Something broke!'})
})

//Port to access the website
app.listen(8080, () => {
    console.log('Server is running on port 8080')
})

export default app



