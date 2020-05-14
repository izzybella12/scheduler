import React from 'react';
import "components/DayListItem.scss";
import classNames from 'classnames';

export default function DayListItem(props) {

  let dayClass = classNames ("day-list__item", {
    "day-list__item--selected": props.selected, 
    "day-list__item--full": props.spots === 0
  })

  let formatSpots = function (num) {
    if (num === 0) {
      return "no spots remaining"
    }
    if (num === 1) {
      return num + " spot remaining"
    } else {
      return num + " spots remaining"
    }
  }
 
  return (
    <li className={dayClass} onClick={() => props.setDay ? props.setDay(props.name) : false}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  )
}