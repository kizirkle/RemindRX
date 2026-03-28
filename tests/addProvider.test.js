import request from 'supertest'
import app from '../app'


describe('POST /patient/:id/addProvider', () => {

    // Default data to use for generic test function ("correct" values are the default)
    const defaultData = {
        "patient_id": "100000",
        "provider_id": "100000",
        "provider_first_name": "Bob", 
        "provider_last_name": "Smith"
    }

    // Default expectation data (Some are empty and should be overwritten when creating the test)
    const defaultExpectations = {
        "message": undefined,
        "passed": undefined,
        "statusCode": 200,
    }

    // Generic test function for easier reuse and concise tests
    function createAddProviderTest(patientOverrides = {}, expectOverrides = {}){
        return async () => {
            const ProviderData = {
                ...defaultData,
                ...patientOverrides
            }

            const Expectations = {
                ...defaultExpectations,
                ...expectOverrides
            }

            const response = await request(app)
                .post('/patient/1/add_provider')
                .send(ProviderData)
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

    it("Should not add provider if the ID does not exist", createAddProviderTest({
        provider_id: "555555"
    }, {
        message: "No healthcare provider found."
    }))

    // //There is patient in the database named Jeff Frank with patient_id = 100000 and healthcare provider Bob Smith added 
    // //who has provider_id = 100000. There is no provider with ID 555555.
    // it('should not add provider if the ID does not exist', async () => {
    //     const NoProviderWithID = {
    //         "patient_id": "100000",
    //         "provider_id": "555555",
    //         "provider_first_name": "Bob", 
    //         "provider_last_name": "Smith"
    //     }  

    //     const expectedMessage = 'No healthcare provider found.'

    //     const response = await request(app)
    //         .post('/patient/1/add_provider')
    //         .send(NoProviderWithID)
    //         .expect('Content-Type', /json/)
    //         .expect(200);
        
    //     expect(response.body.message).toBe(expectedMessage)
    // })

    it("Should not add provider if no provider has first name", createAddProviderTest({
        provider_first_name: "Billy"
    }, {
        message: "No healthcare provider found."
    }))

    // //There is patient in the database named Jeff Frank with patient_id = 100000 and healthcare provider Bob Smith added 
    // //who has provider_id = 100000. There is no provider with first name Billy.
    // it('should not add provider if no provider has first name', async () => {
    //     const NoProviderWithID = {
    //         "patient_id": "100000",
    //         "provider_id": "100000",
    //         "provider_first_name": "Billy", 
    //         "provider_last_name": "Smith"
    //     }   

    //     const expectedMessage = 'No healthcare provider found.'

    //     const response = await request(app)
    //         .post('/patient/1/add_provider')
    //         .send(NoProviderWithID)
    //         .expect('Content-Type', /json/)
    //         .expect(200);
        
    //     expect(response.body.message).toBe(expectedMessage)
    // })

    it("Should not add provider if no provider has last name", createAddProviderTest({
        provider_last_name: "Jones"
    }, {
        message: "No healthcare provider found."
    }))

    // //There is patient in the database named Jeff Frank with patient_id = 100000 and healthcare provider Bob Smith added 
    // //who has provider_id = 100000. There is no provider with last name Jones.
    // it('should not add provider if no provider has last name', async () => {
    //     const NoProviderWithID = {
    //         "patient_id": "100000",
    //         "provider_id": "100000",
    //         "provider_first_name": "Bob", 
    //         "provider_last_name": "Jones"
    //     }   

    //     const expectedMessage = 'No healthcare provider found.'

    //     const response = await request(app)
    //         .post('/patient/1/add_provider')
    //         .send(NoProviderWithID)
    //         .expect('Content-Type', /json/)
    //         .expect(200);
        
    //     expect(response.body.message).toBe(expectedMessage)
    // })

    it("Should not add provider if the provider has already been added to the patient account", createAddProviderTest({}, {
        message: "Healthcare provider Bob Smith has already been added."
    }))

    // //There is patient in the database named Jeff Frank with patient_id = 100000 and healthcare provider Bob Smith added 
    // //who has provider_id = 100000. 
    // it('should not add provider if the provider has already been added to the patient account', async () => {
    //     const NoProviderWithID = {
    //         "patient_id": "100000",
    //         "provider_id": "100000",
    //         "provider_first_name": "Bob", 
    //         "provider_last_name": "Smith"
    //     }   

    //     const expectedMessage = 'Healthcare provider Bob Smith has already been added.'

    //     const response = await request(app)
    //         .post('/patient/1/add_provider')
    //         .send(NoProviderWithID)
    //         .expect('Content-Type', /json/)
    //         .expect(200);
        
    //     expect(response.body.message).toBe(expectedMessage)
    // })

    it("Should add provider to patient portal if the provider ID exists and the first and last name are correct", createAddProviderTest({
        provider_id: "100001",
        provider_first_name: "John",
        provider_last_name: "Doe"
    }, {
        passed: true
    }))

    // //There is patient in the database named Jeff Frank with patient_id = 100000 and healthcare provider Bob Smith added 
    // //who has provider_id = 100000. There is a healthcare proivder when name John Doe who has provider_id = 100001. 
    // //Jeff Frank is not yet associated with John Doe.
    // it('should add provider to patient portal if the provider ID exists and the first and last name are correct', async () => {
    //     const NoProviderWithID = {
    //         "patient_id": "100000",
    //         "provider_id": "100001",
    //         "provider_first_name": "John", 
    //         "provider_last_name": "Doe"
    //     }   

    //     const passed = true

    //     const response = await request(app)
    //         .post('/patient/1/add_provider')
    //         .send(NoProviderWithID)
    //         .expect('Content-Type', /json/)
    //         .expect(200);
        
    //     expect(response.body.passed).toBe(passed)
    // })
})

//npm test -- /addProvider.test.js          