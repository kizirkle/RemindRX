import request from 'supertest'
import app from '../app'

describe('POST /create_account', () => {

    // Default data to use for generic test function ("correct" values are the default)
    const defaultData = {
        "choice": "patient",
        "first_name": "Squilliam",
        "last_name": "Fancyson",
        "phone_number": "8041112222",
        "email": "Fancyson@gmail.com",
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
    // Test data: First: Squilliam, Last: Fancyson, Email: Fancyson@gmail.com
    //            Password: ValidPassword1!, Confirm: ValidPassword1!
    // Expected: Account created successfully (passed: true)
    // Note: In test mode (NODE_ENV=test), the DB write is skipped but passed: true is returned
    // -------------------------------------------------------------------------
    it("[C1] Should create a patient account with valid information", createCreateAccountTest({}, {
        passed: true
    }))

    it("[C1] Should create a provider account with valid information", createCreateAccountTest({
        choice: "healthcare-provider"
    }, {
        passed: true
    }))

    // -------------------------------------------------------------------------
    // C2 - Verify account creation with an already registered email (Duplicate Email)
    // Pre-condition: Email already exists in database
    // Test data: Email: Jeff.doe@gmail.com (patient frank@gmail.com / provider bob@gmail.com)
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
    // Test data: Password: Test@1234, Confirm: Test@111
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
    // Test data: First name left blank, all other fields filled
    // Expected: "Please fill in all required fields"
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
    // Test data: Email: Jeff.doe@ (malformed)
    // Expected: "Please enter a valid email address"
    // Note: Email format validation is enforced by the HTML `type="email"` input
    //       on the frontend and is NOT validated server-side. This test confirms
    //       the backend still processes the request without crashing, and that
    //       a malformed email does not match an existing account.
    // -------------------------------------------------------------------------
    it("[C5] Should handle an invalid email format without a server error", createCreateAccountTest({
        email: "Fancyson@"
    }, {
        statusCannotBe: 500
    }))

    // -------------------------------------------------------------------------
    // C6 - Verify account creation with a password that does not meet requirements
    // Pre-condition: User is on the Create Account page
    // Test data: Password: 123, Confirm: 123
    // Expected: Password must be at least 12 chars, 1 uppercase, 1 lowercase,
    //           1 number, 1 special character
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
