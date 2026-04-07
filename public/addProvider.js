//Add Provider JavaScript

//Form that has the information to connect patient to provider
var addProviderForm = document.getElementById("add-provider-form")

//Information from form needed to connect patient to provider
var providerId = document.getElementById("provider-id")
var providerFirstName = document.getElementById("provider-first-name")
var providerLastName = document.getElementById("provider-last-name")

//Error message that is diplayed if adding provider failed
var message = document.getElementById('message')

//Adds a new patient-provider association or returns error
addProviderForm.addEventListener("submit", async (event)=> {
    //Prevents the page from automatically reloading
    event.preventDefault()

    //Gets the ID of the patient
    var currentUrl = window.location.href;
    var urlSections = currentUrl.split('/')
    var patientId = urlSections[4]

    try {
        //Attempts to log user in
        var response = await fetch(`/patient/${patientId}/add_provider`, {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            patient_id: patientId,
            provider_id: providerId.value,
            provider_first_name: providerFirstName.value, 
            provider_last_name: providerLastName.value
            })
        })
        if(response.ok) {
            //Gets the response from the API call which will either contain an error message or URL to personal portal
            var data = await response.json()

            //Calls function to either return an error or sends the patient or provider to their personal portal
            systemResponse(data)
        }
    }
    catch(error) {
         console.log("ERROR: failed to submit, error from addProvider.js:", error);
    }
})

function systemResponse(data) {
    //Changes the color of the passwords to red 

    if(!data.passed) {
        //If there was an error, report the given error and reload the current page
        //Stores the error message in session storge to be displayed when the page is reloaded
        sessionStorage.setItem('errorMessage', data.message)

        location.reload()
    } else {
        //If there is not an error, send user to their patient portal 
        window.location.href = data.patientPage
    }
}

window.onload = function () {
    //Attempt to get the error message from session storage
    var errorMessage = sessionStorage.getItem('errorMessage')
    if (errorMessage) {
        //If there is an error, displays it
        message.textContent = errorMessage
        message.style.display = "block"
    }
    sessionStorage.removeItem('errorMessage');
}

