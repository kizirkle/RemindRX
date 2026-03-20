import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()


export const pool = mysql.createPool( {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getPatients() {
  const [rows] = await pool.query("SELECT * FROM patient")
  return rows
}
// const rows = await getPatients()
// console.log(rows)


export async function getPatient(email) {
  const [rows] = await pool.query(`
    SELECT * FROM patient
    WHERE patient_email = ?
    `, [email])
  return rows[0]
}

export async function getProvider(email) {
  const [rows] = await pool.query(`
    SELECT * FROM healthcare_provider
    WHERE provider_email = ?
    `, [email])
  return rows[0]
}

export async function createPatient(patient_first_name, patient_last_name, patient_phone_number, patient_email, patient_password) {
  const [result] = await pool.query(`
    INSERT INTO patient(patient_first_name, patient_last_name, patient_phone_number, patient_email, patient_password)
    VALUES(?, ?, ?, ?, ?)
    `, [patient_first_name, patient_last_name, patient_phone_number, patient_email, patient_password])
  return getPatient(patient_email)
}

export async function createProvider(provider_first_name, provider_last_name, provider_phone_number, provider_email, provider_password) {
  const [result] = await pool.query(`
    INSERT INTO healthcare_provider(provider_first_name, provider_last_name, provider_phone_number, provider_email, provider_password)
    VALUES(?, ?, ?, ?, ?)
    `, [provider_first_name, provider_last_name, provider_phone_number, provider_email, provider_password])
  return getProvider(provider_email)
}



// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Hi!");

//   var sql = 'INSERT INTO PatientProvider VALUES(2,5)'
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//   });
// });


