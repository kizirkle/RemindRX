//imports

//This should be the default page. It should include a login and a signup button.
function Home(){
    return (
        <>
        {/*Insert html Here*/} 
            <h1>RemindRx</h1>
            <button onclick="window.location.href='/login'" id="login-btn">Login</button>
            <button onclick="window.location.href='/create_account'" id="login-btn">Create an Account</button>
        </>
    )
}

export default Home