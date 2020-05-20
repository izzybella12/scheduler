import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData(){

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = day => setState(state => ({ ...state, day }));

  function spotsRemaining(state) {
    let spotsAvailable = [];
    let totalDays = state.days;
    for (let day of totalDays) {
      let appointmentSlots = 0;
      for (let singleDay of day.appointments) {
        const currentAppointment = state.appointments[singleDay]
        if (currentAppointment.interview === null) {
          appointmentSlots++;
        }
      }
      spotsAvailable.push(appointmentSlots)
    }
    return spotsAvailable;
  };

  function updateSpots(state) {
    const spots = spotsRemaining(state)
    let newDays = []
    for (let dayIndex in spots) {
      newDays.push({ ...state.days[dayIndex], spots: spots[dayIndex]})
    }
    return { ...state, days: newDays}
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    return axios.put(`/api/appointments/${id}`, 
    appointment)
    .then(() => setState(state => updateSpots({...state, appointments: {
      ...state.appointments,
      [id]: appointment
    }})))
  };

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments, 
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`, 
    appointment)
    .then(() => setState(state => updateSpots({...state, appointments})))
  };

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'), 
      axios.get('/api/interviewers')
    ])
    .then((all) => {
      setState(state => ({...state, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
    .catch(err => console.log("An error has occured fetching data form api"))
  }, []);

  return {state, setDay, bookInterview, cancelInterview, spotsRemaining};

}