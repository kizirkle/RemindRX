//Delete Patient Account Javascript 

var removePatientForm = document.getElementById('remove-patient-form')


removePatientForm.addEventListener("submit", async (event)=> {
    event.preventDefault()

    //Gets the ID of the patient
    var currentUrl = window.location.href;
    var urlSections = currentUrl.split('/')
    var providerId = urlSections[4]

    var patientId = document.querySelector('select[name="patient"]').value

    try {
        //Attempts to delete account
        var response = await fetch(`/provider/${providerId}/remove_patient/${patientId}`, {
            method: "DELETE", 
            headers: {
                'Content-Type': 'application/json' 
            }
        })
        if (response.ok) {
            const data = await response.json()
            window.location.href = data.redirect
        }
    }
    catch(error) {
         console.log("ERROR: failed to submit, error from removePatient.js:", error);
    }
})