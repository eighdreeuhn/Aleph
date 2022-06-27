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
  const ROOT = 55
  let load = false
  let bpm

  //----------State variables----------//

  const [unsearch, setUnsearch] = useState('')
  const [unanswer, setUnanswer] = useState({})

  //----------main functions----------//

  //Hashing function for transforming character codes into wavelengths in hertz//
  //Converts each letter into its character code modulus 24 (two octaves of half-tones) and applies
  //the function: f(n) = f(0) * A^(n) (hz)
  const interpolateNotes = phrase => {
    return phrase.split('').map(l => ROOT * A ** (l.charCodeAt(0) % 36))
  }

  const extractColors = phrase => {
    return phrase.split('').map(l => l.charCodeAt(0))
  }
  //Search field change handler//
  const handlePhraseChange = function (e) {
    setUnsearch(e.target.value)
  }
  //Search for submit handler//
  const handlePhraseSubmit = function (e) {
    e.preventDefault()
    const notes = interpolateNotes(unsearch)
    const colors = extractColors(unsearch)
    console.log(colors)
    let unanswerCopy = {...unanswer}
    unanswerCopy.notes = notes
    unanswerCopy.colors = colors
    setUnanswer(unanswerCopy)
    setUnsearch('')
    // play(notes)
  }
  //----------App rendering----------//
  console.log(`  Color ranges:\n\n${unanswer.colors}\n\n  Notes matrix:\n\n${unanswer.notes}`)
  return (
    <div className='App'>
      <Aleph />
      <SearchForm unsearch={unsearch} utils={[handlePhraseChange, handlePhraseSubmit]} />
    </div>
  )
}

export default App
