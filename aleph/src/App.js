import { useState, useEffect } from 'react'
import * as Tone from 'tone'
import Aleph from './Components/Aleph'
import Blip from './Components/Blip'
import SearchForm from './Components/SearchForm'
import './App.css'
import { AMSynth, Context, DuoSynth, FatOscillator, FMOscillator, FMSynth, Player, Synth } from 'tone'

//Main page
//All logic takes place here

function App () {
  //----------Global constants--------//
  
  const A = 2 ** (1 / 12)
  const ROOT = 55
  let load = false
  
  //----------Wiring network----------//
  
  let masterVolume = 1
  let bpm = 120
  let cycle
  let beatConductor
  const gain = new Tone.Gain(masterVolume).toDestination()
  const phaser = new Tone.FeedbackDelay("8n", 0.1).connect(gain)

  //----------Instruments----------//

  let bassDrum
  let hiHat
  let mainVoice
  let harmonizer
  
  //----------State variables----------//
  
  const [unsearch, setUnsearch] = useState('')
  const [unanswer, setUnanswer] = useState({})
  const [playing, setPlaying] = useState(false)
  
  //----------main functions----------//

  //Set-up for the loop and starts the main Transport//
    const preBuild = function() {
      bassDrum = new Tone.MembraneSynth(
        {
          "attack": 0.1,
          "sustain": 0.3,
          "delay": 0.25,
          "release": 0.5
        }
      ).connect(phaser)
      hiHat = new Tone.MetalSynth(
        {
          "attack": 0.1,
          "sustain": 0.3,
          "delay": 0.1,
          "release": 0.5
        }
      ).connect(phaser)
      mainVoice = new Tone.PolySynth(FMSynth).connect(phaser)
      harmonizer = new Tone.PolySynth(Tone.MonoSynth).connect(phaser)
      console.log(harmonizer)
      cycle = new Tone.Loop(play, '1m')
      Tone.start()
      Tone.Transport.start()
      cycle.start()
    }
    
    //Main player function//
    const play = function(time) {
    Tone.Transport.bpm.exponentialRampTo(bpm, 1)
    gain.gain.rampTo(masterVolume, 0.25)
    beatConductor = Tone.Transport.position.split(':')[0]
    console.log(beatConductor)
    bassDrum.triggerAttackRelease(22.5, '4n', time, 1)
    hiHat.triggerAttackRelease(880, '16n', time + 0.75, 1)
    mainVoice.triggerAttackRelease(ROOT, '4n', time, 2)
    mainVoice.triggerAttackRelease(ROOT*(A**7)*4, '8n', time + 0.5, 1)
    mainVoice.triggerAttackRelease(ROOT*2, '8n', time + 0.75, 1)
    harmonizer.triggerAttackRelease(ROOT*(A**7)*8, '8n', time + 1, 1)
    harmonizer.triggerAttackRelease(ROOT*(A**7)*4, '8n', time + 1, 1)
    harmonizer.triggerAttackRelease(ROOT*(A**7)*2, '8n', time + 1, 1)
  }

  const stopPlay = function() {
    //need to research this
    console.log("Haven't figured this out yet.")
  }

  const rampUp = function() {
    bpm += 5
  }
  const rampDown = function() {
    bpm -= 5
  }
  const volUp = function() {
    masterVolume = Math.abs(masterVolume += 0.1)
  }
  const VolDown = function() {
    masterVolume = Math.abs(masterVolume -= 0.1)
  }

  //Hashing function for transforming character codes into wavelengths in hertz//
  //Converts each letter into its character code modulus 24 (two octaves of half-tones) and applies
  //the function: f(n) = f(0) * A^(n) (hz)
  const interpolateNotes = phrase => phrase.split('').map(l => ROOT * A ** (l.charCodeAt(0) % 36))
  
  //Hashing function for transforming character codes into colors based on wavelength//
  const extractColors = phrase => phrase.split('').map(l => l.charCodeAt(0))

  //Hashing function to distill inherent beats per minute from a string//
  const extractBPM = phrase => phrase.reduce((a, b) => a + b,0)[0] / phrase.length
  
  //Search field change handler//
  const handlePhraseChange = e => setUnsearch(e.target.value)
  
  //Search field submit handler//
  const handlePhraseSubmit = e => {
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
      preBuild()
    }

  }

  //----------App rendering----------//
  console.log(`  Color ranges:\n\n${unanswer.colors}\n\n  Notes matrix:\n\n${unanswer.notes}\n\n BPM: ${bpm}`)
  return (
    <div className='App'>
      <Aleph color={unanswer.colors}/>
        <SearchForm unsearch={unsearch} utils={[handlePhraseChange, handlePhraseSubmit]} />
        <button onClick={stopPlay}>Stopz!</button>
        <button onClick={rampUp}>Rampz!</button>
        <button onClick={rampDown}>Slowz!</button>
        <button onClick={volUp}>Loudz!</button>
        <button onClick={VolDown}>Shhhz!!</button>
    </div>
  )
}

export default App