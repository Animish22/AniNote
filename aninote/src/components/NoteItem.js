import React from 'react'
import noteContext from '../context/notes/noteContext';
import { useContext } from 'react';
const NoteItem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note , updatenote} = props;
    return (
        <div className='col-3 my-2'>
            <div className="card">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title">{note.title}</h5>
                        <i className="fa fa-trash-o mx-2"  onClick={()=>{deleteNote(note._id)}}></i>
                        <i className="fa fa-pencil-square-o" onClick={()=>{updatenote(note)}}></i>
                    </div>
                    <p className="card-text">{note.description}.</p>
                </div>
            </div>
        </div>
    )
}

export default NoteItem
