import { useState, useEffect } from 'react'
import * as Tone from 'tone'
import Aleph from './Components/Aleph'
import Blip from './Components/Blip'
import SearchForm from './Components/SearchForm'
import Empty from './Components/Empty'
import './App.css'
import { Player } from 'tone'

//Main page
//All logic takes place here

function App () {
  //----------Global constants--------//
  
  const A = 2 ** (1 / 12)
  const ROOT = 55
  let load = false
  let masterVolume = 1
  let bpm

  const gain = new Tone.Gain(masterVolume).toDestination()
  const phaser = new Tone.Phaser(
    {
      "frequency": 15,
      "octaves": 5,
      "baseFrequency": 110
    }).connect(gain)
  
  //----------State variables----------//
  
  const [unsearch, setUnsearch] = useState('')
  const [unanswer, setUnanswer] = useState({})
  
  //----------main functions----------//
  
  //Hashing function for transforming character codes into wavelengths in hertz//
  //Converts each letter into its character code modulus 24 (two octaves of half-tones) and applies
  //the function: f(n) = f(0) * A^(n) (hz)

  const play = function() {
    const now = Tone.now()
    // const test = new Tone.AMSynth().connect(phaser)
    // test.triggerAttackRelease('A2', '1m', now, 1)
    const emptyPlayer = new Tone.Player('src/resources/Sad Trombone Wah Wah Wah Fail Sound Effect.mp3').connect(phaser)
    emptyPlayer.autostart = true
    console.log(emptyPlayer)
  }

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
  //Search field submit handler//
  const handlePhraseSubmit = function (e) {
    e.preventDefault()
    if (unsearch.length !== 0) {
      const notes = interpolateNotes(unsearch)
      const colors = extractColors(unsearch)
      console.log(colors)
      let unanswerCopy = {...unanswer}
      unanswerCopy.notes = notes
      unanswerCopy.colors = colors
      setUnanswer(unanswerCopy)
      setUnsearch('')
    } else {
      console.log("Even I don't know the unanswer to that :(")
      play()
    }

  }

  //----------App rendering----------//
  console.log(`  Color ranges:\n\n${unanswer.colors}\n\n  Notes matrix:\n\n${unanswer.notes}`)
  return (
    <div className='App'>
      <Aleph />
      <SearchForm unsearch={unsearch} utils={[handlePhraseChange, handlePhraseSubmit]} />
      {/* <Empty /> */}
    </div>
  )
}

export default App
