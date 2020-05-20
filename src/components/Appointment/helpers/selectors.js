export function getAppointmentsForDay(state, day) {
  const filteredDays = state.days.filter(days => days.name === day);
  if (filteredDays.length < 1) {
    return filteredDays;
  }
  const filderedAppointments = Object.values(state.appointments).filter(appointment => filteredDays[0].appointments.includes(appointment.id))
  return filderedAppointments;
}

export function getInterview(state, interview) {
  if (interview === null) {
    return null
  }
  const obj = {...interview}
  const id = obj.interviewer
  const interviewMatch = Object.values(state.interviewers).filter((interview) => interview.id === id)[0]
  obj.interviewer = interviewMatch
  return obj
}

export function getInterviewersForDay(state, day) {
  const filteredDays = state.days.filter(days => days.name === day);
  if (filteredDays.length < 1) {
    return filteredDays;
  }
  const filderedInterviewers = Object.values(state.interviewers).filter(interviewer => filteredDays[0].interviewers.includes(interviewer.id))
  return filderedInterviewers;
}