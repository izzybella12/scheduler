import React from 'react';
import "./styles.scss";

import Header from './Header'
import Show from './Show'
import Empty from './Empty'
import Form from './Form'
import Status from './Status'
import Confirm from './Confirm'
import Error from './Error'

import useVisualMode from "../../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const SAVE = "SAVE";
const CREATE = "CREATE";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const ONEDIT = "ONEDIT";
const ERROR_SAVE = "ERROR_SAVE"
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const handleOnCancel = () => {
    back();
  };
  const handleOnAdd = () => {
    transition(CREATE);
  };
  const handleOnSaving = () => {
    transition(SAVE, true);
  };
  const handleOnShow = () => {
    transition(SHOW, true);
  };
  const handleOnDeleting = () => {
    transition(DELETE, true);
  };
  const handleOnDelete = () => {
    transition(EMPTY);
  };

  const handleOnConfirm = () => {
    transition(CONFIRM);
  };

  const handleOnEdit = () => {
    transition(ONEDIT);
  }

  const handleOnSavingError = () => {
    transition(ERROR_SAVE, true);
  }

  const handleOnDeletingError = () => {
    transition(ERROR_DELETE, true);
  }

  function saving(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    handleOnSaving();
    props.bookInterview(props.id, interview)
    .then(handleOnShow)
    .catch(handleOnSavingError)
  }

  function deleting() {
    handleOnDeleting();
    props.onDelete(props.id)
    .then(handleOnDelete)
    .catch(handleOnDeletingError)
  }

  function editing() {
    handleOnEdit();
  }
  
  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={handleOnAdd} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={editing}
          onDelete={handleOnConfirm}
        />
      )}
      {mode === CREATE && (
        <Form
          name={props.name}
          interviewers={props.interviewers}
          interviewer={props.interviewer}
          onSave={saving}
          onCancel={handleOnCancel}
        />
      )}
      {mode === SAVE && <Status message="Saving"/>}
      {mode === DELETE && <Status message="Deleting"/>}
      {mode === CONFIRM && (
      <Confirm
        message="Delete the appointment?"
        onConfirm={deleting}
        onCancel={handleOnCancel}
        />
      )}
      {mode === ONEDIT && (
        <Form
          name={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}
          onSave={saving}
          onCancel={handleOnCancel}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
        message="Could not save appointment"
        onClose={handleOnCancel}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
        message="Could not delete appointment"
        onClose={handleOnCancel}
        />
      )}
    </article>
  )
}