import request from 'supertest'
import app from '../app'

describe('POST /addMedication', () => {

    // Default data to use for generic test function ("correct" values are the default)
    const defaultData = {
        "prescription_name": "test_medicine",
        "dose": 1,
        "start_date": new Date(),
        "end_date": new Date(),
        "frequency_hours": 24,
        "total_pills": 10,
        "side_effects": "None",
        "additional_notes": "None",
        "patient_first_name": "Jeff",
        "patient_last_name": "Frank",
        "patient_id": "100000",
        "provider_id": "100000"
    }

    // Default expectation data (Some are empty and should be overwritten when creating the test)
    const defaultExpectations = {
        "message": undefined,
        "passed": undefined,
        "statusCode": 200,
    }

    // Generic test function for easier reuse and concise tests
    function createAddMedicationTest(medicationOverrides = {}, expectOverrides = {}){
        return async () => {
            const MedicationData = {
                ...defaultData,
                ...medicationOverrides
            }

            const Expectations = {
                ...defaultExpectations,
                ...expectOverrides
            }

            const response = await request(app)
                .post('/addMedication')
                .send(MedicationData)
                .expect('Content-Type', /json/)
                .expect(Expectations.statusCode);

            if (Expectations.message !== undefined) {
                expect(response.body.message).toBe(Expectations.message);
            }
            if (Expectations.passed !== undefined) {
                expect(response.body.passed).toBe(Expectations.passed);
            }
        }
    }

    // -------------------------------------------------------------------------
    // M1 - Verify add medication with invalid user ID
    // Pre-condition: Provider is on add medication page, user is a healthcare provider
    // Test data: patient-first-name: Jeff, patient-last-name: Frank, patient-id: 0
    // Expected: "No patient found."
    // -------------------------------------------------------------------------
    it("[M1] Should not add medication given invalid user ID", createAddMedicationTest({
        patient_id: 0
    }, {
        message: "No patient found."
    }))

    // -------------------------------------------------------------------------
    // M2 - Verify add medication with invalid first name
    // Pre-condition: Provider is on add medication page, user is a healthcare provider
    // Test data: patient-first-name: John, patient-last-name: Frank, patient-id: 100000
    // Expected: "No patient found."
    // -------------------------------------------------------------------------
    it("[M2] Should not add medication given invalid first name", createAddMedicationTest({
        patient_first_name: "John"
    }, {
        message: "No patient found."
    }))

    // -------------------------------------------------------------------------
    // M3 - Verify add medication with invalid last name
    // Pre-condition: Provider is on add medication page, user is a healthcare provider
    // Test data: patient-first-name: Jeff, patient-last-name: Byrne, patient-id: 100000
    // Expected: "No patient found."
    // -------------------------------------------------------------------------
    it("[M3] Should not add medication given invalid last name", createAddMedicationTest({
        patient_last_name: "Byrne"
    }, {
        message: "No patient found."
    }))

    // -------------------------------------------------------------------------
    // M4 - Verify add medication when patient is not logged with provider
    // Pre-condition: Provider is on add medication page, user is a healthcare provider
    // Test data: patient-first-name: Sheldon, patient-last-name: Dean, patient-id: 10001
    // Expected: "No patient found."
    // -------------------------------------------------------------------------
    it("[M4] Should not add medication when patient is not associated with provider", createAddMedicationTest({
        patient_first_name: "Sheldon",
        patient_last_name: "Dean",
        patient_id: "10001"
    }, {
        message: "No patient found."
    }))

    // -------------------------------------------------------------------------
    // M5 - Verify add medication with previously added medication
    // Pre-condition: Provider is on add medication page, user is a healthcare provider
    // Test data: patient-first-name: Jeff, patient-last-name: Frank, patient-id: 100000, medication-name: "Tylenol"
    // Expected: "Tylenol has already been added for Jeff Frank.""
    // -------------------------------------------------------------------------
    it("[M5] Should not add medication if it has already been added", createAddMedicationTest({
        prescription_name: "Tylenol"
    }, {
        message: "Tylenol has already been added for Jeff Frank."
    }))

    // -------------------------------------------------------------------------
    // M6 - Verify add medication when dose is greater than total number of pills
    // Pre-condition: Provider is on add medication page, user is a healthcare provider
    // Test data: patient-first-name: Jeff, patient-last-name: Frank, patient-id: 100000, dose: 6, total-pills: 5
    // Expected: "Dose must be less than total number of pills."
    // -------------------------------------------------------------------------
    it("[M6] Should not add medication if dose is greater than total number of pills", createAddMedicationTest({
        dose: 6,
        total_pills: 5
    }, {
        message: "Dose must be less than total number of pills."
    }))

    // -------------------------------------------------------------------------
    // M7 - Verify add medication with proper input
    // Pre-condition: Provider is on add medication page, user is a healthcare provider
    // Test data: patient-first-name: Jeff, patient-last-name: Frank, patient-id: 100000,
    //            total-pills: 10, dose: 1, medicine-name: "Test Medicine"
    // Expected: passed: true
    // -------------------------------------------------------------------------
    it("[M7] Should add medication if inputs are valid", createAddMedicationTest({
        prescription_name: "Test Medicine"
    }, {
        passed: true,
        statusCode: 201
    }))

})