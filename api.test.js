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
            .expect(200);
        
        expect(response.body.passed).toBe(passed)
    })
})


