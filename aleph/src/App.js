import { useState, useEffect } from 'react'
import * as Tone from 'tone'
import Aleph from './Components/Aleph'
import Blip from './Components/Blip'
import SearchForm from './Components/SearchForm'
import './App.css'

//Main page
//All logic takes place here

function App () {
  //----------Global constants--------//

  const A = 2 ** (1 / 12)
  const ROOT = 110
  let load = false
  let bpm

  //----------State variables----------//

  const [unsearch, setUnsearch] = useState('')
  const [unanswer, setUnanswer] = useState({})

  //----------main functions----------//

  const interpolateNotes = phrase => {
    return phrase.split('').map(l => ROOT * A ** (l.charCodeAt(0) % 24))
  }
  
  const handlePhraseChange = function (e) {
    setUnsearch(e.target.value)
  }
  
  const handlePhraseSubmit = function (e) {
    e.preventDefault()
    const notes = interpolateNotes(unsearch)
    console.log(notes[0])
    let unanswerCopy = {...unanswer}
    unanswerCopy.notes = notes
    setUnanswer(unanswerCopy)
    setUnsearch('')
    // play(notes)
  }
  //----------App rendering----------//
  console.log(`And the answer is : ${unanswer.notes}`)
  return (
    <div className='App'>
      <Aleph />
      <SearchForm unsearch={unsearch} utils={[handlePhraseChange, handlePhraseSubmit]} />
    </div>
  )
}

export default App
