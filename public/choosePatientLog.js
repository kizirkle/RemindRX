//Choose Patient Log Javascript

var patientChoiceForm = document.getElementById("patient-selection-form")

//Navigates to patient log page when patient is chosen
patientChoiceForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const dropDown = document.getElementById("patient-select")
    const patientId = dropDown.value
    var patientLogPage = window.location.href + `/${patientId}`
    window.location.href = patientLogPage
})
