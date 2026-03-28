import request from 'supertest'
import app from './app'


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

    it("Should not log the patient in if there is no account with email", createLoginTest({
        entered_email: "fail@gmail.com",
        entered_password: "Password5!Random!"
    }, {
        message: "No account found. Create a new account or enter a different email."
    }))

    // it('should not log the patient in if there is no account with email', async () => {
    //     const PatientNoEmailInSystem = {
    //         "choice": "patient",
    //         "entered_email": "fail@gmail.com",
    //         "entered_password": "Password5!Random!"
    //     }   

    //     const expectedMessage = 'No account found. Create a new account or enter a different email.'

    //     const response = await request(app)
    //         .post('/login')
    //         .send(PatientNoEmailInSystem)
    //         .expect('Content-Type', /json/)
    //         .expect(200);
        
    //     expect(response.body.message).toBe(expectedMessage)
    // })

    it("Should not log the provider in if there is no account with email", createLoginTest({
        choice: "healthcare-provider",
        entered_email: "fail@gmail.com",
        entered_password: "Password5!Random!"
    }, {
        message: "No account found. Create a new account or enter a different email."
    }))

    // it('should not log the provider in if there is no account with email', async () => {
    //     const ProviderNoEmailInSystem = {
    //         "choice": "healthcare-provider",
    //         "entered_email": "fail@gmail.com",
    //         "entered_password": "Password5!Random!"
    //     }   

    //     const expectedMessage = 'No account found. Create a new account or enter a different email.'

    //     const response = await request(app)
    //         .post('/login')
    //         .send(ProviderNoEmailInSystem)
    //         .expect('Content-Type', /json/)
    //         .expect(200);
        
    //     expect(response.body.message).toBe(expectedMessage)
    // })

    it("Should not log in patient if they have an email but the wrong password", createLoginTest({
        entered_password: "Password5!Random!"
    }, {
        message: "Incorrect password.",
        statusCode: 401
    }))

    // //There is patient in the database called with email frank@gmail.com and password RandomPasswords555!!!
    // it('should not log in patient if they have an email but the wrong password', async () => {
    //     const PatientWrongPassword = {
    //         "choice": "patient",
    //         "entered_email": "frank@gmail.com",
    //         "entered_password": "Password5!Random!"
    //     }   

    //     const expectedMessage = 'Incorrect password.'

    //     const response = await request(app)
    //         .post('/login')
    //         .send(PatientWrongPassword)
    //         .expect('Content-Type', /json/)
    //         .expect(401);
        
    //     expect(response.body.message).toBe(expectedMessage)
    // })

    it("Should not log in provider if they have an email but the wrong password", createLoginTest({
        choice: "healthcare-provider",
        entered_email: "bob@gmail.com",
        entered_password: "Password5!Random!"
    }, {
        message: "Incorrect password.",
        statusCode: 401
    }))

    // //There is provider in the database called with email bob@gmail.com and password RandomPasswords444!!!
    // it('should not log in provider if they have an email but the wrong password', async () => {
    //     const ProviderWrongPassword = {
    //         "choice": "healthcare-provider",
    //         "entered_email": "bob@gmail.com",
    //         "entered_password": "Password5!Random!"
    //     }   

    //     const expectedMessage = 'Incorrect password.'

    //     const response = await request(app)
    //         .post('/login')
    //         .send(ProviderWrongPassword)
    //         .expect('Content-Type', /json/)
    //         .expect(401);
        
    //     expect(response.body.message).toBe(expectedMessage)
    // })

    it("Should log in patient if they have an email and correct password", createLoginTest({}, {
        passed: true
    }))

    // //There is patient in the database called with email frank@gmail.com and password RandomPasswords555!!!
    // it('should log in patient if they have an email and correct password', async () => {
    //     const PatientRightPassword = {
    //         "choice": "patient",
    //         "entered_email": "frank@gmail.com",
    //         "entered_password": "RandomPasswords555!!!"
    //     }   

    //     const passed = true

    //     const response = await request(app)
    //         .post('/login')
    //         .send(PatientRightPassword)
    //         .expect('Content-Type', /json/)
    //         .expect(200);
        
    //     expect(response.body.passed).toBe(passed)
    // })

    it("Should log in provider if they have an email and correct password", createLoginTest({
        choice: "healthcare-provider",
        entered_email: "bob@gmail.com",
        entered_password: "RandomPasswords444!!!"
    }, {
        passed: true
    }))

    // //There is provider in the database with email bob@gmail.com and password RandomPasswords444!!!
    // it('should log in provider if they have an email and correct password', async () => {
    //     const ProviderRightPassword = {
    //         "choice": "healthcare-provider",
    //         "entered_email": "bob@gmail.com",
    //         "entered_password": "RandomPasswords444!!!"
    //     }   

    //     const passed = true

    //     const response = await request(app)
    //         .post('/login')
    //         .send(ProviderRightPassword)
    //         .expect('Content-Type', /json/)
    //         .expect(200)
        
    //     expect(response.body.passed).toBe(passed)
    // })
})


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

    //  //There is patient in the database name with email frank@gmail.com and password RandomPasswords555!!!
    // it('should not create an account if the patient email already exists', async () => {
    //     const PatientEmailExists = {
    //         "choice": "patient",
    //         "first_name": "Jeff",
    //         "last_name": "Frank",
    //         "phone_number": "8043007898",
    //         "email": "frank@gmail.com",
    //         "password": "RandomPasswords555!!!",
    //         "confirmed_password": "RandomPasswords555!!!"
    //     }   

    //     const expectedMessage = "Account already exists."

    //     const response = await request(app)
    //         .post('/create_account')
    //         .send(PatientEmailExists)
    //         .expect('Content-Type', /json/)
    //         .expect(200)

    //     expect(response.body.message).toBe(expectedMessage)
    // })

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

    // //There is provider in the database with email bob@gmail.com and password RandomPasswords444!!!
    //  it('should not create an account if the provider email already exists', async () => {
    //     const ProviderEmailExists = {
    //         "choice": "healthcare_provider",
    //         "first_name": "Bob",
    //         "last_name": "Smith",
    //         "phone_number": "8042223333",
    //         "email": "bob@gmail.com",
    //         "password": "RandomPasswords444!!!",
    //         "confirmed_password": "RandomPasswords444!!!"
    //     }   

    //     const expectedMessage = "Account already exists."

    //     const response = await request(app)
    //         .post('/create_account')
    //         .send(ProviderEmailExists)
    //         .expect('Content-Type', /json/)
    //         .expect(200)

    //     expect(response.body.message).toBe(expectedMessage)
    // })

    it("Should not create a patient account if passwords do not match", createCreateAccountTest({
        confirmed_password: "DifferentPassword1!"
    }, {
        message: "Passwords do not match."
    }))

    // // Passwords do not match  -create patient-
    // it('should not create a patient account if passwords do not match', async () => {
    //     const PatientPasswordMismatch = {
    //         "choice": "patient",
    //         "first_name": "Squilliam",
    //         "last_name": "Fancyson",
    //         "phone_number": "8041112222",
    //         "email": "Fancyson@gmail.com",
    //         "password": "ValidPassword1!",
    //         "confirmed_password": "DifferentPassword1!",
    //     }
    //      const expectedMessage = "Passwords do not match."

    //     const response = await request(app)
    //         .post('/create_account')
    //         .send(PatientPasswordMismatch)
    //         .expect('Content-Type', /json/)
    //         .expect(200)

    //     expect(response.body.message).toBe(expectedMessage)
    // })

    it("Should not create a provider account if passwords do not match", createCreateAccountTest({
        choice: "healthcare_provider",
        confirmed_password: "DifferentPassword1!",
    }, {
        message: "Passwords do not match."
    }))

    // //Passwords do not match -create provider-
    // it('should not create a provider account if passwords do not match', async () => {
    //     const ProviderPasswordMismatch = {
    //         "choice": "healthcare_provider",
    //         "first_name": "John",
    //         "last_name": "Doctor",
    //         "phone_number": "8049998888",
    //         "email": "drdoctor@gmail.com",
    //         "password": "ValidPassword1!",
    //         "confirmed_password": "DifferentPassword1!"
    //     }

    //     const expectedMessage = "Passwords do not match."

    //     const response = await request(app)
    //         .post('/create_account')
    //         .send(ProviderPasswordMismatch)
    //         .expect('Content-Type', /json/)
    //         .expect(200)

    //     expect(response.body.message).toBe(expectedMessage)
    // })

    it("Should not create a patient account if password is too short", createCreateAccountTest({
        password: "Short1!",
        confirmed_password: "Short1!"
    }, {
        message: "Invalid password.",
        passwordProblems: "short"
    }))

    // //Password too short -create patient-
    // it('should not create a patient account if password is too short', async () => {
    //     const PatientShortPassword = {
    //         "choice": "patient",
    //         "first_name": "Squilliam",
    //         "last_name": "Fancyson",
    //         "phone_number": "8041112222",
    //         "email": "Fancyson@gmail.com",
    //         "password": "Short1!",
    //         "confirmed_password": "Short1!",
    //     }

    //     const response = await request(app)
    //         .post('/create_account')
    //         .send(PatientShortPassword)
    //         .expect('Content-Type', /json/)
    //         .expect(200)

    //     expect(response.body.message).toBe("Invalid password.")
    //     expect(response.body.passwordProblems).toContain("short")
    // })

    it("Should not create a provider account if password is too short", createCreateAccountTest({
        choice: "healthcare_provider",
        password: "Short1!",
        confirmed_password: "Short1!"
    }, {
        message: "Invalid password.",
        passwordProblems: "short"
    }))

    // // Password too short -create provider-
    // it('should not create a provider account if password is too short', async () => {
    //     const ProviderShortPassword = {
    //         "choice": "healthcare_provider",
    //         "first_name": "John",
    //         "last_name": "Doctor",
    //         "phone_number": "8049998888",
    //         "email": "drdoctor@gmail.com",
    //         "password": "Short1!",
    //         "confirmed_password": "Short1!"
    //     }

    //     const response = await request(app)
    //         .post('/create_account')
    //         .send(ProviderShortPassword)
    //         .expect('Content-Type', /json/)
    //         .expect(200)

    //     expect(response.body.message).toBe("Invalid password.")
    //     expect(response.body.passwordProblems).toContain("short")
    // })

    it("Should not create a patient account if password has no uppercase letter", createCreateAccountTest({
        password: "nouppercase1!abc",
        confirmed_password: "nouppercase1!abc"
    }, {
        message: "Invalid password.",
        passwordProblems: "no uppercase"
    }))

    //  //Password missing upper case -create patient-
    // it('should not create a patient account if password has no uppercase letter', async () => {
    //     const PatientNoUppercase = {
    //         "choice": "patient",
    //         "first_name": "Squilliam",
    //         "last_name": "Fancyson",
    //         "phone_number": "8041112222",
    //         "email": "Fancyson@gmail.com",
    //         "password": "nouppercase1!abc",
    //         "confirmed_password": "nouppercase1!abc",
    //     }

    //     const response = await request(app)
    //         .post('/create_account')
    //         .send(PatientNoUppercase)
    //         .expect('Content-Type', /json/)
    //         .expect(200)

    //     expect(response.body.message).toBe("Invalid password.")
    //     expect(response.body.passwordProblems).toContain("no uppercase")
    // })

    it("Should not create a provider account if password has no uppercase letter", createCreateAccountTest({
        choice: "healthcare_provider",
        password: "nouppercase1!abc",
        confirmed_password: "nouppercase1!abc"
    }, {
        message: "Invalid password.",
        passwordProblems: "no uppercase"
    }))

    // //Password missing upper case -create provider-
    // it('should not create a provider account if password has no uppercase letter', async () => {
    //     const ProviderNoUppercase = {
    //         "choice": "healthcare_provider",
    //         "first_name": "John",
    //         "last_name": "Doctor",
    //         "phone_number": "8049998888",
    //         "email": "drdoctor@gmail.com",
    //         "password": "nouppercase1!abc",
    //         "confirmed_password": "nouppercase1!abc"
    //     }

    //     const response = await request(app)
    //         .post('/create_account')
    //         .send(ProviderNoUppercase)
    //         .expect('Content-Type', /json/)
    //         .expect(200)

    //     expect(response.body.message).toBe("Invalid password.")
    //     expect(response.body.passwordProblems).toContain("no uppercase")
    // })

    it("Should not create a patient account if password has no lowercase letter", createCreateAccountTest({
        password: "NOLOWERCASE1!ABC",
        confirmed_password: "NOLOWERCASE1!ABC"
    }, {
        message: "Invalid password.",
        passwordProblems: "no lowercase"
    }))

    // //Password missing uppercase -create patient-
    // it('should not create a patient account if password has no lowercase letter', async () => {
    //     const PatientNoLowercase = {
    //         "choice": "patient",
    //         "first_name": "Squilliam",
    //         "last_name": "Fancyson",
    //         "phone_number": "8041112222",
    //         "email": "Fancyson@gmail.com",
    //         "password": "NOLOWERCASE1!ABC",
    //         "confirmed_password": "NOLOWERCASE1!ABC",
    //     }

    //     const response = await request(app)
    //         .post('/create_account')
    //         .send(PatientNoLowercase)
    //         .expect('Content-Type', /json/)
    //         .expect(200)

    //     expect(response.body.message).toBe("Invalid password.")
    //     expect(response.body.passwordProblems).toContain("no lowercase")
    // })

    it("Should not create a provider account if password has no lowercase letter", createCreateAccountTest({
        choice: "healthcare_provider",
        password: "NOLOWERCASE1!ABC",
        confirmed_password: "NOLOWERCASE1!ABC"
    }, {
        message: "Invalid password.",
        passwordProblems: "no lowercase"
    }))

    // //Password missing lowercase -create provider-
    // it('should not create a provider account if password has no lowercase letter', async () => {
    //     const ProviderNoLowercase = {
    //         "choice": "healthcare_provider",
    //         "first_name": "John",
    //         "last_name": "Doctor",
    //         "phone_number": "8049998888",
    //         "email": "drdoctor@gmail.com",
    //         "password": "NOLOWERCASE1!ABC",
    //         "confirmed_password": "NOLOWERCASE1!ABC"
    //     }

    //     const response = await request(app)
    //         .post('/create_account')
    //         .send(ProviderNoLowercase)
    //         .expect('Content-Type', /json/)
    //         .expect(200)

    //     expect(response.body.message).toBe("Invalid password.")
    //     expect(response.body.passwordProblems).toContain("no lowercase")
    // })

    it("Should not create a patient account if password has no number", createCreateAccountTest({
        password: "NoNumberHere!abc",
        confirmed_password: "NoNumberHere!abc"
    }, {
        message: "Invalid password.",
        passwordProblems: "no number"
    }))

    // //Password missing number -create patient-
    // it('should not create a patient account if password has no number', async () => {
    //     const PatientNoNumber = {
    //         "choice": "patient",
    //         "first_name": "Squilliam",
    //         "last_name": "Fancyson",
    //         "phone_number": "8041112222",
    //         "email": "Fancyson@gmail.com",
    //         "password": "NoNumberHere!abc",
    //         "confirmed_password": "NoNumberHere!abc"
    //     }

    //     const response = await request(app)
    //         .post('/create_account')
    //         .send(PatientNoNumber)
    //         .expect('Content-Type', /json/)
    //         .expect(200)

    //     expect(response.body.message).toBe("Invalid password.")
    //     expect(response.body.passwordProblems).toContain("no number")
    // })

    it("Should not create a provider account if password has no number", createCreateAccountTest({
        choice: "healthcare_provider",
        password: "NoNumberHere!abc",
        confirmed_password: "NoNumberHere!abc"
    }, {
        message: "Invalid password.",
        passwordProblems: "no number"
    }))

    // //Password missing number -create provider-
    // it('should not create a provider account if password has no number', async () => {
    //     const ProviderNoNumber = {
    //         "choice": "healthcare_provider",
    //         "first_name": "John",
    //         "last_name": "Doctor",
    //         "phone_number": "8049998888",
    //         "email": "drdoctor@gmail.com",
    //         "password": "NoNumberHere!abc",
    //         "confirmed_password": "NoNumberHere!abc"
    //     }

    //     const response = await request(app)
    //         .post('/create_account')
    //         .send(ProviderNoNumber)
    //         .expect('Content-Type', /json/)
    //         .expect(200)

    //     expect(response.body.message).toBe("Invalid password.")
    //     expect(response.body.passwordProblems).toContain("no number")
    // })





})

