const createAccountForm = document.getElementById('create-account-form')
const loginForm = document.getElementById('login-form')
const providerIDField = document.getElementById('hidden')
const firstName = document.getElementById('first-name')
const lastName = document.getElementById('last-name')
const phoneNumber = document.getElementById('phone-number')
const email = document.getElementById('email')
const newPassword = document.getElementById('new-password')
const confirmedPassword = document.getElementById('confirmed-password')
const loginBtn = document.getElementById('login-btn')
const createAccountBtn = document.getElementById('create-account-btn')
const result = document.getElementById('result')
const message = document.getElementById('message')
const radioPatientCreate = document.getElementById('radio-patient')
const radioProviderCreate = document.getElementById('radio-provider')
const providerIdField = document.getElementById("provider-id-field")

if(createAccountForm){
    createAccountForm.addEventListener("submit", async (event)=> {
        event.preventDefault()
        const type = document.querySelector('input[name="choice"]:checked').value
        try {
            const response = await fetch('/create_account', {
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
            const data = await response.json()

            reportMessage(data)
        }
        catch(error) {
            console.log("error")
        }
    })
}

if(loginForm) {
    loginForm.addEventListener("submit", async (event)=> {
        event.preventDefault()
        const type = document.querySelector('input[name="choice"]:checked').value
        try {
            const response = await fetch('/login', {
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
            const data = await response.json()

            reportMessage(data)
        }
        catch(error) {
            console.log("error")
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
    const errorMessage = sessionStorage.getItem('errorMessage')
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





