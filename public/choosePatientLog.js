var patientChoiceForm = document.getElementById("patient-selection-form")
patientChoiceForm.addEventListener("submit", () => {
    event.preventDefault()
    const dropDown = document.getElementById("patient-select")
    const patientId = dropDown.value
    var patientLogPage = window.location.href + `/${patientId}`
    window.location.href = patientLogPage
})
