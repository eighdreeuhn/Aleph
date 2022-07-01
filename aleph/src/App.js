import { useState, useEffect } from 'react'
import * as Tone from 'tone'
import Aleph from './Components/Aleph'
import Blipz from './Components/Blipz'
import SearchForm from './Components/SearchForm'
import Footer from './Components/Footer'
import './App.css'

//----------Global constants--------//
let masterVolume
const A = 2 ** (1 / 12)
const ROOT = 55
let cycle
let rootTone
let measure
let whole
let half
let quarter
let eigth
let sixt
let thirty2nd

//Main page
//All logic takes place here

function App () {
  //----------Wiring network----------//

  const gain = new Tone.Gain(masterVolume).toDestination()
  const compressor = new Tone.Compressor()
  const phaser = new Tone.Phaser()
  const lowPass = new Tone.Distortion()

  //----------Instruments----------//

  let bassDrum
  let snareDrum
  let hiHat
  let crash
  let bass
  let chime
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

  //Set-up for the loop and starts the main Transport//
  const preBuild = function (style) {
    Tone.Transport.bpm.value = unanswer.bpm
    setPlaying(true)
    setPlayerReady(false)
    measure = 60 / (unanswer.bpm / 4)
    half = measure / 2
    quarter = measure / 4
    eigth = measure / 8
    sixt = measure / 16
    thirty2nd = measure / 32
    console.log(unanswer)

    //Instruments set-up//
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
    }).chain(phaser, compressor, gain)

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
    })

    hiHat = new Tone.MetalSynth({
      envelope: {
        attack: 0.1,
        sustain: 0.1,
        delay: 0.3,
        release: 0.2
      }
    })

    crash = new Tone.MetalSynth({
      frequency: 500,
      envelope: {
        attack: 0.1,
        sustain: 0.25,
        delay: 0.3
      },
      harmonicity: 4
    })

    chime = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        volume: 5,
        count: 3,
        spread: 40,
        type: 'sine'
      }
    }).chain(phaser, compressor, gain)

    mainVoice = new Tone.PolySynth(Tone.Synth)
    harmonizer = new Tone.PolySynth(Tone.FMSynth)
    style === 'ambient' ?
    cycle = new Tone.Loop(ambientChimes, '1m') :
    style === 'hip-hop' ?
    cycle = new Tone.Loop(hipHopBeat, '1m') :
    cycle = null
    Tone.Transport.start()
    cycle.start()
  }

  //Creates a range of playble notes based on the root tone passed as argument//
  const generatePalette = tone => {
    let palette = []
    for (let i = 0; i <= 4; i += 2) {
      if (i === 0) {
        palette.push(tone)
        palette.push(tone*(A**3))
        palette.push(tone*(A**5))
        palette.push(tone*(A**7))
        palette.push(tone/8)
        palette.push((tone/8)*(A**3))
        palette.push((tone/8)*(A**5))
        palette.push((tone/8)*(A**7))
      } else {
        palette.push(tone*i)
        palette.push(tone/i)
        palette.push((tone*i)*(A**3))
        palette.push((tone/i)*(A**3))
        palette.push(tone*i*(A**5))
        palette.push((tone/i)*(A**5))
        palette.push((tone*i)*(A**7))
        palette.push((tone/i)*(A**7))
      }
    }
    return palette
  }

  //Strikes a major chord
  const chord = function () {
    mainVoice.triggerAttackRelease(rootTone/2,'2n')
    mainVoice.triggerAttackRelease(rootTone/4,'2n')
    mainVoice.triggerAttackRelease(rootTone/8,'2n')
    mainVoice.triggerAttackRelease(rootTone,'2n')
    mainVoice.triggerAttackRelease(rootTone*(A**7),'2n')
    mainVoice.triggerAttackRelease(rootTone*(A**4), '2n')
  }

  const arpeggiator = function () {}

  //Main player function//
  const hipHopBeat = function (time) {
    gain.gain.rampTo(masterVolume, 0.25)
    //Get an index from the current measure relative to the total number of notes//
    setBeatConductor(
      parseInt(Tone.Transport.position.split(':')[0]) % unanswer.notes.length
    )
    counter =
      parseInt(Tone.Transport.position.split(':')[0]) % unanswer.notes.length
    console.log(
      `Current counter: ${counter}\n\n  Current time: ${time}\n\n Current Transport position: ${Tone.Transport.position}\n\n Measure duration: ${measure}`
    )
    rootTone = unanswer.notes[counter]
    if ((counter + 1) % 2 === 0) {
      //Percussion line//
      bassDrum.triggerAttackRelease(55, '8n')
      bassDrum.triggerAttackRelease(55, '8n', `+${quarter}`)
      hiHat.triggerAttackRelease(880, '16n', `+${quarter}`)
      snareDrum.triggerAttackRelease('16n', `+${half}`)
      hiHat.triggerAttackRelease(880, '16n', `+${half}`)
      hiHat.triggerAttackRelease(880, '16n', `+${half + quarter}`)
      bassDrum.triggerAttackRelease(55, '8n', `+${half + quarter + eigth}`)

      //Bassline
      bass.triggerAttackRelease(rootTone / 2, '8n')
      bass.triggerAttackRelease(rootTone / 2, '8n', `+${quarter}`)
      chord()
    } else if ((counter + 1) % 2 === 1) {
      //Percussion line//
      bassDrum.triggerAttackRelease(55, '8n')
      bassDrum.triggerAttackRelease(55, '8n', `+${quarter}`)
      hiHat.triggerAttackRelease(880, '16n', `+${quarter}`)
      snareDrum.triggerAttackRelease('16n', `+${half}`)
      hiHat.triggerAttackRelease(880, '16n', `+${half}`)
      crash.triggerAttackRelease(220, '8n', `+${half}`)
      hiHat.triggerAttackRelease(880, '16n', `+${half + quarter}`)
      snareDrum.triggerAttackRelease('16n', `+${half + eigth}`)

      //Bassline
      bass.triggerAttackRelease(rootTone / 2, '8n')
      bass.triggerAttackRelease(rootTone / 2, '8n', `+${quarter}`)
      chord()
    }
  }

  //Plays a windchime simulation with minimalistic beat accompaniment//
  const ambientChimes = function (time) {
    masterVolume = 0.5
    gain.gain.rampTo(masterVolume, 1)
    setBeatConductor(
      parseInt(Tone.Transport.position.split(':')[0]) % unanswer.notes.length
    )
    counter = parseInt(Tone.Transport.position.split(':')[0] % unanswer.notes.length)
    rootTone = unanswer.notes[counter]
    let palette = generatePalette(unanswer.notes[counter])
    bassDrum.triggerAttackRelease('A2', '8n')
    bassDrum.triggerAttackRelease('A2', '8n', time + half)
    // for (let i = 0; i < palette.length; i++) {
    //   let rngTone = Math.floor(Math.random() * palette.length)
    //   let silenceController = Math.floor(Math.random() * 10)
    //   if (silenceController !== 3 && silenceController !== 5 && silenceController !== 7) {
    //       chime.triggerAttackRelease(palette[rngTone], '2n', `+${(measure / palette.length) * i}`)
    //   }
    // }
    if (counter % 3 === 0) {
      bass.triggerAttackRelease(rootTone/2, '4n')
      bass.triggerAttackRelease((rootTone/2)*(A**3), '4n', `+${quarter}`)
      bass.triggerAttackRelease((rootTone/2)*(A**5), '4n', `+${half}`)
    } else {
      bass.triggerAttackRelease(rootTone, '4n')
      bass.triggerAttackRelease((rootTone)*(A**3), '4n', `+${quarter}`)
      bass.triggerAttackRelease((rootTone)*(A**5), '4n', `+${half}`)
    }
    palette.forEach((note, i) => {
      chime.triggerAttackRelease(note, '2n', `+${(measure / palette.length) * i}`)
    })
  }

  //Stop playback and clear Transport values//
  const stopPlay = function () {
    //need to research this more
    Tone.Transport.cancel()
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
      phrase
        .split('')
        .map(l => l.charCodeAt(0))
        .reduce((a, b) => a + b, 0) % 20
    return 90 + rawBpm
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
    }
  }

  //Logic to determine appropriate control panel display//
  if (playerReady) {
    controlPanel = 
      <div className='appear'>
        <button onClick={() => preBuild('ambient')}>Unanswer: ambient</button>
        <button onClick={() => preBuild('hip-hop')}>Unanswer: beats</button>
    </div>
  } else if (playing) {
    controlPanel = (
      <div className='appear'>
        <button onClick={stopPlay}>Stopz!</button>
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

  
  //Controller for blip rendering//
  const blipz = function () {
    console.log('blipz')
  }


  //----------App rendering----------//
  console.log(
    `  Playing: ${playing}\n\n  Player ready: ${playerReady}\n\n  Color ranges:\n\n${unanswer.colors}\n\n  Notes matrix:\n\n${unanswer.notes}\n\n BPM: ${unanswer.bpm}\n\n Bar: ${Tone.Transport.position}`
  )
  return (
    <div className='App'>
      <Blipz effect={blipz} />
      <Aleph playing={playing} bar={beatConductor} colors={unanswer.colors} />
      <section className='control'>{controlPanel}</section>
      <Footer />
    </div>
  )
}

export default App
