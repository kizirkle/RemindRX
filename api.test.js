import request from 'supertest'
import app from './app'


describe('POST /login', () => {
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
     //There is patient in the database name with email frank@gmail.com and password RandomPasswords555!!!
    it('should not create an account if the patient email already exists', async () => {
        const PatientEmailExists = {
            "choice": "patient",
            "first_name": "Jeff",
            "last_name": "Frank",
            "phone_number": "8043007898",
            "email": "frank@gmail.com",
            "password": "RandomPasswords555!!!",
            "confirmed_password": "RandomPasswords555!!!",
            "provider_id": "100001"
        }   

        const expectedMessage = "Account already exists."

        const response = await request(app)
            .post('/create_account')
            .send(PatientEmailExists)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.message).toBe(expectedMessage)
    })

    //There is provider in the database with email bob@gmail.com and password RandomPasswords444!!!
     it('should not create an account if the provider email already exists', async () => {
        const ProviderEmailExists = {
            "choice": "healthcare_provider",
            "first_name": "Bob",
            "last_name": "Smith",
            "phone_number": "8042223333",
            "email": "bob@gmail.com",
            "password": "RandomPasswords444!!!",
            "confirmed_password": "RandomPasswords444!!!",
            "provider_id": "100001"
        }   

        const expectedMessage = "Account already exists."

        const response = await request(app)
            .post('/create_account')
            .send(ProviderEmailExists)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.message).toBe(expectedMessage)
    })

    // Passwords do not match  -create patient-
    it('should not create a patient account if passwords do not match', async () => {
        const PatientPasswordMismatch = {
            "choice": "patient",
            "first_name": "Squilliam",
            "last_name": "Fancyson",
            "phone_number": "8041112222",
            "email": "Fancyson@gmail.com",
            "password": "ValidPassword1!",
            "confirmed_password": "DifferentPassword1!",
            
        }
         const expectedMessage = "Passwords do not match"

        const response = await request(app)
            .post('/create_account')
            .send(PatientPasswordMismatch)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.message).toBe(expectedMessage)
    })

    //Passwords do not match -create provider-
    it('should not create a provider account if passwords do not match', async () => {
        const ProviderPasswordMismatch = {
            "choice": "healthcare_provider",
            "first_name": "John",
            "last_name": "Doctor",
            "phone_number": "8049998888",
            "email": "drdoctor@gmail.com",
            "password": "ValidPassword1!",
            "confirmed_password": "DifferentPassword1!"
        }

        const expectedMessage = "Passwords do not match"

        const response = await request(app)
            .post('/create_account')
            .send(ProviderPasswordMismatch)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.message).toBe(expectedMessage)
    })

    //Password too short -create patient-
    it('should not create a patient account if password is too short', async () => {
        const PatientShortPassword = {
            "choice": "patient",
            "first_name": "Squilliam",
            "last_name": "Fancyson",
            "phone_number": "8041112222",
            "email": "Fancyson@gmail.com",
            "password": "Short1!",
            "confirmed_password": "Short1!",
            
        }

        const response = await request(app)
            .post('/create_account')
            .send(PatientShortPassword)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.message).toBe("Invalid password")
        expect(response.body.passwordProblems).toContain("short")
    })

    // Password too short -create provider-
    it('should not create a provider account if password is too short', async () => {
        const ProviderShortPassword = {
            "choice": "healthcare_provider",
            "first_name": "John",
            "last_name": "Doctor",
            "phone_number": "8049998888",
            "email": "drdoctor@gmail.com",
            "password": "Short1!",
            "confirmed_password": "Short1!"
        }

        const response = await request(app)
            .post('/create_account')
            .send(ProviderShortPassword)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.message).toBe("Invalid password")
        expect(response.body.passwordProblems).toContain("short")
    })

     //Password missing upper case -create patient-
    it('should not create a patient account if password has no uppercase letter', async () => {
        const PatientNoUppercase = {
            "choice": "patient",
            "first_name": "Squilliam",
            "last_name": "Fancyson",
            "phone_number": "8041112222",
            "email": "Fancyson@gmail.com",
            "password": "nouppercase1!abc",
            "confirmed_password": "nouppercase1!abc",
           
        }

        const response = await request(app)
            .post('/create_account')
            .send(PatientNoUppercase)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.message).toBe("Invalid password")
        expect(response.body.passwordProblems).toContain("no uppercase")
    })

    //Password missing upper case -create provider-
    it('should not create a provider account if password has no uppercase letter', async () => {
        const ProviderNoUppercase = {
            "choice": "healthcare_provider",
            "first_name": "John",
            "last_name": "Doctor",
            "phone_number": "8049998888",
            "email": "drdoctor@gmail.com",
            "password": "nouppercase1!abc",
            "confirmed_password": "nouppercase1!abc"
        }

        const response = await request(app)
            .post('/create_account')
            .send(ProviderNoUppercase)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.message).toBe("Invalid password")
        expect(response.body.passwordProblems).toContain("no uppercase")
    })

    //Password missing uppercase -create patient-
    it('should not create a patient account if password has no lowercase letter', async () => {
        const PatientNoLowercase = {
            "choice": "patient",
            "first_name": "Squilliam",
            "last_name": "Fancyson",
            "phone_number": "8041112222",
            "email": "Fancyson@gmail.com",
            "password": "NOLOWERCASE1!ABC",
            "confirmed_password": "NOLOWERCASE1!ABC",
            
        }

        const response = await request(app)
            .post('/create_account')
            .send(PatientNoLowercase)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.message).toBe("Invalid password")
        expect(response.body.passwordProblems).toContain("no lowercase")
    })

    //Password missing lowercase -create provider-
    it('should not create a provider account if password has no lowercase letter', async () => {
        const ProviderNoLowercase = {
            "choice": "healthcare_provider",
            "first_name": "John",
            "last_name": "Doctor",
            "phone_number": "8049998888",
            "email": "drdoctor@gmail.com",
            "password": "NOLOWERCASE1!ABC",
            "confirmed_password": "NOLOWERCASE1!ABC"
        }

        const response = await request(app)
            .post('/create_account')
            .send(ProviderNoLowercase)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.message).toBe("Invalid password")
        expect(response.body.passwordProblems).toContain("no lowercase")
    })

    //Password missing number -create patient-
    it('should not create a patient account if password has no number', async () => {
        const PatientNoNumber = {
            "choice": "patient",
            "first_name": "Squilliam",
            "last_name": "Fancyson",
            "phone_number": "8041112222",
            "email": "Fancyson@gmail.com",
            "password": "NoNumberHere!abc",
            "confirmed_password": "NoNumberHere!abc",
            
        }

        const response = await request(app)
            .post('/create_account')
            .send(PatientNoNumber)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.message).toBe("Invalid password")
        expect(response.body.passwordProblems).toContain("no number")
    })

    //Password missing number -create provider-
    it('should not create a provider account if password has no number', async () => {
        const ProviderNoNumber = {
            "choice": "healthcare_provider",
            "first_name": "John",
            "last_name": "Doctor",
            "phone_number": "8049998888",
            "email": "drdoctor@gmail.com",
            "password": "NoNumberHere!abc",
            "confirmed_password": "NoNumberHere!abc"
        }

        const response = await request(app)
            .post('/create_account')
            .send(ProviderNoNumber)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.message).toBe("Invalid password")
        expect(response.body.passwordProblems).toContain("no number")
    })

    //Password missing special character -create patient-
    it('should not create a patient account if password has no special character', async () => {
        const PatientNoSpecial = {
            "choice": "patient",
            "first_name": "Squilliam",
            "last_name": "Fancyson",
            "phone_number": "8041112222",
            "email": "Fancyson@gmail.com",
            "password": "NoSpecialChar1abc",
            "confirmed_password": "NoSpecialChar1abc",
            
        }

        const response = await request(app)
            .post('/create_account')
            .send(PatientNoSpecial)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.message).toBe("Invalid password")
        expect(response.body.passwordProblems).toContain("no special character")
    })

    //Password missing special character -create provider-
    it('should not create a provider account if password has no special character', async () => {
        const ProviderNoSpecial = {
            "choice": "healthcare_provider",
            "first_name": "John",
            "last_name": "Doctor",
            "phone_number": "8049998888",
            "email": "drdoctor@gmail.com",
            "password": "NoSpecialChar1abc",
            "confirmed_password": "NoSpecialChar1abc"
        }

        const response = await request(app)
            .post('/create_account')
            .send(ProviderNoSpecial)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.message).toBe("Invalid password")
        expect(response.body.passwordProblems).toContain("no special character")
    })

    //Password failing multiple requirements -create patient-
    it('should report multiple password problems when several requirements are missing', async () => {
        const PatientBadPassword = {
            "choice": "patient",
            "first_name": "Squilliam",
            "last_name": "Fancyson",
            "phone_number": "8041112222",
            "email": "Fancyson@gmail.com",
            "password": "short",         
            "confirmed_password": "short",
        }

        const response = await request(app)
            .post('/create_account')
            .send(PatientBadPassword)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.message).toBe("Invalid password")
        expect(response.body.passwordProblems).toContain("short")
        expect(response.body.passwordProblems).toContain("no uppercase")
        expect(response.body.passwordProblems).toContain("no number")
        expect(response.body.passwordProblems).toContain("no special character")
    })
    //Password failing multiple requirements -create provider-
    it('should report multiple password problems for provider when several requirements are missing', async () => {
        const ProviderBadPassword = {
            "choice": "healthcare_provider",
            "first_name": "John",
            "last_name": "Doctor",
            "phone_number": "8049998888",
            "email": "drdoctor@gmail.com",
            "password": "short",       
            "confirmed_password": "short"
        }

        const response = await request(app)
            .post('/create_account')
            .send(ProviderBadPassword)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body.message).toBe("Invalid password")
        expect(response.body.passwordProblems).toContain("short")
        expect(response.body.passwordProblems).toContain("no uppercase")
        expect(response.body.passwordProblems).toContain("no number")
        expect(response.body.passwordProblems).toContain("no special character")
    })

})








