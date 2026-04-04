//Delete Patient Account Javascript 

var removeProviderForm = document.getElementById('remove-provider-form')


removeProviderForm.addEventListener("submit", async (event)=> {
    event.preventDefault()

    //Gets the ID of the patient
    var currentUrl = window.location.href;
    var urlSections = currentUrl.split('/')
    var patientId = urlSections[4]

    var providerId = document.querySelector('select[name="provider"]').value

    try {
        //Attempts to delete account
        var response = await fetch(`/patient/${patientId}/remove_provider/${providerId}`, {
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
         console.log("ERROR: failed to submit, error from removeProvider.js:", error);
    }
})