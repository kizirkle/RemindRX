//imports

//This is the signup page. This should include a signup form and a login button, 
//and a return to home button
function SignUp(){
    return (
        <>
        {/*Insert html Here*/} 
            <h1>Create an Account</h1>
            <form class="login">
                <div>
                    <input type="radio" value="healthcare-provider" name="choice" id="radio-provider" required/> 
                    <label class="option" >Healthcare Provider</label>
                </div>
                <div>
                    <input type="radio" value="patient" name="choice" id="radio-patient"/> 
                    <label class="option" >Patient</label>
                </div>
                    <input id="first-name" placeholder="First Name" required/>
                    <input id="last-name" placeholder="Last Name" required/>
                    <input id="phone-number" placeholder="Phone Number" required/>
                    <input id="email" placeholder="Email" required/>
                    <input type="password" id="new-password" placeholder="Password"/>
                    <input type="password" placeholder="Confirm Password" id='confirmed-password' required/>
                    <div id="provider-id-field">
                        <input id="provider-id" placeholder="Provider ID" name="message"/>
                    </div>
                    <span id="message" style="display: none"></span>
                    <button type="submit" id="sign-up-btn">Sign Up</button>
                    <h3>Already have an account?</h3>
                </form>
                    <a type="button" href="/login" id="sign-up">
                    <button>Login</button>
                    </a>
            <script src="index.js"></script>
        </>
    )
}

export default SignUp