//Client side JavaScript

//Forms that have the information to create a new patient or provider and log them in 
var createAccountForm = document.getElementById('create-account-form')
var loginForm = document.getElementById('login-form')

//Radio fields to select if person logging in or creating an account is a provider or patient
var radioPatientCreate = document.getElementById('radio-patient')
var radioProviderCreate = document.getElementById('radio-provider')

//Information from form needed to create a new patient or provider and log them in 
var firstName = document.getElementById('first-name')
var lastName = document.getElementById('last-name')
var phoneNumber = document.getElementById('phone-number')
var email = document.getElementById('email')
var newPassword = document.getElementById('new-password')
var confirmedPassword = document.getElementById('confirmed-password')

//List of password requirements 
var length = document.getElementById('length')
var number = document.getElementById('number')
var lower = document.getElementById('lower')
var upper = document.getElementById('upper')
var special = document.getElementById('special')

//Password requirement list
var passwordList = document.getElementById('password-requirements-list')

//Hidden provider ID field that appears when provider radio button is chosen 
// var providerIdField = document.getElementById("provider-id-field")
// var providerId = document.getElementById("provider-id")

//Loging in/creating an account buttons
var loginBtn = document.getElementById('login-btn')
var createAccountBtn = document.getElementById('create-account-btn')

//Error message that is diplayed if log in or create account failed
var message = document.getElementById('message')

//Creating a new account
if(createAccountForm){
    createAccountForm.addEventListener("submit", async (event)=> {
        //Prevents the page from automatically reloading
        event.preventDefault()
        //Determine if the user selected patient or provider
        var type = document.querySelector('input[name="choice"]:checked').value
        try {
            //Attempts to create an account 
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
                confirmed_password: confirmedPassword.value//, 
                //provider_id: providerId.value
                })
            })

            //Gets the response from the API call which will either contain an error message or URL to personal portal
            var data = await response.json()

            //Calls function to either return an error or sends the patient or provider to their personal portal
            systemResponse(data, type)
        }
        catch(error) {
            console.log("ERROR: Failed to submit, error from index.js:", error);
        }
    })
}

if(loginForm) {
    loginForm.addEventListener("submit", async (event)=> {
        //Prevents the page from automatically reloading
        event.preventDefault()
        //Determine if the user selected patient or provider
        var type = document.querySelector('input[name="choice"]:checked').value
        try {
            //Attempts to log user in
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

            //Gets the response from the API call which will either contain an error message or URL to personal portal
            var data = await response.json()

            //Calls function to either return an error or sends the patient or provider to their personal portal
            systemResponse(data, type)
        }
        catch(error) {
            console.log("ERROR: failed to submit, error from index.js:", error);
        }
    })
}

//Returns an error or sends the patient or provider to their personal portal after attempting to log in or sign up 
function systemResponse(data, type) {
    //Changes the color of the passwords to red 

    if(!data.passed) {
        //If there was an error, report the given error and reload the current page
        //Stores the error message in session storge to be displayed when the page is reloaded
        sessionStorage.setItem('errorMessage', data.message)

        if(data.message === "Invalid password.") {
            passwordAlert(data)
        } else {
            sessionStorage.setItem("short", "false")
            sessionStorage.setItem("noNumber", "false")
            sessionStorage.setItem("noLower", "false")
            sessionStorage.setItem("noUpper", "false")
            sessionStorage.setItem("noSpecial", "false")
        }
        //Reloads the page
        location.reload()
    } else {
        //If there is not an error, send user to their personal portal 
        if(type === 'patient') {
            localStorage.setItem('patient_id', data.patient_id);
            window.location.href = data.patientPage
        } else {
            localStorage.setItem('provider_id', data.provider_id);
            window.location.href = data.providerPage
        }
    }
}

//Checks which password requirements were not satisfied 
function passwordAlert(data) {
    var passwordProblems = data.passwordProblems
    if (passwordProblems.includes("short")) {
        sessionStorage.setItem("short", "true")
    } else {
        sessionStorage.setItem("short", "true")
    }
    if (passwordProblems.includes("no number")) {
        sessionStorage.setItem("noNumber", "true")
    } else{
        sessionStorage.setItem("noNumber", "false")
    }
    if (passwordProblems.includes("no lowercase")) {
        sessionStorage.setItem("noLower", "true")
    } else {
        sessionStorage.setItem("noLower", "false")
    }
    if (passwordProblems.includes("no uppercase")) {
        sessionStorage.setItem("noUpper", "true")
    } else {
        sessionStorage.setItem("noUpper", "false")
    }
    if (passwordProblems.includes("no special character")) {
        sessionStorage.setItem("noSpecial", "true")
    } else {
        sessionStorage.setItem("noSpecial", "false")
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

    if (window.location.href.includes('create_account')) {
       //Determines which password requirements were satisfied or not
        var short = sessionStorage.getItem('short')
        var noNumber = sessionStorage.getItem('noNumber')
        var noLower = sessionStorage.getItem('noLower')
        var noUpper = sessionStorage.getItem('noUpper')
        var noSpecial = sessionStorage.getItem('noSpecial')

        //Changes color of list of password requirement to red if not satisfied
        if (short === "true") {
            length.style.color = "red"
        } else {
            length.style.color = "black"
        }
        if (noNumber === "true") {
            number.style.color = "red"
        } else {
            number.style.color = "black"
        }
        if (noLower === "true") {
            lower.style.color = "red"
        } else {
            lower.style.color = "black"
        } 
        if (noUpper === "true") {
            upper.style.color = "red"
        } else {
            upper.style.color = "black"
        }
        if (noSpecial === "true") {
            special.style.color = "red"
        } else {
            special.style.color = "black"
        }

        //Rermoves the error message from session storage after it has been reported 
        sessionStorage.removeItem('short');
        sessionStorage.removeItem('noNumber');
        sessionStorage.removeItem('noLower');
        sessionStorage.removeItem('noUpper');
        sessionStorage.removeItem('noSpecial');     
   }
   sessionStorage.removeItem('errorMessage');
}

//If the patient radio button is clicked when creating an account, add the proivder ID field
// if(radioPatientCreate) {
//     radioPatientCreate.addEventListener("change", ()=> {
//         providerIdField.style.display = "block"
//         providerId.required = true
//     })
// }

// //If the provider radio button is clicked when creating an account, hide the proivder ID field
// if(radioProviderCreate) {
//     radioProviderCreate.addEventListener("change", ()=> {
//         providerIdField.style.display = "none"
//         providerId.required = false
//     })
// }
