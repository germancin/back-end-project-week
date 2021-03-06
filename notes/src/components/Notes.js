import React, {Component} from 'react';
import {Row, Grid} from 'react-bootstrap';
import {getNotes, getSingleNote, syncLocalStore} from '../actions'
import styled from 'styled-components';
import {connect} from 'react-redux';
import Loading from './Loading'
import firebase from './firebase'
import {BrowserRouter as Router, Link} from "react-router-dom";


class Notes extends Component {
    state={
        notes: this.props,
    };

    componentDidMount(){

        // this.props.secureComponent();

        if(this.props.firstTime){
            this.props.getNotes();
        }else{
            firebase.on('value', (snap) => {
                this.props.syncLocalStore(snap.val());
            });
        }
    }

    goNoteDetails = (note) => {
        this.props.getSingleNote(note);
    };

    render() {
        return (
            <NotesContainer>
                <Grid>
                    <Row className="show-grid">
                        <h3 className={'top-title'}>Your Notes:</h3>
                    </Row>

                    {(this.props.fetching)
                        ? <Loading/>
                        : (this.props.notesF.length > 0)
                            ?
                                <Row className={'notes-box'}>

                                    {this.props.notesF.map((note, index) => {
                                        return (
                                            <Link to={`/details/${note.key}`}
                                                  key={index} md={4} className={'note-container'}
                                                  onClick={() => {this.goNoteDetails(note)}}
                                            >
                                                <div className="note-img">
                                                    <img className={'image'} alt={note.title} src={note.image}/>
                                                </div>
                                                <div className={"note-title"}>
                                                    {note.title}
                                                </div>
                                                <div className={"note-description"}>
                                                    {note.description}
                                                </div>
                                                <div className={"note-tags"}>
                                                    <span className={'tags-label'}>TAGS:</span>
                                                    &nbsp;{note.tags.split(/[ ,]+/).join(', ')}
                                                </div>

                                            </Link>
                                        );
                                    })}
                                </Row>
                            :
                                <div className={"no-notes"}>
                                    You don't have  Notes yet. <br/>
                                    <a href={"/create_new_note"}>Please add new note</a>
                                </div>
                    }
                </Grid>
            </NotesContainer>
        )}
}

const mapStateToProps = state => {
    const {notes_reducer} = state;
    return {
        notesF: notes_reducer.notes,
        fetching: notes_reducer.fetching,
        singleNote: notes_reducer.singleNote,
        firstTime: notes_reducer.firstTime,
    }
};

export default connect(mapStateToProps, {getNotes, getSingleNote, syncLocalStore})(Notes);


const NotesContainer = styled.div`

        .notes-box{
            border:5px solid yellow:
            display: flex;
            justify-content: flex-start;
            padding-left:5px;
            padding-right:5px;
                
                .note-container{
                    flex-grow: 1;
                    flex-basis: 250px;
                    max-width: 250px;
                    position:relative;
                    // min-height:214px;
                    // max-height:214px;
                    border-radius: 5px;
                    
                    border:1px solid #A7A7A7;
                    color:#71595A;
                    margin:10px 10px 10px 10px;
                    padding:8px 18px 8px 18px;
                    background-color:#FFFFFF;
                    
                    display: flex;
                    flex-direction:column;  
                    justify-content:flex-end;   
                        
                        .note-img {
                            
                            .image{
                                width:50px;
                                height:50px;
                                border-radius: 100%;
                                position:absolute;
                                top:-20px;
                                right:0px;
                            }
                            .image:hover{
                                border:1px solid white;
                            }
                        }              
                
                        .note-title{
                            color:#4a4a4a;
                            font-weight:bold;
                            border-bottom:1px solid #AEAEAE;
                            width:100% !important;
                            margin-bottom: 5px;
                        }
                         
                        
                        .note-description{
                            overflow: hidden;
                            min-height:90px;
                            max-height:90px;
                            margin-bottom:15px;
                        }
                        
                        .note-tags{
                            border:0px solid black;
                            font-size:10px;
                            color:grey;
                            margin-bottom:5px;
                            
                                
                                .tags-label{
                                    text-align:left;
                                    font-weight:bold;
                                }
                                
                        }
                }
                .note-container:hover{
                    border: 1px solid rgb(86, 180, 239);
                    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.05) inset, 0px 0px 8px rgba(82, 168, 236, 0.6);
                }
        }
        
        .no-notes {
            text-align:center;
            font-size: 20px;
            margin-top:20px;
        }
        
`;