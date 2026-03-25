//Add Medication JavaScript

//Forms that have information to add a new medication to a patient
var addMedicationForm = document.getElementById('add-med-form');




//when the form is submitted, calculate the end date, find the patient id, and add a new medication
if(addMedicationForm){
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

        //make startDate into new Date object
        var endDate = new Date(startDate);

        //calculates end date based on frequency and number of pills
        function calculateEndDate(frequency, totalPills){
            var days = totalPills / frequency;
            endDate = endDate.setDate(endDate.getDate() + days);
        }

        //call the end date function
        calculateEndDate(frequency, totalPills);

        async function findPatientId(patientFirstName, patientLastName){
            //fetch patient id using first and last name
            fetch('patient/getPatientId', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    patientFirstName: patientFirstName,
                    patientLastName: patientLastName
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.passed) {
                    patientId = data.patient_id
                } else {
                    console.log("No patient found with that name.")
                }
            }
            )
            .catch(error => {
                console.log("Error finding patient id:", error)
            })
        }

        //call function to find patient id
        var patientId = await findPatientId(patientFirstName, patientLastName)

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
                    start_date: startDate.value,
                    end_date: endDate.value,
                    frequency_hours: frequency.value,
                    total_pills: totalPills.value,
                    side_effects: sideEffects.value,
                    additional_notes: additionalNotes.value,
                    patient_id: patientId,
                    provider_id: 1

                })
            })
            var data = await response.json()

        }
        catch (error) {
            console.log("ERROR: Failed to submit, error from addMedication.js:", error);
        }
    })
}