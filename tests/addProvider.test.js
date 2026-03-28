import request from 'supertest'
import app from '../app'


describe('POST /patient/:id/addProvider', () => {

    // Default data to use for generic test function ("correct" values are the default)
    const defaultData = {
        "patient_id": "100000",
        "provider_id": "100000",
        "provider_first_name": "Bob", 
        "provider_last_name": "Smith"
    }

    // Default expectation data (Some are empty and should be overwritten when creating the test)
    const defaultExpectations = {
        "message": undefined,
        "passed": undefined,
        "statusCode": 200,
    }

    // Generic test function for easier reuse and concise tests
    function createAddProviderTest(patientOverrides = {}, expectOverrides = {}){
        return async () => {
            const ProviderData = {
                ...defaultData,
                ...patientOverrides
            }

            const Expectations = {
                ...defaultExpectations,
                ...expectOverrides
            }

            const response = await request(app)
                .post('/patient/1/add_provider')
                .send(ProviderData)
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
    // P1 - Verify add provider with ID not in database
    // Pre-condition: No provider exists with the ID entered, user is a patient
    // Test data: provider_first_name: Bob, provider_last_name: Smith, provider_id: 555555
    // Expected: "No healthcare provider found."
    // -------------------------------------------------------------------------
    it("[P1] Should not add provider if the ID does not exist", createAddProviderTest({
        provider_id: "555555"
    }, {
        message: "No healthcare provider found."
    }))

    // -------------------------------------------------------------------------
    // P2 - Verify add provider with first name not in database
    // Pre-condition: No provider exists with the first name entered, user is a patient
    // Test data: provider_first_name: Billy, provider_last_name: Smith, provider_id: 100000
    // Expected: "No healthcare provider found."
    // -------------------------------------------------------------------------
    it("[P2] Should not add provider if no provider has first name", createAddProviderTest({
        provider_first_name: "Billy"
    }, {
        message: "No healthcare provider found."
    }))

    // -------------------------------------------------------------------------
    // P3 - Verify add provider with last name not in database
    // Pre-condition: No provider exists with the last name entered, user is a patient
    // Test data: provider_first_name: Bob, provider_last_name: Jones, provider_id: 100000
    // Expected: "No healthcare provider found."
    // -------------------------------------------------------------------------
    it("[P3] Should not add provider if no provider has last name", createAddProviderTest({
        provider_last_name: "Jones"
    }, {
        message: "No healthcare provider found."
    }))

    // -------------------------------------------------------------------------
    // P4 - Verify add provider when provider is already logged with patient
    // Pre-condition: Provider already associated with patient, user is a patient
    // Test data: provider_first_name: Bob, provider_last_name: Smith, provider_id: 100000
    // Expected: "Healthcare provider Bob Smith has already been added."
    // -------------------------------------------------------------------------
    it("[P5] Should not add provider if the provider has already been added to the patient account", createAddProviderTest({}, {
        message: "Healthcare provider Bob Smith has already been added."
    }))

    // -------------------------------------------------------------------------
    // P6 - Verify add provider when information is valid and provider is not logged with patient
    // Pre-condition: Provider is not associated with patient, user is a patient
    // Test data: provider_first_name: John, provider_last_name: Doe, provider_id: 100001
    // Expected: passed: true
    // -------------------------------------------------------------------------
    it("[P6] Should add provider to patient portal if the provider ID exists and the first and last name are correct", createAddProviderTest({
        provider_id: "100001",
        provider_first_name: "John",
        provider_last_name: "Doe"
    }, {
        passed: true
    }))

})

//npm test -- /addProvider.test.js          