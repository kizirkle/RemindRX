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

//npm test -- /login.test.js          
