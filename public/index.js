var createAccountForm = document.getElementById('create-account-form')
var loginForm = document.getElementById('login-form')
var providerIDField = document.getElementById('hidden')
var firstName = document.getElementById('first-name')
var lastName = document.getElementById('last-name')
var phoneNumber = document.getElementById('phone-number')
var email = document.getElementById('email')
var newPassword = document.getElementById('new-password')
var confirmedPassword = document.getElementById('confirmed-password')
var loginBtn = document.getElementById('login-btn')
var createAccountBtn = document.getElementById('create-account-btn')
var result = document.getElementById('result')
var message = document.getElementById('message')
var radioPatientCreate = document.getElementById('radio-patient')
var radioProviderCreate = document.getElementById('radio-provider')
var providerIdField = document.getElementById("provider-id-field")

if(createAccountForm){
    createAccountForm.addEventListener("submit", async (event)=> {
        event.preventDefault()
        var type = document.querySelector('input[name="choice"]:checked').value
        try {
            var response = await fetch('/create_account', {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                choice: type, 
                first_name: firstName.value,
                last_name: lastName.value,
                phone_number: phoneNumber.value, 
                email: email.value,
                password: newPassword.value,
                confirmed_password: confirmedPassword.value
                })
            })
            var data = await response.json()

            reportMessage(data)
        }
        catch(error) {
            console.log("ERROR: Failed to submit, error from index.js:", error);
        }
    })
}

if(loginForm) {
    loginForm.addEventListener("submit", async (event)=> {
        event.preventDefault()
        var type = document.querySelector('input[name="choice"]:checked').value
        try {
            var response = await fetch('/login', {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                choice: type, 
                entered_email: email.value,
                entered_password: password.value,
                })
            })
            var data = await response.json()

            reportMessage(data)
        }
        catch(error) {
            console.log("ERROR: failed to submit, error from index.js:", error);
        }
        })
}

function reportMessage(data) {
    if(!data.passed) {
        sessionStorage.setItem('errorMessage', data.message)
        location.reload()
    } else {
        window.location.href = "/login"
    }
}

// function reportMessage(data) {
//     message.textContent = data.message
//     message.style.display = "block"
//     if(!data.passed) {
//         message.style.color = "red"
//     } else {
//         message.style.color = "green"
//     }
// }

window.onload = function () {
    console.log("here")
    var errorMessage = sessionStorage.getItem('errorMessage')
    if (errorMessage) {
        message.textContent = errorMessage
        message.style.display = "block"
    }
    sessionStorage.removeItem('errorMessage');
}

if(radioPatientCreate) {
    radioPatientCreate.addEventListener("change", ()=> {
    providerIdField.style.display = "block"
    providerIdField.setAttribute('required', '')
    })
}

if(radioProviderCreate) {
    radioProviderCreate.addEventListener("change", ()=> {
    providerIdField.style.display = "none"
    providerIdField.removeAttribute('required');
    })
}





