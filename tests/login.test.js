import request from 'supertest'
import app from '../app'


describe('POST /login', () => {

    // Default data to use for generic test function ("correct" values are the default)
    const defaultData = {
        "choice": "patient",
        "entered_email": "frank@gmail.com",
        "entered_password": "RandomPasswords555!!!"
    }

    // Default expectation data (Some are empty and should be overwritten when creating the test)
    const defaultExpectations = {
        "message": undefined,
        "passed": undefined,
        "statusCode": 200
    }

    // Generic test function for easier reuse and concise tests
    function createLoginTest(patientOverrides = {}, expectOverrides = {}){
        return async () => {
            const PatientData = {
                ...defaultData,
                ...patientOverrides
            }

            const Expectations = {
                ...defaultExpectations,
                ...expectOverrides
            }

            const response = await request(app)
                .post('/login')
                .send(PatientData)
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
    // L1 - Verify login with email not in database
    // Pre-condition: No account exists with the email entered, user is a patient
    // Test data: entered_email: fail@gmail.com, entered_password: Password5!Random!
    // Expected: "No account found. Create a new account or enter a different email."
    // -------------------------------------------------------------------------
    it("[L1] Should not log the patient in if there is no account with email", createLoginTest({
        entered_email: "fail@gmail.com",
        entered_password: "Password5!Random!"
    }, {
        message: "No account found. Create a new account or enter a different email."
    }))

    // -------------------------------------------------------------------------
    // L2 - Verify login with email not in database
    // Pre-condition: No account exists with the email entered, user is a healthcare provider
    // Test data: entered_email: fail@gmail.com, entered_password: Password5!Random!
    // Expected: "No account found. Create a new account or enter a different email."
    // -------------------------------------------------------------------------
    it("[L2] Should not log the provider in if there is no account with email", createLoginTest({
        choice: "healthcare-provider",
        entered_email: "fail@gmail.com",
        entered_password: "Password5!Random!"
    }, {
        message: "No account found. Create a new account or enter a different email."
    }))

    // -------------------------------------------------------------------------
    // L3 - Verify login with incorrect password
    // Pre-condition: Account exists, user is a patient
    // Test data: entered_email: frank@gmail.com, entered_password: Password5!Random!
    // Expected: "Incorrect password."
    // -------------------------------------------------------------------------
    it("[L3] Should not log in patient if they have an email but the wrong password", createLoginTest({
        entered_password: "Password5!Random!"
    }, {
        message: "Incorrect password."
    }))

    // -------------------------------------------------------------------------
    // L4 - Verify login with incorrect password
    // Pre-condition: Account exists, user is a healthcare provider
    // Test data: entered_email: bob@gmail.com, entered_password: Password5!Random!
    // Expected: "Incorrect password."
    // -------------------------------------------------------------------------
    it("Should not log in provider if they have an email but the wrong password", createLoginTest({
        choice: "healthcare-provider",
        entered_email: "bob@gmail.com",
        entered_password: "Password5!Random!"
    }, {
        message: "Incorrect password."
    }))

    // -------------------------------------------------------------------------
    // L5 - Verify login with valid data
    // Pre-condition: Account exists, user is a patient
    // Test data: entered_email: frank@gmail.com, entered_password: RandomPasswords555!!!
    // Expected: passed: true
    // -------------------------------------------------------------------------
    it("[L5] Should log in patient if they have an email and correct password", createLoginTest({}, {
        passed: true
    }))

    // -------------------------------------------------------------------------
    // L6 - Verify login with valid data
    // Pre-condition: Account exists, user is a healthcare provider
    // Test data: entered_email: bob@gmail.com, entered_password: RandomPasswords444!!!
    // Expected: passed: true
    // -------------------------------------------------------------------------
    it("Should log in provider if they have an email and correct password", createLoginTest({
        choice: "healthcare-provider",
        entered_email: "bob@gmail.com",
        entered_password: "RandomPasswords444!!!"
    }, {
        passed: true
    }))

})

//npm test -- /login.test.js          
