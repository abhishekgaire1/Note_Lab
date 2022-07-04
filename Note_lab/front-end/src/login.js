import React from 'react';
import './App.css';



function Login({handleLoginSubmit,handleLoginEmail,handleLoginPassword,setSignup,loginError}){
    return  <div id="start-page">
        <div id="login-header">
        <h1>Notes</h1>
        <h3> Organise all your thoughts in one place</h3>
        </div>
    <div id="login-page">

        <form>
            <label htmlFor="login-email">Email</label><br/>
            <input type="email" id="login-email" name="login-email" onChange={handleLoginEmail}/><br/>
                <label htmlFor="login-password">Password</label><br/>
                <input type="password" id="login-password" name="login-password" onChange={handleLoginPassword}/><br/>
            { loginError!=='' &&  <section id="error">Error:Invalid email and/or password</section>}
            <br/> <button  type="submit" id="login-button" onClick={handleLoginSubmit} >Login</button>
        </form>
        <br/><hr/>
        <div id="login-footer">
        <button   id="login-new-account"  onClick={()=>{setSignup(true)}}>Create New Account</button>
        </div>
    </div>
    </div>



}

export default Login;