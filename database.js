import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()


export var pool = mysql.createPool( {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getPatients() {
  var [rows] = await pool.query("SELECT * FROM patient")
  return rows
}

export async function getPatientByEmail(email) {
  var [rows] = await pool.query(`
    SELECT * FROM patient
    WHERE patient_email = ?
    `, [email])
  return rows[0]
}

export async function getProviderByEmail(email) {
  var [rows] = await pool.query(`
    SELECT * FROM healthcare_provider
    WHERE provider_email = ?
    `, [email])
  return rows[0]
}

export async function getProviderById(provider_id) {
  var [rows] = await pool.query(`
    SELECT * FROM healthcare_provider
    WHERE provider_id = ?
    `, [provider_id])
  return rows[0]
}

export async function createPatient(patient_first_name, patient_last_name, patient_phone_number, patient_email, patient_password) {
  await pool.query(`
    INSERT INTO patient(patient_first_name, patient_last_name, patient_phone_number, patient_email, patient_password)
    VALUES(?, ?, ?, ?, ?)
    `, [patient_first_name, patient_last_name, patient_phone_number, patient_email, patient_password])
  return getPatientByEmail(patient_email)
}

export async function createProvider(provider_first_name, provider_last_name, provider_phone_number, provider_email, provider_password) {
  await pool.query(`
    INSERT INTO healthcare_provider(provider_first_name, provider_last_name, provider_phone_number, provider_email, provider_password)
    VALUES(?, ?, ?, ?, ?)
    `, [provider_first_name, provider_last_name, provider_phone_number, provider_email, provider_password])
  return getProviderByEmail(provider_email)
}

export async function createPatientProvider(patient_id, provider_id) {
  await pool.query(`
    INSERT INTO PatientProvider VALUES (?,?)
    `, [patient_id, provider_id])
}

