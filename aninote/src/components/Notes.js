import React from 'react'
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import noteContext from '../context/notes/noteContext';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
const Notes = () => {
  const context = useContext(noteContext);
  let history = useNavigate();
  const { notes, getNotes, editNote } = context;
  useEffect(() => {
    if(localStorage.getItem('token'))
    {
      getNotes();
    }
    else
    {
      history('/login');
    }
  })


  const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" });

  const ref = useRef(null);
  const refClose = useRef(null);


  const updatenote = (currentNote) => {
    ref.current.click();
    setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
    console.log(currentNote.title);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refClose.current.click();
  }
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }
  return (
    <>
      <AddNote />

      <button type="button" className="btn btn-primary d-none" ref={ref} data-bs-toggle="modal" data-bs-target="#exampleModal">
      </button>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label"> Title</label>
                  <input type="email" className="form-control" id="etitle" name='etitle' value={note.etitle} aria-describedby="emailHelp" onChange={onChange} minLength={5} required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">Description</label>
                  <input type="text" className="form-control" id="edescription" value={note.edescription} name='edescription' onChange={onChange} minLength={5} required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">Tag</label>
                  <input type="text" value={note.etag} className="form-control" id="etag" name='etag' onChange={onChange} minLength={5} required/>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button disabled={note.etitle.length < 5 || note.edescription.length < 5} type="submit" className="btn btn-primary" onClick={handleSubmit}>Update Note</button>
            </div>
          </div>
        </div>
      </div>
      <div className='row my-3'>
        <h2>Your Notes</h2>
        <div className="container">
          {notes.length === 0 && "No notes to display."}
          {notes.map((note) => {
            return <NoteItem key={note._id} updatenote={updatenote} note={note} />
          })}
        </div>
      </div>
    </>
  )
}

export default Notes
