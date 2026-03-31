//Form that has the information to connect patient to provider
var addProviderForm = document.getElementById("log-intake-form")

//Gets the prescription ID of selected medication
var medicationSelect = document.getElementById("medication-select")
var prescriptionId = ""
medicationSelect.addEventListener("change", (event) => {
    prescriptionId = event.target.value
})

//Radiobuttons to indicate status
var radioTaken = document.getElementById("radio-taken")
var radioMissed = document.getElementById("radio-missed")

//Information to be diplayed if taken
var intakeDate = document.getElementById("intake-date")
var intakeTime = document.getElementById("intake-time")

//Information needed to submit
var intakeDate = document.getElementById('intake-date')
var intakeTime = document.getElementById('intake-time')
var additionalNotes = document.getElementById('additional-notes')

//Error message that is diplayed if log intake failed
var message = document.getElementById('message')

//Requires the time and date fields to be filled out when medication was taken
radioTaken.addEventListener("change", ()=> {
    intakeDate.style.display = "block"
    intakeDate.required = true
    intakeTime.style.display = "block"
    intakeTime.required = true
})

//Hides the time and date fields when medication was not taken
radioMissed.addEventListener("change", ()=> {
    intakeDate.style.display = "none"
    intakeDate.required = false
    intakeTime.style.display = "none"
    intakeTime.required = false
})


addProviderForm.addEventListener("submit", async (event)=> {
    //Prevents the page from automatically reloading
    event.preventDefault()

    //Gets the ID of the patient
    var currentUrl = window.location.href;
    var urlSections = currentUrl.split('/')
    var patientId = urlSections[4]

    //Checks if the medication was taken or missed
    var medStatus = document.querySelector('input[name="status"]:checked').value

    try {
        //Attempts to log user in
        var response = await fetch(`/patient/${patientId}/log`, {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            status: medStatus,
            intake_date: intakeDate.value,
            intake_time: intakeTime.value, 
            additional_notes: additionalNotes.value,
            patient_id: patientId,
            prescription_id: prescriptionId
            })
        })

        //Gets the response from the API call which will either contain an error message or URL to personal portal
        var data = await response.json()

        //Calls function to either return an error or sends the patient or provider to their personal portal
        systemResponse(data)
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
