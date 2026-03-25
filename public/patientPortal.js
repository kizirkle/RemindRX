const patientName = document.getElementById('patient-name')



window.onload = function() {
    const urlName = window.location.pathname
    const urlSegments = urlName.split('/')
    const patientId = urlSegments[4]
    console.log(patientId)
}

