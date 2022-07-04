import React from 'react';
import './App.css';
import { Search, NoteAdd } from '@material-ui/icons'
import profile from "./images/profile.jpeg"

function SideMenu({notes, addNote,activeNote, setActiveNote,openModel, setModalOpen,setBackClicked,handleSearch,inputText,profile_url,similarNotes}){
    // if( notes.length>0){
    //     setActiveNote(notes[0].id)
    // }
    return<div className="notes_list">
            <div className="profile_menu">
                <button id="open_modal" onClick={ ()=>{setModalOpen(true)}}><img src={ profile_url} alt="profile" className="profile_img" /></button>




                <div className="title_name"><span>My Notes</span></div>
                <button id="add-button" onClick={addNote}><span className="material-icons "><NoteAdd/></span></button>
            </div>

            <div className="search_bar">
                <span className="material-icons"><Search/></span>
                <input id="search-bar" type="text" placeholder="Search all notes" onChange={handleSearch}/>
            </div>
            <div className="notes_list_items">
                <div id="items">


                {notes.map((note)=>(

                    <div className={`item ${(note.id===activeNote && 'active_note') || (similarNotes.includes(note.id) && 'similar_note')}`} key={note.id} id={note.id} onClick={()=> {
                        setActiveNote(note.id);
                        setBackClicked(false);

                    }}>
                    <div className="notes_list_body"  >{(note.body ||"New note")} </div>
                        <div id="timeSimilar">
                    <div className=" notes_list_time">{note.time}</div>
                        { (similarNotes.includes(note.id) && note.id!==activeNote  )&&  <div id="similar_note">similar</div>}
                        </div>

                    </div>


                ) )}


    </div>
            </div>


        </div>

}

export default SideMenu;