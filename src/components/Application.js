import React, { useState, useEffect } from "react";
import axios from 'axios';


import "components/Application.scss";
import Appointment from "components/Appointment";
import DayList from "components/DayList";

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  }, 
  {
    id: 3, 
    time: "2pm", 
    interview: {
      student: "Bella Pana",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  }, 
  {
    id: 4, 
    time: "4pm", 
    interview: {
      student: "Ari Ablo",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  }
];

const eachAppointment = appointments.map((appointment) => {
  return <Appointment
    time={appointment.time}
    interview={appointment.interview} 
    />     
}) 

export default function Application(props) {

  const [day, setDay] = useState("Monday")
  const [days, setDays] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8001/api/days')
    .then((response) => setDays(response.data))
  })

  return (
    <main className="layout">
      <section className="sidebar">
        <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={days}
            day={day}
            setDay={() => setDays(days)}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {eachAppointment}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}