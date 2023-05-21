import React from "react";
import noteContext from "./noteContext";
import { useState } from 'react'

const NoteState = (props) => {
  const host = "http://localhost:5000";
    const notesInitial = [
        {
          "_id": "63c803bcf3b19b1b467030122",
          "user": "63c567ce1e9c7e0627327a76",
          "title": "My note",
          "description": "This is my updated note description",
          "tag": "personal",
          "date": "2023-01-18T14:35:40.682Z",
          "__v": 0
        },
        {
          "_id": "63c8048a4cf8a0a8ad7966256",
          "user": "63c567ce1e9c7e0627327a76",
          "title": "My note",
          "description": "This is my note description",
          "tag": "personal",
          "date": "2023-01-18T14:39:06.184Z",
          "__v": 0
        },
      ]
      const [notes , setNotes] = useState(notesInitial);

            // get all Notes 
            const getNotes = async ()=>{
              const response = await fetch(`${host}/api/notes/fetchallnotes`, {
                method: 'GET',
                mode: 'cors', 
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json' ,
                  'auth-token' : localStorage.getItem('token')
                }
              });
              const json = await response.json();
              setNotes(json);
            }

      // Add a Note 
      const addNote = async (title , description , tag)=>{
        const response = await fetch(`${host}/api/notes/addnote`, {
          method: 'POST',
          mode: 'cors', 
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json' ,
            'auth-token' : localStorage.getItem('token')
          },
          body: JSON.stringify({title ,description,tag}) 
        });
        const json = await response.json();
        const note = json;
        setNotes(notes.concat(note));
      }
      // Delete a Note 
      const deleteNote = async(id)=>{
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
          method: 'DELETE',
          mode: 'cors', 
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json' ,
            'auth-token' : localStorage.getItem('token')
          },
        });
        const json = response.json();
        console.log(json);
        console.log("Deleting note with note id " + id);
        const newNotes = notes.filter((note)=>{return note._id !== id});
        setNotes(newNotes);
      }
      // Edit a note 
      const editNote =async(id ,title ,description  , tag)=>{
        //API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: 'PUT',
          mode: 'cors', 
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json' ,
            'auth-token' : localStorage.getItem('token')
          },
          body: JSON.stringify({title ,description,tag}) 
        });
        console.log(response.json());
        //Logic to edit in client 
        for (let index = 0; index < notes.length; index++) {
          const element = notes[index];
          if(element._id === id)
          {
            notes[index].title = title;
            notes[index].description = description;
            notes[index].tag = tag;
          }
          break;
        }
        setNotes(notes);
      }

    return (
        <noteContext.Provider value={{notes , setNotes , addNote  , deleteNote , editNote ,getNotes}}>
            {props.children}
        </noteContext.Provider>
    )
}

export default NoteState;