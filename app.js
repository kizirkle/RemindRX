import express from 'express'
import path from 'path'
import {getPatients, getPatient, getProvider, createPatient, createProvider} from './database.js'
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express() 
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))

app.get("/create_account", async(req,res) => {
    const filePath = path.join(__dirname, '/public/createUser.html');
    res.sendFile(filePath)
})

app.post("/create_account", async (req, res) => {
    const {choice, first_name, last_name, phone_number, email, password, confirmed_password} = req.body
    if(password !== confirmed_password) {
        return res.json({passed: false, message: "Passwords do not match"})
    }
    try {
        if(choice === "patient") {
            const patientExists = await getPatient(email)
            if(patientExists === undefined) {
                const patient = await createPatient(first_name, last_name, phone_number, email, password)
                return res.json({passed: true, message: "Patient account created"})
            }
            else {
                return res.json({passed: false, message: "Account already exists"})
            }
        } else {
            const providerExists = await getProvider(email)
            if(providerExists === undefined) {
                const provider = await createProvider(first_name, last_name, phone_number, email, password)
                return res.json({passed: true, message: "Provider account created"})
            }
            else {
                return res.json({passed: false, message: "Account already exists"})
            }
        }
    }
    catch {
        res.status(500).send('Error in Create Account')
    }
})

app.get("/login", async(req,res) => {
    const filePath = path.join(__dirname, '/public/logUser.html');
    res.sendFile(filePath)
})

app.post("/login", async (req, res) => {
    const {choice, entered_email, entered_password} = req.body
    try {
        if (choice === 'patient') {
            const patient = await getPatient(entered_email)
            if(patient === undefined) {
                return res.json({passed: false, message: "No account found. Create a new account or enter a different email."})
            } else if(patient.patient_password != entered_password) {
                return res.status(401).json({passed: false, message: "Incorrect password"})
            } else {
                return res.json({passed: true, message: "Patinet logged in"})
            }
        } else {
            const provider = await getProvider(entered_email)
            if(provider === undefined) {
                res.json({passed: false, message: "No account found. Create a new account or enter a different email."})
            } else if(provider.provider_password != entered_password) {
                res.status(401).json({passed: false, message: "Incorrect password"})
            } else {
                res.json({passed: true, message: "Provider logged in"})
            }
        }
    } catch{
        res.status(500).send('Error in Login')
    }
})


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})



