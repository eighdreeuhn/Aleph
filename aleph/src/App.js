import { useState, useEffect } from 'react'
import * as Tone from 'tone'
import Aleph from './Components/Aleph'
import Blip from './Components/Blip'
import SearchForm from './Components/SearchForm'
import Footer from './Components/Footer'
import './App.css'
import { AMSynth } from 'tone'

//Main page
//All logic takes place here

function App () {
  //----------Global constants--------//

  const A = 2 ** (1 / 12)
  const ROOT = 55
  let load = false

  //----------Wiring network----------//

  let masterVolume = 1
  let cycle
  let beatConductor = 0
  let rootTone
  let measure
  const gain = new Tone.Gain(masterVolume).toDestination()
  const phaser = new Tone.FeedbackDelay('16n', 0.1).connect(gain)

  //----------Instruments----------//

  let bassDrum
  let hiHat
  let mainVoice
  let harmonizer

  //----------State & global variables----------//

  const [unsearch, setUnsearch] = useState('')
  const [unanswer, setUnanswer] = useState({})
  const [playerReady, setPlayerReady] = useState(false)
  const [playing, SetPlaying] = useState(false)
  let controlPanel

  //----------main functions----------//

  //Set-up for the loop and starts the main Transport//
  const preBuild = function () {
    SetPlaying(true)
    console.log(unanswer, playerReady)
    bassDrum = new Tone.MembraneSynth({
      attack: 0.1,
      sustain: 0.3,
      delay: 0.25,
      release: 0.5
    }).connect(phaser)
    hiHat = new Tone.MetalSynth({
      attack: 0.1,
      sustain: 0.3,
      delay: 0.1,
      release: 0.5
    }).connect(phaser)
    mainVoice = new Tone.PolySynth(AMSynth).connect(phaser)
    harmonizer = new Tone.PolySynth(Tone.FMSynth).connect(phaser)
    console.log(harmonizer)
    cycle = new Tone.Loop(play, '1m')
    Tone.start()
    Tone.Transport.start()
    cycle.start()
  }

  //Main player function//
  const play = function (time) {
    Tone.Transport.bpm.exponentialRampTo(unanswer.bpm, 1)
    gain.gain.rampTo(masterVolume, 0.25)
    //Get an index from the current measure relative to the total number of notes//
    beatConductor =
      parseInt(Tone.Transport.position.split(':')[0]) % unanswer.notes.length
    measure = 60 / (unanswer.bpm / 4)
    console.log(beatConductor, Tone.Transport.position, measure)
    rootTone = unanswer.notes[beatConductor]
    bassDrum.triggerAttackRelease(rootTone * 0.25, '4n', time, 1)
    bassDrum.triggerAttackRelease(
      rootTone * 0.25,
      '4n',
      time + measure * 0.25,
      1
    )
    bassDrum.triggerAttackRelease(
      rootTone * 0.25,
      '4n',
      time + measure * 0.5,
      1
    )
    bassDrum.triggerAttackRelease(
      rootTone * 0.25,
      '4n',
      time + measure * 0.75,
      1
    )
    hiHat.triggerAttackRelease(rootTone, '32n', time + measure * 0.25, 1)
    hiHat.triggerAttackRelease(rootTone, '32n', time + measure * 0.3, 1)
    mainVoice.triggerAttackRelease(rootTone, '4n', time, 2)
    mainVoice.triggerAttackRelease(
      rootTone * A ** 7 * 4,
      '4n',
      time + measure * 0.5,
      1
    )
    mainVoice.triggerAttackRelease(rootTone * 2, '8n', time + 0.75, 1)
    harmonizer.triggerAttackRelease(
      rootTone * A ** 7 * 8,
      '8n',
      time + measure * 0.75,
      1
    )
    harmonizer.triggerAttackRelease(
      rootTone * A ** 7 * 4,
      '8n',
      time + measure * 0.75,
      1
    )
    harmonizer.triggerAttackRelease(
      rootTone * A ** 7 * 2,
      '8n',
      time + measure * 0.75,
      1
    )
  }

  const stopPlay = function () {
    //need to research this

    SetPlaying(false)
    console.log("Haven't figured this out yet.")
  }

  //Ramp up the bpm of the main loop//
  const rampUp = function () {
    unanswer.bpm += 5
    console.log(unanswer.bpm)
  }

  //Ramp dowm the bpm of the main loop//
  const rampDown = function () {
    unanswer.bpm -= 5
    console.log(unanswer.bpm)
  }

  //Increment the master volume//
  const volUp = function () {
    masterVolume = Math.abs((masterVolume += 0.1))
    console.log(masterVolume)
  }

  //Decrement the master volume//
  const VolDown = function () {
    masterVolume = Math.abs((masterVolume -= 0.1))
    console.log(masterVolume)
  }

  //Hashing function for transforming character code into wavelength (hertz)//
    //Converts each letter into its character code modulus 24 (two octaves of half-tones) and applies
    //the function: f(n) = f(0) * A^(n) (hz)
  const interpolateNotes = phrase =>
    phrase.split('').map(l => ROOT * A ** (l.charCodeAt(0) % 36))

  //Hashing function for transforming character codes into colors based on wavelength//
    //This is a pretty crazy way of accomplishing this, and I suspect that there's//
    //a more elegant way of doing it using angles and the color wheel, but I've//
    //already wasted enough time on this as it is//
  const extractColors = phrase => {
    return phrase
      .split('')
      .map(l => l.charCodeAt(0))
      .map(c => [
        Math.trunc(
          Math.abs(
            Math.sin(c)) * 255),
        Math.trunc(
          Math.abs(
            Math.cos(c)) * 255),
        Math.trunc(
          Math.abs(
            Math.floor(
              Math.tan(c)) - Math.tan(c)) * 255),
        Math.abs(
          Math.floor(
            Math.abs(Math.atan(c) ** Math.sin(c))) - Math.abs(Math.atan(c) ** Math.sin(c))
        )
      ])
  }

  //Hashing function to distill inherent beats per minute from a string//
  const extractBPM = phrase => {
    let rawBpm =
      (phrase
        .split('')
        .map(l => l.charCodeAt(0))
        .reduce((a, b) => a + b, 0) %
        110) *
      2
    return rawBpm === 0
      ? 120
      : rawBpm < 50
      ? rawBpm * 6
      : rawBpm < 100
      ? rawBpm * 3
      : rawBpm
  }

  //Search field change handler//
  const handlePhraseChange = e => setUnsearch(e.target.value)

  //Search field submit handler//
  const handlePhraseSubmit = e => {
    e.preventDefault()
    if (unsearch.length !== 0) {
      const notes = interpolateNotes(unsearch)
      const colors = extractColors(unsearch)
      const bpm = extractBPM(unsearch)
      let unanswerCopy = { ...unanswer }
      unanswerCopy.notes = notes
      unanswerCopy.colors = colors
      unanswerCopy.bpm = bpm
      setUnanswer(unanswerCopy)
      setUnsearch('')
      setPlayerReady(true)
      SetPlaying(true)
    }
  }

  if (playerReady) {
    setPlayerReady(false)
    preBuild()
  }

  //Logic to determine appropriate control panel display//
  if (playing) {
    controlPanel = (
      <div>
        <button onClick={stopPlay}>Stopz!</button>
        <button onClick={rampUp}>Rampz!</button>
        <button onClick={rampDown}>Slowz!</button>
        <button onClick={volUp}>Loudz!</button>
        <button onClick={VolDown}>Shhhz!!</button>
      </div>
    )
  } else {
    controlPanel = (
      <SearchForm
        unsearch={unsearch}
        utils={[handlePhraseChange, handlePhraseSubmit]}
      />
    )
  }

  //----------App rendering----------//
  console.log(
    `  Color ranges:\n\n${unanswer.colors}\n\n  Notes matrix:\n\n${unanswer.notes}\n\n BPM: ${unanswer.bpm}`
  )
  return (
    <div className='App'>
      <Aleph playing={playing} bar={beatConductor} colors={unanswer.colors} />
      <section className='control'>{controlPanel}</section>
      <Footer />
    </div>
  )
}

export default App
