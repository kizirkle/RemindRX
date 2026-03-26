import request from 'supertest'
import app from './app'


describe('POST /patient/:id/addProvider', () => {

    //There is patient in the database named Jeff Frank with patient_id = 1 and healthcare provider Bob Smith added 
    //who has provider_id = 100000. There is no provider with ID 555555.
    it('should not add provider if the ID does not exist', async () => {
        const NoProviderWithID = {
            "patient_id": "1",
            "provider_id": "555555",
            "provider_first_name": "Bob", 
            "provider_last_name": "Smith"
        }  

        const expectedMessage = 'No healthcare provider found.'

        const response = await request(app)
            .post('/patient/1/add_provider')
            .send(NoProviderWithID)
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(response.body.message).toBe(expectedMessage)
    })

    //There is patient in the database named Jeff Frank with patient_id = 1 and healthcare provider Bob Smith added 
    //who has provider_id = 100000. There is no provider with first name Billy.
    it('should not add provider if no provider has first name', async () => {
        const NoProviderWithID = {
            "patient_id": "1",
            "provider_id": "100000",
            "provider_first_name": "Billy", 
            "provider_last_name": "Smith"
        }   

        const expectedMessage = 'No healthcare provider found.'

        const response = await request(app)
            .post('/patient/1/add_provider')
            .send(NoProviderWithID)
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(response.body.message).toBe(expectedMessage)
    })

    //There is patient in the database named Jeff Frank with patient_id = 1 and healthcare provider Bob Smith added 
    //who has provider_id = 100000. There is no provider with last name Jones.
    it('should not add provider if no provider has last name', async () => {
        const NoProviderWithID = {
            "patient_id": "1",
            "provider_id": "100000",
            "provider_first_name": "Bob", 
            "provider_last_name": "Jones"
        }   

        const expectedMessage = 'No healthcare provider found.'

        const response = await request(app)
            .post('/patient/1/add_provider')
            .send(NoProviderWithID)
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(response.body.message).toBe(expectedMessage)
    })

    //There is patient in the database named Jeff Frank with patient_id = 1 and healthcare provider Bob Smith added 
    //who has provider_id = 100000. There is no provider with last name Jones.
    it('should not add provider if the provider has already been added to the patient account', async () => {
        const NoProviderWithID = {
            "patient_id": "1",
            "provider_id": "100000",
            "provider_first_name": "Bob", 
            "provider_last_name": "Smith"
        }   

        const expectedMessage = 'Healthcare provider Bob Smith has already been added.'

        const response = await request(app)
            .post('/patient/1/add_provider')
            .send(NoProviderWithID)
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(response.body.message).toBe(expectedMessage)
    })

    //There is patient in the database named Jeff Frank with patient_id = 1 and healthcare provider Bob Smith added 
    //who has provider_id = 100000. There is a healthcare proivder when name John Doe who has provider_id = 100001. 
    //Jeff Frank is not yet associated with John Doe.
    it('should add provider to patient portal if the provider ID exists and the first and last name are correct', async () => {
        const NoProviderWithID = {
            "patient_id": "1",
            "provider_id": "100001",
            "provider_first_name": "John", 
            "provider_last_name": "Doe"
        }   

        const passed = true

        const response = await request(app)
            .post('/patient/1/add_provider')
            .send(NoProviderWithID)
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(response.body.passed).toBe(passed)
    })
})

//npm test -- /addProvider.test.js          