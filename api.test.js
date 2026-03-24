import request from 'supertest'
import app from './app'


describe('POST /login', () => {
    it('should not log the user in if there is no account with email for patient', async () => {
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

    it('should not log the user in if there is no account with email for patient', async () => {
        const PatientNoEmailInSystem = {
            "choice": "healthcare-provider",
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

})



