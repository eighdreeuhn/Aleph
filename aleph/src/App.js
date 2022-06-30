import { useState, useEffect } from 'react'
import * as Tone from 'tone'
import Aleph from './Components/Aleph'
import Blip from './Components/Blip'
import SearchForm from './Components/SearchForm'
import Footer from './Components/Footer'
import './App.css'

//----------Global constants--------//
let masterVolume = 1
const A = 2 ** (1 / 12)
const ROOT = 55

//Main page
//All logic takes place here

function App () {
  //----------Wiring network----------//

  let cycle
  let rootTone
  let measure
  let whole
  let half
  let quarter
  let eigth
  let sixt
  let thirty2nd
  const gain = new Tone.Gain(masterVolume)
  const phaser = new Tone.Compressor()
  const lowPass = new Tone.Mono()

  //----------Instruments----------//

  let bassDrum
  let snareDrum
  let hiHat
  let crash
  let bass
  let mainCoreVoice
  let mainVoice
  let harmonizer

  //----------State & global variables----------//

  const [unsearch, setUnsearch] = useState('')
  const [unanswer, setUnanswer] = useState({})
  const [playerReady, setPlayerReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [beatConductor, setBeatConductor] = useState(0)
  let controlPanel
  let counter = 0

  //----------main functions----------//

  //Controller for blip rendering//
  const blipz = function () {}

  //Set-up for the loop and starts the main Transport//
  const preBuild = function () {
    gain.toDestination()
    phaser.connect(gain)
    lowPass.connect(gain)
    setPlaying(true)
    setPlayerReady(false)
    measure = 60 / (unanswer.bpm / 4)
    half = measure / 2
    quarter = measure / 4
    eigth = measure / 8
    sixt = measure / 16
    thirty2nd = measure / 32
    console.log(unanswer)

    bassDrum = new Tone.MembraneSynth({
      oscillator: {
        type: 'sine'
      },
      attack: 0.1,
      sustain: 0.3,
      delay: 0.25,
      release: 0.1
    }).connect(phaser)

    bass = new Tone.Synth({
      oscillator: {
        type: 'sine'
      }
    }).connect(lowPass)

    snareDrum = new Tone.NoiseSynth({
      volume: 3,
      noise: {
        type: 'white',
        playbackRate: 3
      },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.2,
        release: 0.1
      }
    }).connect(lowPass)

    hiHat = new Tone.MetalSynth({
      envelope: {
        attack: 0.1,
        sustain: 0.1,
        delay: 0.3,
        release: 0.2
      }
    }).connect(phaser)

    crash = new Tone.MetalSynth({
      frequency: 500,
      envelope: {
        attack: 0.1,
        sustain: 0.25,
        delay: 0.3
      },
      harmonicity: 5
    }).connect(phaser)

    mainCoreVoice = new Tone.Synth({
      envelope: {
        attack: 0.25,
        sustain: 0.25,
        delay: 0.1,
        release: 0.25
      }
    })

    mainVoice = new Tone.PolySynth(Tone.Synth).connect(phaser)
    harmonizer = new Tone.PolySynth(Tone.FMSynth).connect(phaser)
    cycle = new Tone.Loop(play, '1m')
    Tone.Transport.start()
    cycle.start()
  }

  //Strikes a major chord
  const chord = function () {
    mainVoice.triggerAttackRelease(rootTone / 2, '2n')
    mainVoice.triggerAttackRelease(rootTone / 4, '2n')
    mainVoice.triggerAttackRelease(rootTone / 8, '2n')
    mainVoice.triggerAttackRelease(rootTone, '2n')
    mainVoice.triggerAttackRelease(rootTone * A ** 7, '2n')
    mainVoice.triggerAttackRelease(rootTone * A ** 4, '2n')
  }

  const arpeggiator = function () {}

  //Main player function//
  const play = function (time) {
    Tone.Transport.bpm.exponentialRampTo(unanswer.bpm, 0.1)
    gain.gain.rampTo(masterVolume, 0.25)
    //Get an index from the current measure relative to the total number of notes//
    setBeatConductor(
      parseInt(Tone.Transport.position.split(':')[0]) % unanswer.notes.length
    )
    counter =
      parseInt(Tone.Transport.position.split(':')[0]) % unanswer.notes.length
    console.log(
      `Current counter: ${counter}\n\n  Current time: ${time}\n\n Transfer position: ${Tone.Transport.position}\n\n Measure duration: ${measure}`
    )
    rootTone = unanswer.notes[counter]
    //Percussion line//
    if ((counter + 1) % 2 == 0) {
      // chord()
      bassDrum.triggerAttackRelease(55, '4n')
      hiHat.triggerAttackRelease(880, '16n')
      snareDrum.triggerAttackRelease('16n', `+${half}`)
      hiHat.triggerAttackRelease(880, '16n', `+${half + eigth}`)
      bassDrum.triggerAttackRelease(55, '4n', `+${quarter + eigth}`)
      hiHat.triggerAttackRelease(880, '16n', `+${half + quarter}`)
      bassDrum.triggerAttackRelease(55, '4n', `+${half}`)
      bassDrum.triggerAttackRelease(55, '4n', `+${half + quarter + eigth}`)
      // snareDrum.triggerAttackRelease('16n', `+${ eigth}`)
      // bassDrum.triggerAttackRelease(22, '4n')
      // bassDrum.triggerAttackRelease(22, '4n')
      // hiHat.triggerAttackRelease(440, '16n', `+${half}`, 2)
    } else if ((counter + 1) % 2 == 1) {
      // chord()
      hiHat.triggerAttackRelease(880, '16n')
      bassDrum.triggerAttackRelease(55, '4n')
      bassDrum.triggerAttackRelease(55, '4n', `+${quarter}`)
      // bassDrum.triggerAttackRelease(55, '4n', `+${quarter + sixt}`)
      bassDrum.triggerAttackRelease(55, '4n', `+${quarter + eigth}`)
      crash.triggerAttackRelease('4n')
      // snareDrum.triggerAttackRelease('16n', `+${half + eigth}`)
      // snareDrum.triggerAttackRelease('16n', `+${half + eigth+ sixt}`)
    }

    // bassDrum.triggerAttackRelease(22, '4n', time + half + quarter + eigth)
    // bassDrum.triggerAttackRelease(22, '4n', '+.75')
    // bassDrum.triggerAttackRelease(22, '4n', '+1')
    // bassDrum.triggerAttackRelease(55, '8n', time + 0.5, 1)
    // hiHat.triggerAttackRelease(440, '16n', time + 0.25, 2)
    // bass.triggerAttackRelease(rootTone/2*(A**-1), '8n')
    // bass.triggerAttackRelease(rootTone/2, '8n', `+${sixt}`)
    // bass.triggerAttackRelease(rootTone/2, '8n', time + eigth)
    // bassDrum.triggerAttackRelease(rootTone * 0.25, '4n', time + measure * 0.25, 1)
    // bassDrum.triggerAttackRelease(rootTone * 0.25, '4n', time + measure * 0.5, 1)
    // bassDrum.triggerAttackRelease(rootTone * 0.25,'4n', time + measure * 0.75, 1)
    // mainVoice.triggerAttackRelease(rootTone, '4n', time, 2)
    // mainVoice.triggerAttackRelease(rootTone * A ** 7 * 4, '4n', time + measure * 0.5, 1)
    // mainVoice.triggerAttackRelease(rootTone * 2, '8n', time + 0.75, 1)
    // harmonizer.triggerAttackRelease(rootTone * A ** 7 * 8, '8n',  time + measure * 0.75, 1)
    // harmonizer.triggerAttackRelease(rootTone * A ** 7 * 4, '8n', time + measure * 0.75, 1)
    // harmonizer.triggerAttackRelease(rootTone * A ** 7 * 2, '8n', time + measure * 0.75, 1)
  }

  const stopPlay = function () {
    //need to research this
    gain.disconnect()
    Tone.Transport.stop()
    setPlaying(false)
  }

  //Ramp up the bpm of the main loop//
  const rampUp = function () {
    unanswer.bpm += 5
    Tone.Transport.bpm.linearRampTo(unanswer.bpm, 1)
  }

  //Ramp dowm the bpm of the main loop//
  const rampDown = function () {
    unanswer.bpm -= 5
    Tone.Transport.bpm.linearRampTo(unanswer.bpm, 1)
  }

  //Increment the master volume//
  const volUp = function () {
    masterVolume = Math.abs((masterVolume += 0.1))
  }

  //Decrement the master volume//
  const VolDown = function () {
    masterVolume = Math.abs((masterVolume -= 0.1))
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
        Math.trunc(Math.abs(Math.sin(c)) * 255),
        Math.trunc(Math.abs(Math.cos(c)) * 255),
        Math.trunc(Math.abs(Math.floor(Math.tan(c)) - Math.tan(c)) * 255),
        Math.abs(
          Math.floor(Math.abs(Math.atan(c) ** Math.sin(c))) -
            Math.abs(Math.atan(c) ** Math.sin(c))
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
      // setPlaying(true)
      // preBuild()
    }
  }

  //Logic to determine appropriate control panel display//
  if (playerReady) {
    controlPanel = <button onClick={preBuild}>Unanswer</button>
  } else if (playing) {
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
    `  Playing: ${Tone.Transport.state}\n\n  Player ready: ${playerReady}\n\n  Color ranges:\n\n${unanswer.colors}\n\n  Notes matrix:\n\n${unanswer.notes}\n\n BPM: ${unanswer.bpm}\n\n Bar: ${Tone.Transport.position}`
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
