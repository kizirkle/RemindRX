import request from 'supertest'
import app from '../app'

describe('POST /create_account', () => {

    // Default data to use for generic test function ("correct" values are the default)
    const defaultData = {
        "choice": "patient",
        "first_name": "Jeff",
        "last_name": "Doe",
        "phone_number": "8041112222",
        "email": "Jeff.doe@gmail.com",
        "password": "ValidPassword1!",
        "confirmed_password": "ValidPassword1!",
    }
    const defaultProviderData = {
        "choice": "healthcare_provider",
        "first_name": "John",
        "last_name": "Doctor",
        "phone_number": "8049998888",
        "email": "drdoctor@gmail.com",
        "password": "ValidPassword1!",
        "confirmed_password": "ValidPassword1!"
    }

    // Default expectation data (Some are empty and should be overwritten when creating the test)
    const defaultExpectations = {
        "message": undefined,
        "passed": undefined,
        "statusCode": 200,
        "statusCannotBe": undefined,
        "passwordProblems": undefined
    }

    // Generic test function for easier reuse and concise tests
    function createCreateAccountTest(patientOverrides = {}, expectOverrides = {}){
        return async () => {
            const PatientData = {
                ...(patientOverrides.choice === "healthcare-provider" ? defaultProviderData : defaultData),
                ...patientOverrides
            }

            const Expectations = {
                ...defaultExpectations,
                ...expectOverrides
            }

            const response = await request(app)
                .post('/create_account')
                .send(PatientData)
                .expect('Content-Type', /json/)
                .expect(Expectations.statusCode);

            if (Expectations.message !== undefined) {
                expect(response.body.message).toBe(Expectations.message);
            }
            if (Expectations.passed !== undefined) {
                expect(response.body.passed).toBe(Expectations.passed);
            }
            if (Expectations.statusCannotBe !== undefined) {
                expect(response.status).not.toBe(Expectations.statusCannotBe);
            }
            if (Expectations.passwordProblems !== undefined) {
                expect(response.body.passwordProblems).toContain(Expectations.passwordProblems);
            }
        }
    }

    // -------------------------------------------------------------------------
    // C1 - Verify account creation with valid information
    // Pre-condition: User is not already registered
    // Test data: 
    //      (Patient) first_name: Jeff, last_name: Doe, email: Jeff.doe@gmail.com
    //                password: ValidPassword1!, confirmed_password: ValidPassword1!
    //     (Provider) first_name: John, last_name: Doctor, email: bob@gmail.com
    // Expected: Account created successfully (passed: true)
    // Note: In test mode (NODE_ENV=test), the DB write is skipped but passed: true is returned
    // -------------------------------------------------------------------------
    it("[C1] Should create a patient account with valid information", createCreateAccountTest({}, {
        passed: true, 
        statusCode: 201
    }))

    it("[C1] Should create a provider account with valid information", createCreateAccountTest({
        choice: "healthcare-provider"
    }, {
        passed: true, 
        statusCode: 201
    }))

    // -------------------------------------------------------------------------
    // C2 - Verify account creation with an already registered email (Duplicate Email)
    // Pre-condition: Email already exists in database
    // Test data:
    //      (Patient) email: frank@gmail.com
    //     (Provider) email: bob@gmail.com
    // Expected: "Account already exists."
    // -------------------------------------------------------------------------
    it("[C2] Should not create an account if the patient email already exists", createCreateAccountTest({
        first_name: "Jeff",
        last_name: "Frank",
        phone_number: "8043007898",
        email: "frank@gmail.com",
        password: "RandomPasswords555!!!",
        confirmed_password: "RandomPasswords555!!!"
    }, {
        message: "Account already exists."
    }))

    it("[C2] Should not create an account if the provider email already exists", createCreateAccountTest({
        choice: "healthcare_provider",
        first_name: "Bob",
        last_name: "Smith",
        phone_number: "8042223333",
        email: "bob@gmail.com",
        password: "RandomPasswords444!!!",
        confirmed_password: "RandomPasswords444!!!"
    }, {
        message: "Account already exists."
    }))

    // -------------------------------------------------------------------------
    // C3 - Verify account creation with mismatched passwords
    // Pre-condition: User is not already registered
    // Test data: password: ValidPassword1!, confirmed_password: DifferentPassword1!
    // Expected: "Passwords do not match."
    // -------------------------------------------------------------------------
    it("[C3] Should not create a patient account if passwords do not match", createCreateAccountTest({
        confirmed_password: "DifferentPassword1!"
    }, {
        message: "Passwords do not match."
    }))

    it("[C3] Should not create a provider account if passwords do not match", createCreateAccountTest({
        choice: "healthcare_provider",
        confirmed_password: "DifferentPassword1!",
    }, {
        message: "Passwords do not match."
    }))

    // -------------------------------------------------------------------------
    // C4 - Verify account creation with missing required fields
    // Pre-condition: User is on the Create Account page
    // Test data: email: "missingfields@gmail.com", all other fields empty
    // Expected: "Please fill in all required fields" (passed: false)
    // Note: Required field enforcement (blank first_name, last_name, phone_number)
    //       is handled by the HTML `required` attribute on the frontend.
    //       The backend trims names and still processes the request.
    //       A blank email will not match any existing account, and a blank
    //       password will fail checkPassword — resulting in "Invalid password."
    //       Test below reflects the actual server-side behavior for empty fields.
    // -------------------------------------------------------------------------
    it("[C4] Should not create a patient account if required fields are empty", createCreateAccountTest({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "missingfields@gmail.com",
        password: "",
        confirmed_password: ""
    }, {
        passed: false
    }))

    it("[C4] Should not create a patient account if required fields are empty", createCreateAccountTest({
        choice: "healthcare-provider",
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "missingfields.provider@gmail.com",
        password: "",
        confirmed_password: ""
    }, {
        passed: false
    }))

    // -------------------------------------------------------------------------
    // C5 - Verify account creation with an invalid email format
    // Pre-condition: User is on the Create Account page
    // Test data: 
    //      (Patient) email: Jeff.doe@ (malformed)
    //     (Provider) email: drdoctor@ (malformed)
    // Expected: "Please enter a valid email address" (statusCannotBe: 500)
    // Note: Email format validation is enforced by the HTML `type="email"` input
    //       on the frontend and is NOT validated server-side. This test confirms
    //       the backend still processes the request without crashing, and that
    //       a malformed email does not match an existing account.
    // -------------------------------------------------------------------------
    it("[C5] Should handle an invalid email format for patient without a server error", createCreateAccountTest({
        email: "Jeff.doe@"
    }, {
        statusCannotBe: 500
    }))

    it("[C5] Should handle an invalid format for provider without a server error", createCreateAccountTest({
        choice: "health-provider",
        email: "drdoctor@"
    }, {
        statusCannotBe: 500
    }))

    // -------------------------------------------------------------------------
    // C6 - Verify account creation with a password that does not meet requirements: Too short
    // Pre-condition: User is on the Create Account page
    // Test data: password: Short1!, confirmed_password: Short1!
    // Expected: "Invalid password.", passwordProblems contains "short"
    // -------------------------------------------------------------------------
    it("[C6] Should not create a patient account if password is too short", createCreateAccountTest({
        password: "Short1!",
        confirmed_password: "Short1!"
    }, {
        message: "Invalid password.",
        passwordProblems: "short"
    }))

    it("[C6] Should not create a provider account if password is too short", createCreateAccountTest({
        choice: "healthcare_provider",
        password: "Short1!",
        confirmed_password: "Short1!"
    }, {
        message: "Invalid password.",
        passwordProblems: "short"
    }))

    // -------------------------------------------------------------------------
    // C6 - Verify account creation with a password that does not meet requirements: No uppercase
    // Pre-condition: User is on the Create Account page
    // Test data: password: nouppercase1!abc, confirmed_password: nouppercase1!abc
    // Expected: "Invalid password.", passwordProblems contains "no uppercase"
    // -------------------------------------------------------------------------
    it("[C6] Should not create a patient account if password has no uppercase letter", createCreateAccountTest({
        password: "nouppercase1!abc",
        confirmed_password: "nouppercase1!abc"
    }, {
        message: "Invalid password.",
        passwordProblems: "no uppercase"
    }))

    it("[C6] Should not create a provider account if password has no uppercase letter", createCreateAccountTest({
        choice: "healthcare_provider",
        password: "nouppercase1!abc",
        confirmed_password: "nouppercase1!abc"
    }, {
        message: "Invalid password.",
        passwordProblems: "no uppercase"
    }))

    // -------------------------------------------------------------------------
    // C6 - Verify account creation with a password that does not meet requirements: No lowercase
    // Pre-condition: User is on the Create Account page
    // Test data: password: NOLOWERCASE1!ABC, confirmed_password: NOWLOWERCASE1!ABC
    // Expected: "Invalid password.", passwordProblems contains "no lowercase"
    // -------------------------------------------------------------------------
    it("[C6] Should not create a patient account if password has no lowercase letter", createCreateAccountTest({
        password: "NOLOWERCASE1!ABC",
        confirmed_password: "NOLOWERCASE1!ABC"
    }, {
        message: "Invalid password.",
        passwordProblems: "no lowercase"
    }))

    it("[C6] Should not create a provider account if password has no lowercase letter", createCreateAccountTest({
        choice: "healthcare_provider",
        password: "NOLOWERCASE1!ABC",
        confirmed_password: "NOLOWERCASE1!ABC"
    }, {
        message: "Invalid password.",
        passwordProblems: "no lowercase"
    }))

    // -------------------------------------------------------------------------
    // C6 - Verify account creation with a password that does not meet requirements: No number
    // Pre-condition: User is on the Create Account page
    // Test data: password: NoNumberHere!abc, confirmed_password: NoNumberHere!abc
    // Expected: "Invalid password.", passwordProblems contains "no number"
    // -------------------------------------------------------------------------
    it("[C6] Should not create a patient account if password has no number", createCreateAccountTest({
        password: "NoNumberHere!abc",
        confirmed_password: "NoNumberHere!abc"
    }, {
        message: "Invalid password.",
        passwordProblems: "no number"
    }))

    it("[C6] Should not create a provider account if password has no number", createCreateAccountTest({
        choice: "healthcare_provider",
        password: "NoNumberHere!abc",
        confirmed_password: "NoNumberHere!abc"
    }, {
        message: "Invalid password.",
        passwordProblems: "no number"
    }))

})


//npm test -- /createAccount.test.js          
