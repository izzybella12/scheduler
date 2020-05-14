import React from 'react';
import DayListItem from "./DayListItem";

export default function DayList(props) {
  console.log(props.days)
  const days = props.days
  const eachDay = days.map((day) => {
    return <DayListItem
    key={day.id}
    name={day.name}
    spots={day.spots} 
    selected={day.name === props.day}
    setDay={props.setDay}/>
  })
  return (
    <ul>{eachDay}</ul>
  )
}
