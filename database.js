//Functions that query the SQL database

import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

//Setting up the connect to MySQL
export var pool = mysql.createPool( {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

//Get all patients
export async function getPatients() {
  var [rows] = await pool.query("SELECT * FROM patient")
  return rows
}

export async function getProviderFromPatient(patientId) {
  var [rows] = await pool.query(`
      SELECT * FROM PatientProvider
      WHERE patient_id = ?
    `, [patientId])
  return rows
}
// var providers = await getProviderFromPatient(6) 
// console.log(providers)

export async function getProviderNames(providerIds) {
  var [rows] = await pool.query(`
      SELECT provider_first_name, provider_last_name FROM healthcare_provider
      WHERE provider_id IN (?)
    `, [providerIds])
  return rows
}


export async function getProviderIds(patientId) {
  var [rows] = await pool.query(`
      SELECT provider_id FROM PatientProvider
      WHERE patient_id = ?
    `, [patientId])
  return rows
  }
// const names = await getProviderIds(1)
// console.log(names)

// const name = await getProviderNames([100000, 1000001])
// console.log(name)

//Get patients by email address and return the corresponding patient object
export async function getPatientByEmail(email) {
  var [rows] = await pool.query(`
    SELECT * FROM patient
    WHERE patient_email = ?
    `, [email])
  return rows[0]
}

//Get patients by patient_id and return the corresponding patient object
export async function getPatientById(patient_id) {
  var [rows] = await pool.query(`
    SELECT * FROM patient
    WHERE patient_id = ?
    `, [patient_id])
  return rows[0]
}

//Get providers by email address and return the corresponding provider object
export async function getProviderByEmail(email) {
  var [rows] = await pool.query(`
    SELECT * FROM healthcare_provider
    WHERE provider_email = ?
    `, [email])
  return rows[0]
}

//Get provider by provider_id and return the correponding provider
export async function getProviderById(provider_id) {
  var [rows] = await pool.query(`
    SELECT * FROM healthcare_provider
    WHERE provider_id = ?
    `, [provider_id])
  return rows[0]
}

export async function getPatientProvider(patient_id, provider_id) {
  var [rows] = await pool.query(`
    SELECT * FROM PatientProvider
    WHERE patient_id = ?
    AND provider_id = ?
    `, [patient_id, provider_id])
  return rows[0]
}

//Create a new patient
export async function createPatient(patient_first_name, patient_last_name, patient_phone_number, patient_email, patient_password) {
  await pool.query(`
    INSERT INTO patient(patient_first_name, patient_last_name, patient_phone_number, patient_email, patient_password)
    VALUES(?, ?, ?, ?, ?)
    `, [patient_first_name, patient_last_name, patient_phone_number, patient_email, patient_password])
  return getPatientByEmail(patient_email)
}
//createPatient("Jeff", "Frank", "8043007898", "frank@gmail.com", "RandomPasswords555!!!")

//Create a new healthcare provider
export async function createProvider(provider_first_name, provider_last_name, provider_phone_number, provider_email, provider_password) {
  await pool.query(`
    INSERT INTO healthcare_provider(provider_first_name, provider_last_name, provider_phone_number, provider_email, provider_password)
    VALUES(?, ?, ?, ?, ?)
    `, [provider_first_name, provider_last_name, provider_phone_number, provider_email, provider_password])
  return getProviderByEmail(provider_email)
}
//createProvider("Bob", "Smith", "8042223333", "bob@gmail.com", "RandomPasswords444!!!")


//Create a new entry the links a patient to their provider
export async function createPatientProvider(patient_id, provider_id) {
  await pool.query(`
    INSERT INTO PatientProvider VALUES (?,?)
    `, [patient_id, provider_id])
}

export async function addMedication(prescription_name,dose,start_date,end_date,frequency_hours,num_pills,side_effects,additional_notes,patient_id,provider_id) {
  await pool.query(`
    INSERT INTO prescription(prescription_name,dose,start_date,end_date,frequency_hours,num_pills,side_effects,additional_notes,patient_id,provider_id)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [prescription_name,dose,start_date,end_date,frequency_hours,num_pills,side_effects,additional_notes,patient_id,provider_id])
}