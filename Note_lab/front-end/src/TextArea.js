import React, {useState} from 'react';
import './App.css';
import axios from 'axios';

import {Notifications, PersonAddOutlined, DeleteOutline,ArrowBack} from '@material-ui/icons'
import Tags from "./Tags";


function TextArea({notes, deleteNote, activeNote, setActiveNote,updateNote,setBackClicked,getTime}){



    const whenChange=(key,value)=>{
        let a_note= {
            id: activeNote.id,
            [key]:value,
            time:getTime(),
            tags: activeNote.tags

        }
        updateNote(a_note)
        axios.put('/api/notes/'+a_note.id, {
            id:a_note.id,
            body:a_note.body,
            time:a_note.time,
            tags:a_note.tags

        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

if(!activeNote ) return<div className="preview_menu">
        <button className="material-icons" id="arrow_back" onClick={()=>
        {setBackClicked(true);
        console.log('back button')}}>arrow_back</button>

        <span className="material-icons"><Notifications/></span>

        <span className="material-icons"><PersonAddOutlined/></span>

        < button id="del-button"> <span className="material-icons" onClick={()=>deleteNote("00")}><DeleteOutline/></span></button>

    </div>






    return<div className="notes_preview">

            <div className="preview_menu">
                <span className="material-icons" id="arrow_back" onClick={()=>
                {setBackClicked(true);
                    console.log('back button')}}><ArrowBack/></span>
                <span className="material-icons"><Notifications/></span>

                <span className="material-icons"><PersonAddOutlined/></span>

                    < button id="del-button"> <span className="material-icons" onClick={()=>deleteNote(activeNote.id)}><DeleteOutline/></span></button>

            </div>




            <textarea type="text" id="text-area" className="notes_preview_body" value={activeNote.body}
                      onChange={(e) => whenChange("body", e.target.value)}/>


        </div>


}

export default TextArea;