import React, {useState,useEffect} from 'react';
import './App.css';
import profile from './images/profile.jpeg'
import axios from 'axios';

function Modal( {modalOpen, setModalOpen,handleChangeFullName,handleChangeColor,handleChangeEmail,handleSubmit,fullName,email,colorScheme,handleLogout,handleImageSelected, profile_url,handleDeleteImage}){
console.log("profile###"+profile_url);
    return <div className='profile'>
        <div className="modal"  id="modal">
            <div className="modal_top">
                <span className="modal_title">Edit Profile</span>
                <button id="close_modal" onClick={ ()=>{setModalOpen(false)}}>x</button>
            </div>
            <div className="modal_menu">
                <img src={profile_url} alt="profile" className="profile_img"/>
                <label htmlFor="file-upload" className="custom-file-upload">
                    Add new Image
                </label>
                <input id="file-upload" type="file"  onChange={handleImageSelected}/>
                <button className="modal_remove_image" onClick={handleDeleteImage}>Remove image</button>

            </div>
            <div className="modal_body">
                <form id="my-form"  >
                    <label htmlFor="modal_name" > Name </label><br/>
                    <input type="text" id="modal_name" name="name" value={fullName} onChange={handleChangeFullName} /><br/> <br/>
                    <label htmlFor="modal_email" type="email">Email</label><br/>
                    <input type="text" id="modal_email" name="email" value={email} onChange={handleChangeEmail} /><br/><br/>
                    <label htmlFor="color_scheme">Color Scheme</label><br/>
                    <div id="color_scheme">
                        <select name="color_scheme" className='select_color' value={colorScheme} onChange={handleChangeColor}  >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>


                    </select>
                    </div>

                    <div className="modal_footer">
                        <button id="modal_save" type="submit"  onClick={handleSubmit}>Save</button>
                        <button id="modal_logout" onClick={handleLogout}>Logout</button>
                    </div>

                </form>
            </div>
        </div>


    </div>



}

export default Modal;