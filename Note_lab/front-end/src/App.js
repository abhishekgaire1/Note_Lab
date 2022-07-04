import './App.css';
import {useMediaQuery} from 'react-responsive'
import React, {useEffect, useLayoutEffect, useState} from "react";

import TextArea from "./TextArea";
import SideMenu from "./SideMenu";
import Modal from "./Modal";
import Login from "./login"
import Tags from "./Tags";
import Signup from "./Signup";
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';
import { uploadImageToCloudinaryAPIMethod} from "./client";
import {determineRelatednessOfSentences, loadModel} from "./universalSentenceEncoder";


loadModel()
function App() {



    const getTime = () => {
        let today = new Date;
        let hours = today.getHours();
        let a = today.getUTCMonth()
        let b = a + 1;
        let ampm = hours >= 12 ? ' pm' : ' am';
        if (hours > 12) {
            hours = hours - 12;
        }


        let final = today.getDate() + "/" + b + "/" + today.getFullYear() + ", " + hours + ':' + today.getMinutes() + ':' + today.getSeconds() + ampm

        return final;
    }





//
//
// useEffect(()=>{
//     axios.get('api/notes')
//         .then((response) => {
//             setdbNotes(response.data)
//             console.log("i am here");
//         })
//         .catch((error)=> {
//             // handle error
//             console.log(error);
//         })
//
// },[])


    const [notes, setNotes] = useState([{
        id: 1650371618559,
        body: "CSE 316",
        time: "19/4/2022, 9:34:32 pm",
        agent: "6278ce261f9b45a3b508f1e8",
        tags: [{id: 'USA', text: 'USA'},
            {id: 'japan', text: 'japan'},]
    }] || null)
    const [activeNote, setActiveNote] = useState(notes.length>0 && notes[0].id || null);
    const [modalOpen, setModalOpen] = useState(false);
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [colorScheme, setColorScheme] = useState("")
    const [password, setPassword] = useState("")

    const [backClicked, setBackClicked] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [logged, setLogged] = useState(false);
    const [signup,setSignup]=useState(false);
    const [loginEmail, setLoginEmail]=useState("")
    const [loginPassword, setLoginPassword]=useState("")
    const [agent, setAgent]=useState("")
    const [concat, setConcat]=useState(true);
    const [loginError, setLoginError]=useState('');
    const [openTags,setOpenTags]=useState(false);
    const [currentUser, setCurrentUser]=useState('');
    const [profile_url,setProfile_url]=useState('http://res.cloudinary.com/abhishekgaire/image/upload/v1652121601/rzfrtvnxr7syf5yecshs.jpg')
    const [similarNotes,setSimilarNotes ]= useState([]);
    const [signupError, setSignupError]=useState("");



    useEffect(() => {

        axios.get('api/notes')
            .then((response) => {
                console.log(response.data)
                console.log("i am here :");
                //console.log(response.data)
                let newNote = notes.concat(response.data)
                setNotes(response.data.sort((firstItem, secondItem) => secondItem.id - firstItem.id))
                setOpenTags(false)
                notes[0]&&setActiveNote(notes[0].id)



            })
            .catch((error) => {
                // handle error
                console.log(error);
            })




    }, [])
    console.log(notes)
    useEffect(() => {


        if (notes.length < 1) {
            setActiveNote(null);
        }


    }, [notes])


    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleChangeFullName = (e) => {
        setFullName(e.target.value);
    }

    const handleChangeColor = (e) => {
        setColorScheme(e.target.value);
    }
    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }
    const handleLoginEmail=(e)=>{
        setLoginEmail(e.target.value)
    }
    const handleLoginPassword=(e)=>{
        setLoginPassword(e.target.value)
    }

    let updatedUser= {id:agent,name:fullName, colorScheme:colorScheme, email:email ,profile_url:profile_url}
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('im inside handlesubmit')

        axios.put('/api/users/'+agent, updatedUser)
            .then((response) => {
                console.log(response);
            }, (error) => {
                console.log(error);
            });
        setModalOpen(false)
    }


    function useWindowSize() {
        const [size, setSize] = useState([0, 0]);
        useLayoutEffect(() => {
            function updateSize() {
                setSize([window.innerWidth, window.innerHeight]);
            }

            window.addEventListener('resize', updateSize);
            updateSize();
            return () => window.removeEventListener('resize', updateSize);
        }, []);
        return size;
    }

    let newUser = {name: fullName, email: email, colorScheme: colorScheme, password: password}
    const handleSignup=(e)=>{
        setSignupError("");
        e.preventDefault();
        addUser();

        signupError===""&& setSignup(false);
    }
    const addUser = () => {

        axios.post('/register', newUser)
            .then((response) => {
                console.log(response);
            }, (error) => {
                console.log(error);
                setSignupError(error);
            });
    }


    const addNote = () => {
        const newNote = {
            id: Date.now(),
            body: "",
            time: getTime(),
            tags: [{id: 'hello', text: 'hello'}],

        }

        setOpenTags(false)

        setNotes([newNote, ...notes])
        setOpenTags(true)
        setTags(newNote.tags)
        axios.post('/api/notes/', newNote)
            .then((response) => {
                console.log(response);
            }, (error) => {
                console.log(error);
            });

        setActiveNote(newNote.id);
        setIsEmpty(false)
        setInputText("")
    }


    const deleteNote = (idGiven) => {
        axios.delete('/api/notes/' + idGiven)
            .then(function (response) {
                // handle success
                console.log(response);
            })

        if (notes.length==1) {
            setOpenTags(false)
            setNotes([])
            setActiveNote(null)




        } else if (notes[1] && activeNote === notes[0].id){

            setNotes(notes.filter((note) => note.id !== idGiven))

            setActiveNote(notes[1].id)
        } else {
            setNotes(notes.filter((note) => note.id !== idGiven))

            setActiveNote(notes[0].id)
        }

    }

    const updateNote = (changedNote) => {
        const updatedArray = notes.map((note) => {
            if (note.id === activeNote) {
                return changedNote
            }
            return note;
        })
        setSimilarNotes([])
        setNotes(updatedArray);

    }
    const getActiveNote = () => {
        if (activeNote != null) {
            return notes.find((note) => note.id === activeNote)
        }
    }


    // const checkActiveNote=()=>{
    //     if (!activeNote && notes.length>0 ){
    //         setActiveNote(notes[0].id)
    //     }
    //     else if (!activeNote && notes.length<1){
    //         setActiveNote('000')
    //     }
    // }
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        loginUser();

    }

    let  loginData= {email:loginEmail,password:loginPassword}
    var loginUser=()=>{

        console.log('inside login')
        axios.post('/login', loginData)
            .then((response) => {
                //console.log('agent=== '+response.data.agent);
                setAgent(response.data.agent )
                if (agent===response.data.agent){setConcat(false)}
                setLogged(true);
                //setCurrentUser(response.data.user)
                setCurrentUser(response.data.userId)


                setEmail(response.data.email);
                setFullName(response.data.name);
                setColorScheme(response.data.colorScheme)
                setProfile_url(response.data.profile_url)

                console.log("profile===="+response.data.profile_url)
                notes.map(note=>{console.log(note.agent==response.data.agent)})
                console.log('response'+response.data.agent)

                        axios.get('api/notes')
                            .then((response) => {

                                console.log(response.data)
                                console.log("i am here :");
                                //console.log(response.data)
                                // let currentNotes = notes;
                                // let newNote = notes[0].concat(response.data.filter(ar => !currentNotes.find(rm => (rm.id === ar.id))))
                                // setNotes(newNote.sort((firstItem, secondItem) => secondItem.id - firstItem.id))
                                // // let veryNewNote = notes.filter(notes => !currentNotes.find(prevNotes => (prevNotes.id === notes.id)))
                                // // setNotes(veryNewNote)
                                setOpenTags(false)
                                setNotes(response.data.sort((firstItem, secondItem) => secondItem.id - firstItem.id))

                                setActiveNote(response.data[0].id);
                                (activeNote!=null)&&setOpenTags(true);
                                setTags(response.data[0].tags)



                            })
                            .catch((error) => {
                                // handle error

                                console.log(error);


                            })


            }, (error) => {
                console.log('this is error')
                console.log(error);
                setLoginError(error);

            });

    }

    const handleLogout=(e)=>{
        e.preventDefault();
        logoutUser();
        setActiveNote(notes[0])
    }

    var logoutUser=()=>{
        setOpenTags(false)
        axios.post('/logout', loginData)
            .then((response) => {
                console.log(response.data);
                setLogged(false);
                setModalOpen(false);
                setConcat(true)

            }, (error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        if(activeNote===null){
            setOpenTags(false)
        }


        openTags && setTags(getActiveNote().tags)
        handleSimilarNotes();

    }, [activeNote]);




    console.log('activeNote' + activeNote)
    const [tags, setTags] = useState(  [{id: 'USA', text: 'USA'}, {id: 'japan', text: 'japan'},] );


    const handleDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i));
        getActiveNote().tags = getActiveNote().tags.filter((tag, index) => index !== i);
        axios.put('/api/notes/' + activeNote, getActiveNote())
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleAddition = (tag) => {
        setTags([...tags, tag]);
        getActiveNote().tags.push(tag);

        axios.put('/api/notes/' + activeNote, getActiveNote())
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = [...tags].slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        setTags(newTags);
        getActiveNote().tags = newTags;
        axios.put('/api/notes/' + activeNote, getActiveNote())
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };


    const handleTagClick = (index) => {
        console.log("The tag at index " + index + " was clicked");
    };

    const onClearAll = () => {
        setTags([]);
    };

    const onTagUpdate = (i, newTag) => {
        const updatedTags = tags.slice();
        updatedTags.splice(i, 1, newTag);
        setTags(updatedTags);
        getActiveNote().tags = updatedTags;
    };

    const [inputText, setInputText] = useState("");
    let handleSearch = (e) => {

        var lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);


    };
    //image upload


    const handleImageSelected = (event) => {
        console.log("New File Selected");
        if (event.target.files && event.target.files[0]) {

            // Could also do additional error checking on the file type, if we wanted
            // to only allow certain types of files.
            const selectedFile = event.target.files[0];
            console.dir(selectedFile);

            const formData = new FormData();
            // TODO: You need to create an "unsigned" upload preset on your Cloudinary account
            // Then enter the text for that here.
            const unsignedUploadPreset = 'ngrdnw4p'
            formData.append('file', selectedFile);
            formData.append('upload_preset', unsignedUploadPreset);

            console.log("Cloudinary upload");
            uploadImageToCloudinaryAPIMethod(formData).then((response) => {
                console.log("Upload success");
                console.dir(response);
                setProfile_url(response.url)
                // Now the URL gets saved to the author
                // const updatedUser = {"name":fullName, "email":email, "colorScheme":colorScheme, "profile_url": response.url};
                // axios.put('/api/users/'+agent, updatedUser)
                //     .then((response) => {
                //         console.log(response);
                //     }, (error) => {
                //         console.log(error);
                //     });




                // Now we want to make sure this is updated on the server – either the
                // user needs to click the submit button, or we could trigger the server call here
            });
        }
    }

    const handleDeleteImage=(e)=>{
        e.preventDefault();
        setProfile_url('http://res.cloudinary.com/abhishekgaire/image/upload/v1652121601/rzfrtvnxr7syf5yecshs.jpg')

    }

    const handleSimilarNotes=()=>{


        let ind= notes.findIndex(note=>note.id===activeNote)
        const bodyArray = notes.map((note) => {

            return note.body;
        })
        console.log(bodyArray, ind)

        determineRelatednessOfSentences(bodyArray,ind)
            .then(r => {console.log(r);

        const similar= r.map((data) => {
            if(data.score>=0.5){
                return notes[data.indexOne].id
            }})
                setSimilarNotes(similar)
            }
            )
            .catch(e=> console.log(e))

    }

    const smallDevice = useMediaQuery(
        {maxDeviceWidth: 500}
    )


        if (useWindowSize()[0] < 500) {


            if (modalOpen) {
                return <Modal
                    setModalOpen={setModalOpen}
                    handleChangeEmail={handleChangeEmail}
                    handleChangeFullName={handleChangeFullName}
                    handleChangeColor={handleChangeColor}
                    handleSubmit={handleSubmit}
                    name={fullName}
                    email={email}
                    colorScheme={colorScheme}
                    currentUser={currentUser}
                    handleImageSelected ={handleImageSelected}
                    profile_url={profile_url}
                    handleDeleteImage={handleDeleteImage}
                />
            }


            if (!modalOpen && backClicked) {
                console.log('modal not open and button clicked')

                return <>

                    {logged &&<SideMenu
                        notes={(notes.filter((note) => note.body.toLowerCase().includes(inputText))).sort((firstItem, secondItem) => firstItem.id - secondItem.id)}
                        addNote={addNote}
                        activeNote={activeNote}
                        setActiveNote={setActiveNote}
                        setModalOpen={setModalOpen}
                        setBackClicked={setBackClicked}
                        handleSearch={handleSearch}
                        inputText={inputText}
                        profile_url={profile_url}
                        similarNotes={similarNotes}

                    />
                    }
                    {!signup && !logged &&  <Login

                        handleLoginEmail={handleLoginEmail}
                        handleLoginPassword={handleLoginPassword}
                        handleLoginSubmit={handleLoginSubmit}
                        setSignup={setSignup}
                    />}
                    { signup &&
                        <Signup
                            addUser={addUser}
                            handleChangeFullName={handleChangeFullName}
                            handleChangeEmail={handleChangeEmail}
                            handleChangePassword={handleChangePassword}
                            setSignup={setSignup}

                        />
                    }
                    </>

            } else {
                return <>
                    {!signup && !logged &&  <Login

                        handleLoginEmail={handleLoginEmail}
                        handleLoginPassword={handleLoginPassword}
                        handleLoginSubmit={handleLoginSubmit}
                        setSignup={setSignup}
                        loginError={loginError}
                    />}
                    { signup &&
                        <Signup
                            handleSignup={handleSignup}
                            handleChangeFullName={handleChangeFullName}
                            handleChangeEmail={handleChangeEmail}
                            handleChangePassword={handleChangePassword}
                            setSignup={setSignup}
                            signupError={signupError}

                        />
                    }

                    {logged && <div className="textarea-tags">

                        <TextArea notes={notes}
                                  deleteNote={deleteNote}
                                  activeNote={getActiveNote()}
                                  setActiveNote={setActiveNote}
                                  updateNote={updateNote}
                                  setBackClicked={setBackClicked}
                                  getTime={getTime}


                        />
                        {activeNote != null &&
                            <div className="tag">
                            <ReactTags
                                tags={tags}
                                onTagUpdate={onTagUpdate}
                                handleDelete={handleDelete}
                                handleAddition={handleAddition}
                                handleDrag={handleDrag}
                                placeholder="Enter a tag"
                                minQueryLength={2}
                                maxLength={20}
                                autofocus={false}
                                allowDeleteFromEmptyInput={true}
                                autocomplete={true}
                                readOnly={false}
                                allowUnique={true}
                                allowDragDrop={true}
                                inline={true}
                                allowAdditionFromPaste={true}
                                editable={true}
                                clearAll={false}


                            />

                        </div>
                        }
                    </div>
                    }
                </>

            }
        }

        return (
            <>
            {logged &&  <div className="notes">


                <SideMenu notes={(notes.filter((note) => (note.body.toLowerCase().includes(inputText)   )))}
                          addNote={addNote}
                          activeNote={activeNote}
                          setActiveNote={setActiveNote}
                          setModalOpen={setModalOpen}
                          setBackClicked={setBackClicked}
                          handleSearch={handleSearch}
                          inputText={inputText}
                          profile_url={profile_url}
                          similarNotes={similarNotes}

                />
                <div className="textarea-tags">

                    <TextArea notes={notes}
                              deleteNote={deleteNote}
                              activeNote={getActiveNote()}
                              setActiveNote={setActiveNote}
                              updateNote={updateNote}
                              setBackClicked={setBackClicked}
                              getTime={getTime}

                    />
                    {openTags && <div className="tag">
                        <ReactTags
                            tags={tags}
                            onTagUpdate={onTagUpdate}
                            handleDelete={handleDelete}
                            handleAddition={handleAddition}
                            handleDrag={handleDrag}
                            placeholder="Enter a tag"
                            minQueryLength={2}
                            maxLength={20}
                            autofocus={false}
                            allowDeleteFromEmptyInput={true}
                            autocomplete={true}
                            readOnly={false}
                            allowUnique={true}
                            allowDragDrop={true}
                            inline={true}
                            allowAdditionFromPaste={true}
                            editable={true}
                            clearAll={false}


                        />


                    </div>
                    }
                </div>

                {modalOpen && <Modal

                    setModalOpen={setModalOpen}
                    handleChangeEmail={handleChangeEmail}
                    handleChangeFullName={handleChangeFullName}
                    handleChangeColor={handleChangeColor}
                    handleSubmit={handleSubmit}
                    fullName={fullName}
                    email={email}
                    colorScheme={colorScheme}
                    handleLogout={handleLogout}
                    currentUser={currentUser}
                    handleImageSelected ={handleImageSelected}
                    profile_url={profile_url}
                    handleDeleteImage={handleDeleteImage}
                />}
                {modalOpen && !smallDevice &&
                    <div id="overlay" className="overlay_active" onClick={() => setModalOpen(false)}></div>}
                </div>}


                {!logged &&  <Login

                    handleLoginEmail={handleLoginEmail}
                    handleLoginPassword={handleLoginPassword}
                    handleLoginSubmit={handleLoginSubmit}
                    setSignup={setSignup}
                    loginError={loginError}
                />}
                { signup &&
                    <Signup
                        handleSignup={handleSignup}
                        handleChangeFullName={handleChangeFullName}
                        handleChangeEmail={handleChangeEmail}
                        handleChangePassword={handleChangePassword}
                        setSignup={setSignup}
                        signupError={signupError}

                    />
                }
                {signup&&<div id="overlay" className="overlay_active" onClick={()=>{setSignup(false)}} ></div>}


            </>
        );

    //}



}





export default App;
