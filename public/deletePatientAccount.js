//Delete Patient Account Javascript 

var deleteAccountBtn = document.getElementById('delete-account-btn')


deleteAccountBtn.addEventListener("click", async ()=> {
    //Gets the ID of the patient
    var currentUrl = window.location.href;
    var urlSections = currentUrl.split('/')
    var patientId = urlSections[4]

    try {
        //Attempts to delete account
        var response = await fetch(`/patient/${patientId}/delete_account`, {
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
         console.log("ERROR: failed to submit, error from deletePatientAccount.js:", error);
    }
})