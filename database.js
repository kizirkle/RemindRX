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

export async function getPatientNamesFromProvider(providerId) {
  var [rows] = await pool.query(`
      SELECT
        PP.provider_id,
        PP.patient_id,
        p.patient_first_name,
        p.patient_last_name
      FROM 
        PatientProvider AS PP
      INNER JOIN
        patient AS p ON PP.patient_id = p.patient_id
      WHERE PP.provider_id = ?
    `, [providerId])
  return rows
}

export async function getPatientFromProvider(providerId) {
  var [rows] = await pool.query(`
      SELECT * FROM PatientProvider
      WHERE provider_id = ?
    `, [providerId])
  return rows
}

export async function getProviderNames(providerIds) {
  var [rows] = await pool.query(`
      SELECT provider_first_name, provider_last_name FROM healthcare_provider
      WHERE provider_id IN (?)
    `, [providerIds])
  return rows
}

export async function getPatientNames(patientIds) {
  var [rows] = await pool.query(`
      SELECT patient_first_name, patient_last_name FROM patient
      WHERE patient_id IN (?)
    `, [patientIds])
  return rows
}


export async function getProviderIds(patientId) {
  var [rows] = await pool.query(`
      SELECT provider_id FROM PatientProvider
      WHERE patient_id = ?
    `, [patientId])
  return rows
  }

export async function getPatientIds(providerId) {
var [rows] = await pool.query(`
    SELECT patient_id FROM PatientProvider
    WHERE provider_id = ?
  `, [providerId])
return rows
}


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

export async function addMedication(prescription_name,dose,start_date,end_date,frequency_hours,total_pills,side_effects,additional_notes,patient_id,provider_id) {
  await pool.query(`
    INSERT INTO prescription(prescription_name,dose,start_date,end_date,frequency_hours,total_pills,side_effects,additional_notes,patient_id,provider_id)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [prescription_name,dose,start_date,end_date,frequency_hours,total_pills,side_effects,additional_notes,patient_id,provider_id])
}

export async function getMedicationsByName(prescription_name) {
  var [rows] = await pool.query(`
    SELECT * FROM prescription
    WHERE prescription_name = ?
    `, [prescription_name])
    return rows[0]
}

export async function getMedicationNamesByPatientId(patient_id) {
  var [rows] = await pool.query(`
    SELECT prescription_id, prescription_name FROM prescription
    WHERE patient_id = ? AND end_date >= CURDATE()
    `, [patient_id])
    return rows
}

export async function getCurrentMedicationsForPatient(patient_id) {
  var [rows] = await pool.query(`
    SELECT 
      P.prescription_name, 
      P.dose, 
      DATE_FORMAT(P.start_date, '%m/%d/%Y') AS start_date, 
      DATE_FORMAT(P.end_date, '%m/%d/%Y') AS end_date, 
      P.total_pills, 
      P.frequency_hours, 
      P.side_effects, 
      P.additional_notes, 
      P.patient_id, 
      H.provider_first_name,
      H.provider_last_name
    FROM 
      prescription AS P 
    INNER JOIN
      healthcare_provider AS H ON P.provider_id = H.provider_id
    WHERE P.patient_id = ? AND P.end_date >= CURDATE()
    ORDER BY P.prescription_name ASC;
    `, [patient_id])
    return rows
}

export async function getAllMedicationsForPatient(patient_id) {
  var [rows] = await pool.query(`
    SELECT 
      P.prescription_name, 
      P.dose, 
      DATE_FORMAT(P.start_date, '%m/%d/%Y') AS start_date, 
      DATE_FORMAT(P.end_date, '%m/%d/%Y') AS end_date, 
      P.total_pills, 
      P.frequency_hours, 
      P.side_effects, 
      P.additional_notes, 
      P.patient_id, 
      H.provider_first_name,
      H.provider_last_name
    FROM 
      prescription AS P 
    INNER JOIN
      healthcare_provider AS H ON P.provider_id = H.provider_id
    WHERE P.patient_id = ? 
    ORDER BY P.prescription_name ASC;
    `, [patient_id])
    return rows
}


export async function getPatientLogs(patient_id) {
  var [rows] = await pool.query(`
    SELECT 
      L.status, 
      DATE_FORMAT(L.report_date, '%m/%d/%Y') AS report_date, 
      DATE_FORMAT(L.intake_time, '%h:%i %p') AS intake_time, 
      L.additional_notes,
      P.prescription_name,
      L.patient_id
    FROM 
      patient_log AS L 
    INNER JOIN
      prescription AS P ON P.prescription_id = L.prescription_id
      ORDER BY CAST(report_date AS DATE) ASC, CAST(intake_time AS TIME) ASC;
    `, [patient_id])
    return rows
}


//Get prescription by ID
export async function getPrescriptionById(prescription_id) {
  var [rows] = await pool.query(`
    SELECT * FROM prescription
    WHERE prescription_id = ?
    `, [prescription_id])
    return rows[0]
}

//Create a new log entry
export async function createLogEntry(status, report_date, intake_time, additional_notes, patient_id, prescription_id) {
  await pool.query(`
    INSERT INTO patient_log(status, report_date, intake_time, additional_notes, patient_id, prescription_id)
    VALUES(?, ?, ?, ?, ?, ?)
    `, [status, report_date, intake_time, additional_notes, patient_id, prescription_id])
}

//Delete patient
export async function deletePatientAccount(patient_id) {
  await pool.query(`
    DELETE FROM patient 
    WHERE patient_id = ?
    `, [patient_id])
}
