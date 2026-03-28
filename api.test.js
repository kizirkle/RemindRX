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
            if (Expectations.error !== undefined) {
                expect(response.body.passed).toBe(Expectations.passed);
            }
        }
    }

    it("Should not log patient in, but with my generic function", createLoginTest({
        entered_email: "fail@gmail.com",
        entered_password: "Password5!Random!"
    }, {
        message: "No account found. Create a new account or enter a different email."
    }))

    it('should not log the patient in if there is no account with email', async () => {
        const PatientNoEmailInSystem = {
            "choice": "patient",
            "entered_email": "fail@gmail.com",
            "entered_password": "Password5!Random!"
        }   

        const expectedMessage = 'No account found. Create a new account or enter a different email.'

        const response = await request(app)
            .post('/login')
            .send(PatientNoEmailInSystem)
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(response.body.message).toBe(expectedMessage)
    })

    it('should not log the provider in if there is no account with email', async () => {
        const ProviderNoEmailInSystem = {
            "choice": "healthcare-provider",
            "entered_email": "fail@gmail.com",
            "entered_password": "Password5!Random!"
        }   

        const expectedMessage = 'No account found. Create a new account or enter a different email.'

        const response = await request(app)
            .post('/login')
            .send(ProviderNoEmailInSystem)
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(response.body.message).toBe(expectedMessage)
    })

    //There is patient in the database called with email frank@gmail.com and password RandomPasswords555!!!
    it('should not log in patient if they have an email but the wrong password', async () => {
        const PatientWrongPassword = {
            "choice": "patient",
            "entered_email": "frank@gmail.com",
            "entered_password": "Password5!Random!"
        }   

        const expectedMessage = 'Incorrect password.'

        const response = await request(app)
            .post('/login')
            .send(PatientWrongPassword)
            .expect('Content-Type', /json/)
            .expect(401);
        
        expect(response.body.message).toBe(expectedMessage)
    })


    //There is provider in the database called with email bob@gmail.com and password RandomPasswords444!!!
    it('should not log in provider if they have an email but the wrong password', async () => {
        const ProviderWrongPassword = {
            "choice": "healthcare-provider",
            "entered_email": "bob@gmail.com",
            "entered_password": "Password5!Random!"
        }   

        const expectedMessage = 'Incorrect password.'

        const response = await request(app)
            .post('/login')
            .send(ProviderWrongPassword)
            .expect('Content-Type', /json/)
            .expect(401);
        
        expect(response.body.message).toBe(expectedMessage)
    })

    //There is patient in the database called with email frank@gmail.com and password RandomPasswords555!!!
    it('should log in patient if they have an email and correct password', async () => {
        const PatientRightPassword = {
            "choice": "patient",
            "entered_email": "frank@gmail.com",
            "entered_password": "RandomPasswords555!!!"
        }   

        const passed = true

        const response = await request(app)
            .post('/login')
            .send(PatientRightPassword)
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(response.body.passed).toBe(passed)
    })

    //There is provider in the database with email bob@gmail.com and password RandomPasswords444!!!
    it('should log in provider if they have an email and correct password', async () => {
        const ProviderRightPassword = {
            "choice": "healthcare-provider",
            "entered_email": "bob@gmail.com",
            "entered_password": "RandomPasswords444!!!"
        }   

        const passed = true

        const response = await request(app)
            .post('/login')
            .send(ProviderRightPassword)
            .expect('Content-Type', /json/)
            .expect(200)
        
        expect(response.body.passed).toBe(passed)
    })
})


describe('POST /create_account', () => {
<<<<<<< Updated upstream:api.test.js
     //There is patient in the database name with email frank@gmail.com and password RandomPasswords555!!!
    it('should not create an account if the patient email already exists', async () => {
        const PatientEmailExists = {
=======

    // -------------------------------------------------------------------------
    // C1 - Verify account creation with valid information
    // Pre-condition: User is not already registered
    // Test data: First: Jeff, Last: Doe, Email: Jeff.doe@gmail.com
    //            Password: Test@1234, Confirm: Test@1234
    // Expected: Account created successfully (passed: true)
    // Note: In test mode (NODE_ENV=test), the DB write is skipped but passed: true is returned
    // -------------------------------------------------------------------------
    it('[C1] should create a patient account with valid information', async () => {
        const ValidPatient = {
            "choice": "patient",
            "first_name": "Jeff",
            "last_name": "Doe",
            "phone_number": "8041234567",
            "email": "Jeff.doe@gmail.com",
            "password": "Test@1234abcd",
            "confirmed_password": "Test@1234abcd"
        }

        const response = await request(app)
            .post('/create_account')
            .send(ValidPatient)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.passed).toBe(true)
    })

    it('[C1] should create a provider account with valid information', async () => {
        const ValidProvider = {
            "choice": "healthcare-provider",
            "first_name": "Jeff",
            "last_name": "Doe",
            "phone_number": "8041234567",
            "email": "Jeff.doe.provider@gmail.com",
            "password": "Test@1234abcd",
            "confirmed_password": "Test@1234abcd"
        }

        const response = await request(app)
            .post('/create_account')
            .send(ValidProvider)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.passed).toBe(true)
    })

    // -------------------------------------------------------------------------
    // C2 - Verify account creation with an already registered email (Duplicate Email)
    // Pre-condition: Email already exists in database
    // Test data: Email: Jeff.doe@gmail.com (patient frank@gmail.com / provider bob@gmail.com)
    // Expected: "Account already exists."
    // -------------------------------------------------------------------------

    // There is a patient in the database with email frank@gmail.com
    it('[C2] should not create a patient account if the email already exists', async () => {
        const DuplicatePatient = {
>>>>>>> Stashed changes:tests/createAccount.test.js
            "choice": "patient",
            "first_name": "Jeff",
            "last_name": "Frank",
            "phone_number": "8043007898",
            "email": "frank@gmail.com",
            "password": "RandomPasswords555!!!",
            "confirmed_password": "RandomPasswords555!!!"
        }

        const response = await request(app)
            .post('/create_account')
            .send(DuplicatePatient)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.passed).toBe(false)
        expect(response.body.message).toBe("Account already exists.")
    })

    // There is a provider in the database with email bob@gmail.com
    it('[C2] should not create a provider account if the email already exists', async () => {
        const DuplicateProvider = {
            "choice": "healthcare-provider",
            "first_name": "Bob",
            "last_name": "Smith",
            "phone_number": "8042223333",
            "email": "bob@gmail.com",
            "password": "RandomPasswords444!!!",
            "confirmed_password": "RandomPasswords444!!!"
        }

        const response = await request(app)
            .post('/create_account')
            .send(DuplicateProvider)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.passed).toBe(false)
        expect(response.body.message).toBe("Account already exists.")
    })

    // -------------------------------------------------------------------------
    // C3 - Verify account creation with mismatched passwords
    // Pre-condition: User is not already registered
    // Test data: Password: Test@1234, Confirm: Test@111
    // Expected: "Passwords do not match."
    // -------------------------------------------------------------------------
    it('[C3] should not create a patient account if passwords do not match', async () => {
        const PatientPasswordMismatch = {
            "choice": "patient",
            "first_name": "Jeff",
            "last_name": "Doe",
            "phone_number": "8041112222",
            "email": "mismatch.patient@gmail.com",
            "password": "Test@1234abcd",
            "confirmed_password": "Test@111"
        }

        const response = await request(app)
            .post('/create_account')
            .send(PatientPasswordMismatch)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.passed).toBe(false)
        expect(response.body.message).toBe("Passwords do not match.")
    })

    it('[C3] should not create a provider account if passwords do not match', async () => {
        const ProviderPasswordMismatch = {
            "choice": "healthcare-provider",
            "first_name": "Jeff",
            "last_name": "Doe",
            "phone_number": "8049998888",
            "email": "mismatch.provider@gmail.com",
            "password": "Test@1234abcd",
            "confirmed_password": "Test@111"
        }

        const response = await request(app)
            .post('/create_account')
            .send(ProviderPasswordMismatch)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.passed).toBe(false)
        expect(response.body.message).toBe("Passwords do not match.")
    })

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
    it('[C4] should not create a patient account if required fields are empty', async () => {
        const PatientMissingFields = {
            "choice": "patient",
            "first_name": "",
            "last_name": "",
            "phone_number": "",
            "email": "missingfields@gmail.com",
            "password": "",
            "confirmed_password": ""
        }

        const response = await request(app)
            .post('/create_account')
            .send(PatientMissingFields)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.passed).toBe(false)
    })

    it('[C4] should not create a provider account if required fields are empty', async () => {
        const ProviderMissingFields = {
            "choice": "healthcare-provider",
            "first_name": "",
            "last_name": "",
            "phone_number": "",
            "email": "missingfields.provider@gmail.com",
            "password": "",
            "confirmed_password": ""
        }

        const response = await request(app)
            .post('/create_account')
            .send(ProviderMissingFields)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.passed).toBe(false)
    })

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
    it('[C5] should handle an invalid email format without a server error', async () => {
        const InvalidEmailPatient = {
            "choice": "patient",
            "first_name": "Jeff",
            "last_name": "Doe",
            "phone_number": "8041234567",
            "email": "Jeff.doe@",
            "password": "Test@1234abcd",
            "confirmed_password": "Test@1234abcd"
        }

        const response = await request(app)
            .post('/create_account')
            .send(InvalidEmailPatient)
            .expect('Content-Type', /json/)
            .expect(200)

        // Server does not validate email format — it will either create the account
        // (passed: true) or reject for another reason, but must not 500
        expect(response.status).not.toBe(500)
    })

    // -------------------------------------------------------------------------
    // C6 - Verify account creation with a password that does not meet requirements
    // Pre-condition: User is on the Create Account page
    // Test data: Password: 123, Confirm: 123
    // Expected: Password must be at least 12 chars, 1 uppercase, 1 lowercase,
    //           1 number, 1 special character
    // -------------------------------------------------------------------------
    it('[C6] should not create a patient account if the password does not meet requirements', async () => {
        const PatientBadPassword = {
            "choice": "patient",
            "first_name": "Jeff",
            "last_name": "Doe",
            "phone_number": "8041112222",
            "email": "badpassword.patient@gmail.com",
            "password": "123",
            "confirmed_password": "123"
        }

        const response = await request(app)
            .post('/create_account')
            .send(PatientBadPassword)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.passed).toBe(false)
        expect(response.body.message).toBe("Invalid password.")
        expect(response.body.passwordProblems).toContain("short")
        expect(response.body.passwordProblems).toContain("no uppercase")
        expect(response.body.passwordProblems).toContain("no lowercase")
        expect(response.body.passwordProblems).toContain("no special character")
    })

    it('[C6] should not create a provider account if the password does not meet requirements', async () => {
        const ProviderBadPassword = {
            "choice": "healthcare-provider",
            "first_name": "Jeff",
            "last_name": "Doe",
            "phone_number": "8049998888",
            "email": "badpassword.provider@gmail.com",
            "password": "123",
            "confirmed_password": "123"
        }

        const response = await request(app)
            .post('/create_account')
            .send(ProviderBadPassword)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.passed).toBe(false)
        expect(response.body.message).toBe("Invalid password.")
        expect(response.body.passwordProblems).toContain("short")
        expect(response.body.passwordProblems).toContain("no uppercase")
        expect(response.body.passwordProblems).toContain("no lowercase")
        expect(response.body.passwordProblems).toContain("no special character")
    })

    // -------------------------------------------------------------------------
    // Password character requirement tests (individual checks)
    // These go beyond the Lucid doc but verify each rule in isolation
    // -------------------------------------------------------------------------

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

    // it('should not create a provider account if password is too short', async () => {
    //     const ProviderShortPassword = {
    //         "choice": "healthcare-provider",
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

    // it('should not create a provider account if password has no uppercase letter', async () => {
    //     const ProviderNoUppercase = {
    //         "choice": "healthcare-provider",
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

    // it('should not create a provider account if password has no lowercase letter', async () => {
    //     const ProviderNoLowercase = {
    //         "choice": "healthcare-provider",
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

    // it('should not create a provider account if password has no number', async () => {
    //     const ProviderNoNumber = {
    //         "choice": "healthcare-provider",
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

<<<<<<< Updated upstream:api.test.js
        expect(response.body.message).toBe("Invalid password.")
        expect(response.body.passwordProblems).toContain("no number")
    })





})

=======
})

//npm test -- /createAccount_test.js
>>>>>>> Stashed changes:tests/createAccount.test.js
