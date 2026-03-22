CREATE TABLE patient (
    patient_id INT AUTO_INCREMENT, 
    patient_first_name VARCHAR(50), 
    patient_last_name VARCHAR(50), 
    patient_email VARCHAR(100), 
    patient_password VARCHAR(50),
    PRIMARY KEY(patient_id)
);

CREATE TABLE healthcare_provider (
    provider_id INT AUTO_INCREMENT, 
    provider_first_name VARCHAR(50), 
    provider_last_name VARCHAR(50), 
    provider_phone_number VARCHAR(10),
    provider_email VARCHAR(10),
    provider_password VARCHAR(50),
    PRIMARY KEY(provider_id)
);

CREATE TABLE reminder (
    reminder_id INT AUTO_INCREMENT, 
    message VARCHAR(500), 
    send_time DATETIME, 
    patient_ID INT, 
    PRIMARY KEY(reminder_id), 
    FOREIGN KEY(patient_id) REFERENCES patient(patient_id) ON DELETE SET NULL
);

CREATE TABLE medication (
    medication_id INT AUTO_INCREMENT, 
    medication_name VARCHAR(50), 
    side_effects VARCHAR(300),
    PRIMARY KEY (medication_id)
);

CREATE TABLE prescription (
    prescription_id INT AUTO_INCREMENT, 
    start_date DATE, 
    end_date DATE, 
    frequency_hours INT, 
    num_pills INT, 
    additional_notes VARCHAR(500), 
    patient_id INT,
    medication_id INT, 
    provider_id INT,
    PRIMARY KEY(prescription_id), 
    FOREIGN KEY(patient_id) REFERENCES patient(patient_id) ON DELETE SET NULL, 
    FOREIGN KEY(medication_id) REFERENCES medication(medication_id) ON DELETE SET NULL, 
    FOREIGN KEY(provider_id) REFERENCES healthcare_provider(provider_id) ON DELETE SET NULL
);

CREATE TABLE patient_log (
    log_id INT AUTO_INCREMENT, 
    status VARCHAR(10), 
    log_date DATE, 
    log_time_taken TIME, 
    medication_id INT, 
    patient_id INT,
    PRIMARY KEY(log_id), 
    FOREIGN KEY(medication_id) REFERENCES medication(medication_id) ON DELETE SET NULL, 
    FOREIGN KEY(patient_id) REFERENCES patient(patient_id) ON DELETE SET NULL
);

CREATE TABLE analysis (
    analysis_id INT AUTO_INCREMENT, 
    adherence_rate DECIMAL(6,5), 
    missed_doses INT, 
    taken_doses INT, 
    medication_id INT, 
    patient_id INT, 
    provider_id INT, 
    log_id INT, 
    PRIMARY KEY(analysis_id), 
    FOREIGN KEY(medication_id) REFERENCES medication(medication_id) ON DELETE SET NULL, 
    FOREIGN KEY(patient_id) REFERENCES patient(patient_id) ON DELETE SET NULL,
    FOREIGN KEY(provider_id) REFERENCES healthcare_provider(provider_id) ON DELETE SET NULL, 
    FOREIGN KEY(log_id) REFERENCES patient_log(log_id) ON DELETE SET NULL
);

CREATE TABLE PatientProvider (
    patient_id INT, 
    provider_id INT, 
    PRIMARY KEY(patient_id, provider_id)
);

