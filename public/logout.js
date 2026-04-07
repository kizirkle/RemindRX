//Logout Javascript

function logout() {
    //clear local storage
    localStorage.removeItem('provider_id');
    localStorage.removeItem('patient_id');
    sessionStorage.clear();
    window.location.href = '/'
}