//Server side JavaScript

import express from 'express'

//Setting up Express
var app = express() 
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set('view engine', 'ejs')

//Rendering the home page
app.get("/", async(req, res) => {
    res.render('index')
})


//Creating accounts
import createAccountRouter from './routes/create_account.js'
app.use('/create_account', createAccountRouter)


//Logging in users
import loginRouter from './routes/login.js'
app.use('/login', loginRouter)


//Patient portal routes
import patientRouter from './routes/patient.js'
app.use('/patient', patientRouter)


//Provider portal routes
import providerRouter from './routes/provider.js'
app.use('/provider', providerRouter)

import addMedicationRouter from './routes/add_medication.js'
app.use('/addMedication', addMedicationRouter)

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



