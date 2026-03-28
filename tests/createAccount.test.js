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
            if (Expectations.passwordProblems !== undefined) {
                expect(response.body.passwordProblems).toContain(Expectations.passwordProblems)
            }
        }
    }

    // Email already exists in logs (Patient account)
    it("Should not create an account if the patient email already exists", createCreateAccountTest({
        first_name: "Jeff",
        last_name: "Frank",
        phone_number: "8043007898",
        email: "frank@gmail.com",
        password: "RandomPasswords555!!!",
        confirmed_password: "RandomPasswords555!!!"
    }, {
        message: "Account already exists."
    }))

    // Email already exists in logs (Provider account)
    it("Should not create an account if the provider email already exists", createCreateAccountTest({
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

    // Passwords do not match (Patient account)
    it("Should not create a patient account if passwords do not match", createCreateAccountTest({
        confirmed_password: "DifferentPassword1!"
    }, {
        message: "Passwords do not match."
    }))

    // Passwords do not match (Provider account)
    it("Should not create a provider account if passwords do not match", createCreateAccountTest({
        choice: "healthcare_provider",
        confirmed_password: "DifferentPassword1!",
    }, {
        message: "Passwords do not match."
    }))

    // Password too short (Patient account)
    it("Should not create a patient account if password is too short", createCreateAccountTest({
        password: "Short1!",
        confirmed_password: "Short1!"
    }, {
        message: "Invalid password.",
        passwordProblems: "short"
    }))

    // Password too short (Provider account)
    it("Should not create a provider account if password is too short", createCreateAccountTest({
        choice: "healthcare_provider",
        password: "Short1!",
        confirmed_password: "Short1!"
    }, {
        message: "Invalid password.",
        passwordProblems: "short"
    }))

    // Password missing uppercase (Patient account)
    it("Should not create a patient account if password has no uppercase letter", createCreateAccountTest({
        password: "nouppercase1!abc",
        confirmed_password: "nouppercase1!abc"
    }, {
        message: "Invalid password.",
        passwordProblems: "no uppercase"
    }))

    // Password missing uppercase (Provider account)
    it("Should not create a provider account if password has no uppercase letter", createCreateAccountTest({
        choice: "healthcare_provider",
        password: "nouppercase1!abc",
        confirmed_password: "nouppercase1!abc"
    }, {
        message: "Invalid password.",
        passwordProblems: "no uppercase"
    }))

    // Password missing uppercase (Patient account)
    it("Should not create a patient account if password has no lowercase letter", createCreateAccountTest({
        password: "NOLOWERCASE1!ABC",
        confirmed_password: "NOLOWERCASE1!ABC"
    }, {
        message: "Invalid password.",
        passwordProblems: "no lowercase"
    }))

    // Password missing lowercase (Provider account)
    it("Should not create a provider account if password has no lowercase letter", createCreateAccountTest({
        choice: "healthcare_provider",
        password: "NOLOWERCASE1!ABC",
        confirmed_password: "NOLOWERCASE1!ABC"
    }, {
        message: "Invalid password.",
        passwordProblems: "no lowercase"
    }))

    // Passing missing number (Patient account)
    it("Should not create a patient account if password has no number", createCreateAccountTest({
        password: "NoNumberHere!abc",
        confirmed_password: "NoNumberHere!abc"
    }, {
        message: "Invalid password.",
        passwordProblems: "no number"
    }))

    // Password missing number (Provider account)
    it("Should not create a provider account if password has no number", createCreateAccountTest({
        choice: "healthcare_provider",
        password: "NoNumberHere!abc",
        confirmed_password: "NoNumberHere!abc"
    }, {
        message: "Invalid password.",
        passwordProblems: "no number"
    }))

})


//npm test -- /createAccount.test.js          
