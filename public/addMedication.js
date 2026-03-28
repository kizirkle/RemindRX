//Add Medication JavaScript

//Forms that have information to add a new medication to a patient
var addMedicationForm = document.getElementById('add-med-form');




//when the form is submitted, calculate the end date, find the patient id, and add a new medication
addMedicationForm.addEventListener("submit", async (event) => {
    //Prevents the page from automatically reloading
    event.preventDefault()

    //Info from form needed to make a new medication
    var medicationName = document.getElementById('medication-name')
    var dose = Number(document.getElementById('dose').value);
    var startDateValue = document.getElementById("start-date").value;
    var startDate = startDateValue ? new Date(startDateValue) : null;
    var frequency = Number(document.getElementById('frequency').value);
    var totalPills = Number(document.getElementById('total-pills').value);
    var sideEffects = document.getElementById('side-effects')
    var additionalNotes = document.getElementById('additional-notes')
    var patientFirstName = document.getElementById('patient-first-name').value;
    var patientLastName = document.getElementById('patient-last-name').value;
    var patientId = document.getElementById('patient-id')

    //make startDate into new Date object
    var endDate = new Date(startDate);

    //calculates end date based on frequency and number of pills
    function calculateEndDate(frequency, totalPills){
        var days = totalPills / frequency;
        endDate.setDate(endDate.getDate() + days);
    }

    //call the end date function
    calculateEndDate(frequency, totalPills);

    // async function findPatientId(patientFirstName, patientLastName){
    //     //fetch patient id using first and last name
    //     try{
    //         var response = await fetch('/patient/getPatientId', {
    //             method: "POST",
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 patientFirstName: patientFirstName,
    //                 patientLastName: patientLastName
    //             })
    //         })
    //         var data = await response.json();
    //         console.log(data)
        
    //         if (data.passed) {
    //             return data.patient_id;
    //         } else {
    //             console.log("No patient found with that name.")
    //             return null;
    //         }
    //     } catch (error) {
    //         console.log("Error finding patient id:", error);
    //         return null;
    //     }
        
        
    // }

    // //call function to find patient id
    // var patientId = await findPatientId(patientFirstName, patientLastName)

    try {
        //tries to add a new medication!
        var response = await fetch('/addMedication', {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prescription_name: medicationName.value,
                dose: dose,
                start_date: startDateValue,
                end_date: endDate.toISOString().split('T')[0],
                frequency_hours: frequency,
                total_pills: totalPills,
                side_effects: sideEffects.value,
                additional_notes: additionalNotes.value,
                patient_first_name: patientFirstName, 
                patient_last_name: patientLastName,
                patient_id: patientId.value,
                provider_id: localStorage.getItem('provider_id')
            })
        })
        var data = await response.json()
        console.log(patientId.value)
        console.log(localStorage.getItem('provider_id'))
        systemResponse(data, "provider")
    }
    catch (error) {
        console.log("ERROR: Failed to submit, error from addMedication.js:", error);
    }
})

//returns an error or returns to provider page!
function systemResponse(data, type) {
    //Changes the color of the passwords to red 

    if(!data.passed) {
        //If there was an error, report the given error and reload the current page
        //Stores the error message in session storge to be displayed when the page is reloaded
        sessionStorage.setItem('errorMessage', data.message)
        //Reloads the page
        location.reload()
    } else {
        //If there is not an error, send user to their personal portal 
        window.location.href = `/provider/${localStorage.getItem('provider_id')}`
    }
}

//Each time the page is reloaded, report the error from the previous log in or sign up attempt if one exists
window.onload = function () {
    //Attempt to get the error message from session storage
    var errorMessage = sessionStorage.getItem('errorMessage')
    if (errorMessage) {
        //If there is an error, displays it
        message.textContent = errorMessage
        message.style.display = "block"
    }
    //Clears the error message from session storage so that it does not persist on future reloads
    sessionStorage.removeItem('errorMessage')
}