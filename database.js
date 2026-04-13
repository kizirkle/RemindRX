//Functions that query the SQL database

import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

var isProd = process.env.NODE_ENV === 'production'

//Setting up the connect to MySQL
export var pool = mysql.createPool( 
  isProd 
    ? process.env.DATABASE_URL
    :{
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


//-----------------------------------------------------------------------------------------------------------------------------
//Patients

//Create a new patient
export async function createPatient(patient_first_name, patient_last_name, patient_phone_number, patient_email, patient_password) {
  await pool.query(`
    INSERT INTO patient(patient_first_name, patient_last_name, patient_phone_number, patient_email, patient_password)
    VALUES(?, ?, ?, ?, ?)
    `, [patient_first_name, patient_last_name, patient_phone_number, patient_email, patient_password])
    return getPatientByEmail(patient_email)
}

//Get patient by patient ID and return the corresponding patient 
export async function getPatientById(patient_id) {
  var [rows] = await pool.query(`
    SELECT * FROM patient
    WHERE patient_id = ?
    `, [patient_id])
  return rows[0]
}

//Gets the first and last names of the patients with the given patient IDs
export async function getPatientNames(patientIds) {
  var [rows] = await pool.query(`
      SELECT patient_first_name, patient_last_name FROM patient
      WHERE patient_id IN (?)
    `, [patientIds])
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

//Delete patient
export async function deletePatientAccount(patient_id) {
  await pool.query(`
    DELETE FROM patient 
    WHERE patient_id = ?
    `, [patient_id])
}



//-----------------------------------------------------------------------------------------------------------------------------
//Providers

//Create a new healthcare provider
export async function createProvider(provider_first_name, provider_last_name, provider_phone_number, provider_email, provider_password) {
  await pool.query(`
    INSERT INTO healthcare_provider(provider_first_name, provider_last_name, provider_phone_number, provider_email, provider_password)
    VALUES(?, ?, ?, ?, ?)
    `, [provider_first_name, provider_last_name, provider_phone_number, provider_email, provider_password])
    return getProviderByEmail(provider_email)
}

//Get provider by provider ID and return the correponding provider
export async function getProviderById(provider_id) {
  var [rows] = await pool.query(`
    SELECT * FROM healthcare_provider
    WHERE provider_id = ?
    `, [provider_id])
  return rows[0]
}

//Gets the first and last names of the providers with the given provider IDs
export async function getProviderNames(providerIds) {
  var [rows] = await pool.query(`
      SELECT provider_first_name, provider_last_name FROM healthcare_provider
      WHERE provider_id IN (?)
    `, [providerIds])
  return rows
}

//Get providers by email address and return the corresponding provider object
export async function getProviderByEmail(email) {
  var [rows] = await pool.query(`
    SELECT * FROM healthcare_provider
    WHERE provider_email = ?
    `, [email])
  return rows[0]
}

//Delete provider
export async function deleteProviderAccount(healthcare_provider_id) {
  await pool.query(`
    DELETE FROM healthcare_provider 
    WHERE provider_id = ?
    `, [healthcare_provider_id])
}



//-----------------------------------------------------------------------------------------------------------------------------
//Patient-Provider associations

//Create a new entry the links a patient to their provider
export async function createPatientProvider(patient_id, provider_id) {
  await pool.query(`
    INSERT INTO PatientProvider VALUES (?,?)
    `, [patient_id, provider_id])
}

//Get row from table of patient provider associatation with the given patient ID and provider ID
export async function getPatientProvider(patient_id, provider_id) {
  var [rows] = await pool.query(`
    SELECT * FROM PatientProvider
    WHERE patient_id = ?
    AND provider_id = ?
    `, [patient_id, provider_id])
  return rows[0]
}

//Gets the first and last name of the patients associated with the provider
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

//Gets the first and last name of the patients associated with the provider
export async function getProviderNamesFromPatient(patientId) {
  var [rows] = await pool.query(`
      SELECT
        PP.provider_id,
        PP.patient_id,
        h.provider_first_name,
        h.provider_last_name
      FROM 
        PatientProvider AS PP
      INNER JOIN
        healthcare_provider AS h ON PP.provider_id = h.provider_id
      WHERE PP.patient_id = ?
    `, [patientId])
  return rows
}

//Gets the patient IDs for the patients that are associated with provider
export async function getPatientIdsFromProviders(providerId) {
  var [rows] = await pool.query(`
      SELECT patient_id FROM PatientProvider
      WHERE provider_id = ?
    `, [providerId])
  return rows
}

//Gets the provider IDs for the patients that are associated with provider
export async function getProviderIdsFromPatientId(patientId) {
  var [rows] = await pool.query(`
      SELECT provider_id FROM PatientProvider
      WHERE patient_id = ?
    `, [patientId])
  return rows
}

//Delete patient provider association by provider ID
export async function deletePatientProvider(patient_id,provider_id) {
  await pool.query(`
    DELETE FROM PatientProvider 
    WHERE patient_id = ? AND provider_id = ?
    `, [patient_id, provider_id])
}


//-----------------------------------------------------------------------------------------------------------------------------
//Prescriptions/Medications

//Create a new prescription with associated medication
export async function addMedication(prescription_name,dose,start_date,end_date,frequency_hours,total_pills,side_effects,additional_notes,patient_id,provider_id) {
  await pool.query(`
    INSERT INTO prescription(prescription_name,dose,start_date,end_date,frequency_hours,total_pills,side_effects,additional_notes,patient_id,provider_id)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [prescription_name,dose,start_date,end_date,frequency_hours,total_pills,side_effects,additional_notes,patient_id,provider_id])
}

//Get prescription by prescription ID
export async function getPrescriptionById(prescription_id) {
  var [rows] = await pool.query(`
    SELECT * FROM prescription
    WHERE prescription_id = ?
    `, [prescription_id])
    return rows[0]
}

//Gets the current medications with the medication name and patient ID
export async function getCurrentMedicationsByName(prescription_name, patient_id) {
  var [rows] = await pool.query(`
    SELECT * FROM prescription
    WHERE prescription_name = ? AND patient_id = ? AND end_date >= CURDATE()
    `, [prescription_name, patient_id])
    return rows
}

//Gets all current medications for patient and necessary information
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
      P.prescription_id,
      H.provider_first_name,
      H.provider_last_name
    FROM 
      prescription AS P 
    INNER JOIN
      healthcare_provider AS H ON P.provider_id = H.provider_id
    WHERE P.patient_id = ? AND P.end_date >= CURDATE() AND P.start_date <= CURDATE()
    ORDER BY P.prescription_name ASC;
    `, [patient_id])
    return rows
}


//Gets all past medications for patient and necessary information
export async function getPastMedicationsForPatient(patient_id) {
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
      P.prescription_id,
      H.provider_first_name,
      H.provider_last_name
    FROM 
      prescription AS P 
    INNER JOIN
      healthcare_provider AS H ON P.provider_id = H.provider_id
    WHERE P.patient_id = ? AND P.end_date < CURDATE()
    ORDER BY P.prescription_name ASC, P.start_date ASC;
    `, [patient_id])
    return rows
}

//Gets all future medications for patient and necessary information
export async function getFutureMedicationsForPatient(patient_id) {
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
      P.prescription_id,
      H.provider_first_name,
      H.provider_last_name
    FROM 
      prescription AS P 
    INNER JOIN
      healthcare_provider AS H ON P.provider_id = H.provider_id
    WHERE P.patient_id = ? AND P.start_date > CURDATE()
    ORDER BY P.prescription_name ASC, P.start_date ASC;
    `, [patient_id])
    return rows
}

export async function getMedicationWithinDates(patient_id, prescription_name, start_date, end_date) {
  var [rows] = await pool.query(`
    SELECT * FROM prescription
    WHERE patient_id = ? AND prescription_name = ? AND start_date <= ? AND end_date >= ?
    `, [patient_id, prescription_name, end_date, start_date])
    return rows
}



//-----------------------------------------------------------------------------------------------------------------------------
//Patient logs

//Create a new log entry
export async function createLogEntry(status, report_date, intake_time, additional_notes, patient_id, prescription_id) {
  await pool.query(`
    INSERT INTO patient_log(status, report_date, intake_time, additional_notes, patient_id, prescription_id)
    VALUES(?, ?, ?, ?, ?, ?)
    `, [status, report_date, intake_time, additional_notes, patient_id, prescription_id])
}

//Gets all patient logs for the patient with given ID
export async function getPatientLogs(patient_id) {
  var [rows] = await pool.query(`
    SELECT 
      L.status, 
      DATE_FORMAT(L.report_date, '%m/%d/%Y') AS report_date, 
      DATE_FORMAT(L.intake_time, '%h:%i %p') AS intake_time, 
      L.additional_notes,
      P.prescription_name,
      P.prescription_id,
      L.patient_id
    FROM 
      patient_log AS L 
    INNER JOIN
      prescription AS P ON P.prescription_id = L.prescription_id
      ORDER BY CAST(report_date AS DATE) ASC, CAST(intake_time AS TIME) ASC;
    `, [patient_id])
    return rows
}


