import { useState, useCallback } from 'react'

export default function useVisualMode(initial) {

  const [mode, setMode] = useState(initial)
  const [history, setHistory] = useState([initial]);  

  const transition = (newMode, replace = false) => {
    if (replace) {
      setHistory(currentHistory => [...currentHistory.splice(0, currentHistory.length - 1), newMode])
    } else {
      setHistory(currentHistory => [...currentHistory, newMode])
    }
    setMode(newMode);
  }

  const back = () => {
    if (history.length > 1) {
      setHistory(prevHistory => [...prevHistory.splice(0, history.length - 1)])
      setMode(history[history.length - 2]);  
    }
  }

  return {mode: history[history.length - 1], transition, back}

}