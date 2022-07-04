import React from 'react';
import './App.css';



function Signup({handleSignup, handleChangeFullName,handleChangeEmail,handleChangePassword, setSignup,signupError}){
    return  <div id="start-page">

        <div id="signup-page">
            <div id="signup-header">
                <section id="signup-label">Sign Up</section>
                <section onClick={()=>{setSignup(false)}}>X</section>
            </div>
            <br/>
            <form>
                <label htmlFor="signup-name">Name</label><br/>
                <input type="text" id="signup-name" name="signup-name" onChange={handleChangeFullName}/><br/>
                <label htmlFor="signup-email">Email</label><br/>
                <input type="email" id="signup-email" name="signup-email" onChange={handleChangeEmail}/><br/>
                <label htmlFor="signup-password">Password</label><br/>
                <input type="password" id="signup-password" name="signup-password" onChange={handleChangePassword}/><br/>
                { signupError!=='' &&  <section id="error">Error:Invalid Name and/or email and/or password </section>}<br/>
                <div id="login-footer">
                <button  type="submit" id="signup-button" onClick={handleSignup} >Sign Up</button>
                </div>
            </form>


        </div>
    </div>



}

export default Signup;