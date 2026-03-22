//imports

//This is the login page. It should include a login form, a signup button, 
//and a return to home button
function Login(){
    return (
        <>
        {/*Insert html Here*/} 
            <h1>RemindRx Login</h1>
            <form class="login" id="login-form">
                <input placeholder="Enter email" id="email" required/>
                <input type="password" placeholder="Enter password" id="password" required/>
                <a id="forgot-password" href="/forgotPassword.html">Forgot your password?</a>
            <h2>Select</h2>
            <div>
                <input type="radio" name="choice" value='healthcare-provider' id="healthcare-provider" required/> 
                <label class="option" >Healthcare Provider</label>
            </div>
            <div>
                <input type="radio" name="choice" value='patient' id="patient"/> 
                <label class="option" >Patient</label>
            </div>
            <span id="message" style="display: none"></span>
            <button type="submit">Log in</button>
            <h3>Don't have an account?</h3>
            </form>
                <a href="/create_account" id="sign-up">
                    <button type="button">Sign up</button>
                </a>
        
            <script src="index.js"></script>
        </>
    )
}

export default Login