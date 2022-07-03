import { useState, useEffect } from 'react'
import * as Tone from 'tone'
import Windchime from './Components/Windchime'
import Aleph from './Components/Aleph'
import SearchForm from './Components/SearchForm'
import Footer from './Components/Footer'
import './App.css'
import { PolySynth } from 'tone' 

//----------Global constants--------//
let masterVolume = 1
const A = 2 ** (1 / 12)
const ROOT = 55
let cycle
let rootTone
let measure
let bpm
let wave
let buffer

function App () {

 
  console.clear() // ==> handy trick I picked up from a YouTuber :)

  //----------Wiring network----------//

  const reverb = new Tone.Reverb({
    wet: 0.5
  }).toDestination()
  const gain = new Tone.Gain(masterVolume).connect(reverb)
  // const compressor = new Tone.Compressor().toDestination()
  // const phaser = new Tone.Phaser()
  // const lowPass = new Tone.LowpassCombFilter()
  // const filter = new Tone.AutoFilter()

  //----------Instruments----------//

  // const bassDrum = new Tone.MembraneSynth({
  //   oscillator: {
  //     type: 'sine'
  //   },
  //   attack: 0.1,
  //   sustain: 0.3,
  //   delay: 0.25,
  //   release: 0.1
  // })

  // const snareDrum = new Tone.NoiseSynth({
  //   volume: 3,
  //   noise: {
  //     type: 'white',
  //     playbackRate: 3
  //   },
  //   envelope: {
  //     attack: 0.01,
  //     decay: 0.2,
  //     sustain: 0.2,
  //     release: 0.1
  //   }
  // })

  // const hiHat = new Tone.MetalSynth({
  //   envelope: {
  //     attack: 0.1,
  //     sustain: 0.1,
  //     delay: 0.3,
  //     release: 0.2
  //   }
  // })

  // const bass = new Tone.Synth({
  //   oscillator: {
  //     type: 'sine'
  //   }
  // })

  // const crash = new Tone.MetalSynth({
  //   frequency: 500,
  //   envelope: {
  //     attack: 0.1,
  //     sustain: 0.25,
  //     delay: 0.3
  //   },
  //   harmonicity: 4
  // })

  // const harmonizer = new Tone.PolySynth(Tone.FMSynth)

  // const mainVoice = new Tone.PolySynth(Tone.Synth)

  const chime = new Tone.PolySynth(Tone.Synth).connect(gain)

  //----------State & global variables----------//

  const [instrument, setInstrument] = useState(
    {
        synth: chime,
        key: 440,
        duration: '4n'
    })
  // const [unsearch, setUnsearch] = useState('')
  // const [unanswer, setUnanswer] = useState({})
  // const [playerReady, setPlayerReady] = useState(false)
  // const [playing, setPlaying] = useState(false)
  // const [beatConductor, setBeatConductor] = useState(0)
  // let controlPanel
  // let counter = 0

  //----------main functions----------//
  console.log(instrument)

  //Hanfler for changing synth types//
  //discards the old synth and creates an new PolySynth based on choice and connects to gain//
  const handleSynthChange = function (e) {
    instrument.synth.disconnect()
    instrument.synth.dispose()
    let copy = { ...instrument }
    const newSynth = new Tone.PolySynth(Tone[e.target.value]).connect(gain)
    copy.synth = newSynth
    setInstrument(copy)
  }
  
  //Hanfler for changing durations//
  const handleDurationChange = function (e) {
    let copy = { ...instrument }
    copy.duration = e.target.value
    setInstrument(copy)
  }
  
  //Hanfler for changing key//
  const handleKeyChange = function (e) {
    let copy = { ...instrument }
    copy.key = e.target.value
    setInstrument(copy)
  }

  //test//
  const handleTest = function () {
    instrument.synth.triggerAttackRelease(
      `${instrument.key}`,
      instrument.duration
    )
  }

  //takes the current key and returns a range of notes within the root's context//
  const generatePalette = tone => {
    let palette = []
    for (let i = 0; i <= 4; i += 2) {
      if (i === 0) {
        palette.push(tone)
        palette.push(tone * A ** 3)
        palette.push(tone * A ** 5)
        palette.push(tone * A ** 7)
        palette.push(tone / 8)
        palette.push((tone / 8) * A ** 3)
        palette.push((tone / 8) * A ** 5)
        palette.push((tone / 8) * A ** 7)
      } else {
        palette.push(tone * i)
        palette.push(tone / i)
        palette.push(tone * i * A ** 3)
        palette.push((tone / i) * A ** 3)
        palette.push(tone * i * A ** 5)
        palette.push((tone / i) * A ** 5)
        palette.push(tone * i * A ** 7)
        palette.push((tone / i) * A ** 7)
      }
    }
    return palette.sort()
  }

  //Set-up for the loop and starts the main Transport//
  //Plays a windchime simulation with minimalistic beat accompaniment//
  const ambientChimes = function () {
    // console.log(time)
    // setBeatConductor(
    //   parseInt(Tone.Transport.position.split(':')[0]) % unanswer.notes.length
    // )
    // counter = parseInt(
    //   Tone.Transport.position.split(':')[0] % unanswer.notes.length
    // )
    // rootTone = unanswer.notes[counter]
    let palette = generatePalette(instrument.key)
    for (const i in palette) {
      instrument.synth.triggerAttackRelease(
        palette[i],
        instrument.duration,
        `+${(1 / palette.length) * i}`,
      )
    }
  }
  // const preBuild = function () {
  //   wave = new Tone.Waveform()
  //   buffer = chime.connect(compressor)
  //   // bass.chain(phaser, compressor, gain)
  //   // bassDrum.chain(lowPass, compressor, gain)
  //   setPlaying(true)
  //   setPlayerReady(false)
  //   measure = 60 / (unanswer.bpm / 4)
  //   cycle = new Tone.Loop(ambientChimes, '1m')
  //   Tone.Transport.start()
  //   cycle.start()
  // }

  //Creates a range of playble notes based on the root tone passed as argument//
  //

  //Strikes a major chord
  // const chord = function () {
  //   mainVoice.triggerAttackRelease(rootTone / 2, '2n')
  //   mainVoice.triggerAttackRelease(rootTone / 4, '2n')
  //   mainVoice.triggerAttackRelease(rootTone / 8, '2n')
  //   mainVoice.triggerAttackRelease(rootTone, '2n')
  //   mainVoice.triggerAttackRelease(rootTone * A ** 7, '2n')
  //   mainVoice.triggerAttackRelease(rootTone * A ** 4, '2n')
  // }

  // const arpeggiator = function () {}

  //Main player function//
  // const hipHopBeat = function (time) {
  // gain.gain.rampTo(masterVolume, 0.25)
  // //Get an index from the current measure relative to the total number of notes//
  // setBeatConductor(
  //   parseInt(Tone.Transport.position.split(':')[0]) % unanswer.notes.length
  // )
  // counter =
  //   parseInt(Tone.Transport.position.split(':')[0]) % unanswer.notes.length
  // console.log(
  //   `Current counter: ${counter}\n\n  Current time: ${time}\n\n Current Transport position: ${Tone.Transport.position}\n\n Measure duration: ${measure}`
  // )
  // rootTone = unanswer.notes[counter]
  // if ((counter + 1) % 2 === 0) {
  //Percussion line//
  // bassDrum.triggerAttackRelease(55, '8n')
  // bassDrum.triggerAttackRelease(55, '8n', `+${quarter}`)
  // hiHat.triggerAttackRelease(880, '16n', `+${quarter}`)
  // snareDrum.triggerAttackRelease('16n', `+${half}`)
  // hiHat.triggerAttackRelease(880, '16n', `+${half}`)
  // hiHat.triggerAttackRelease(880, '16n', `+${half + quarter}`)
  // bassDrum.triggerAttackRelease(55, '8n', `+${half + quarter + eigth}`)
  //Bassline
  // bass.triggerAttackRelease(rootTone / 2, '8n')
  // bass.triggerAttackRelease(rootTone / 2, '8n', `+${quarter}`)
  // chord()
  // } else if ((counter + 1) % 2 === 1) {
  //   //Percussion line//
  //   bassDrum.triggerAttackRelease(55, '8n')
  //   bassDrum.triggerAttackRelease(55, '8n', `+${quarter}`)
  //   hiHat.triggerAttackRelease(880, '16n', `+${quarter}`)
  //   snareDrum.triggerAttackRelease('16n', `+${half}`)
  //   hiHat.triggerAttackRelease(880, '16n', `+${half}`)
  //   crash.triggerAttackRelease(220, '8n', `+${half}`)
  //   hiHat.triggerAttackRelease(880, '16n', `+${half + quarter}`)
  //   snareDrum.triggerAttackRelease('16n', `+${half + eigth}`)
  //   //Bassline
  //   bass.triggerAttackRelease(rootTone / 2, '8n')
  //   bass.triggerAttackRelease(rootTone / 2, '8n', `+${quarter}`)
  //   chord()
  // }

  //Stop playback and clear Transport values//
  // const stopPlay = function () {
  //   //need to research this more
  //   Tone.Transport.stop()
  //   Tone.Transport.cancel()
  //   cycle.dispose()
  //   setPlaying(false)
  // }

  //Ramp up the bpm of the main loop//
  // const rampUp = function () {
  //   unanswer.bpm += 5
  //   Tone.Transport.bpm.linearRampTo(unanswer.bpm, 1)
  // }

  //Ramp dowm the bpm of the main loop//
  // const rampDown = function () {
  //   unanswer.bpm -= 5
  //   Tone.Transport.bpm.linearRampTo(unanswer.bpm, 1)
  // }

  //Increment the master volume//
  // const volUp = function () {
  //   masterVolume = Math.abs((masterVolume += 0.1))
  // }

  //Decrement the master volume//
  // const VolDown = function () {
  //   masterVolume = Math.abs((masterVolume -= 0.1))
  // }

  //Hashing function for transforming character code into wavelength (hertz)//
  //Converts each letter into its character code modulus 24 (two octaves of half-tones) and applies
  //the function: f(n) = f(0) * A^(n) (hz)
  // const interpolateNotes = phrase =>
  //   phrase.split('').map(l => ROOT * A ** (l.charCodeAt(0) % 36))

  //Hashing function for transforming character codes into colors based on wavelength//
  //This is a pretty crazy way of accomplishing this, and I suspect that there's//
  //a more elegant way of doing it using angles and the color wheel, but I've//
  //already wasted enough time on this as it is//
  // const extractColors = phrase => {
  //   return phrase
  //     .split('')
  //     .map(l => l.charCodeAt(0))
  //     .map(c => [
  //       Math.trunc(Math.abs(Math.sin(c)) * 255),
  //       Math.trunc(Math.abs(Math.cos(c)) * 255),
  //       Math.trunc(Math.abs(Math.floor(Math.tan(c)) - Math.tan(c)) * 255),
  //       Math.abs(
  //         Math.floor(Math.abs(Math.atan(c) ** Math.sin(c))) -
  //           Math.abs(Math.atan(c) ** Math.sin(c))
  //       )
  //     ])
  // }

  //Hashing function to distill inherent beats per minute from a string//
  // const extractBPM = phrase => {
  //   let rawBpm =
  //     phrase
  //       .split('')
  //       .map(l => l.charCodeAt(0))
  //       .reduce((a, b) => a + b, 0) % 20
  //   return 90 + rawBpm
  // }

  //Search field change handler//
  // const handlePhraseChange = e => setUnsearch(e.target.value)

  //Search field submit handler//
  // const handlePhraseSubmit = e => {
  //   e.preventDefault()
  //   if (unsearch.length !== 0) {
  //     const notes = interpolateNotes(unsearch)
  //     const colors = extractColors(unsearch)
  //     const bpm = extractBPM(unsearch)
  //     let unanswerCopy = { ...unanswer }
  //     unanswerCopy.notes = notes
  //     unanswerCopy.colors = colors
  //     unanswerCopy.bpm = bpm
  //     setUnanswer(unanswerCopy)
  //     setUnsearch('')
  //     setPlayerReady(true)
  //   }
  // }

  //Logic to determine appropriate control panel display//
  // if (playerReady) {
  //   controlPanel = (
  //     <div className='appear'>
  //       <button onClick={preBuild}>Unanswer: ambient</button>
  //     </div>
  //   )
  // } else if (playing) {
  //   controlPanel = (
  //     <div className='appear'>
  //       <button onClick={stopPlay}>Stopz!</button>
  //       <button onClick={volUp}>Loudz!</button>
  //       <button onClick={VolDown}>Shhhz!!</button>
  //     </div>
  //   )
  // } else {
  // controlPanel = (
  //   <SearchForm
  //     unsearch={unsearch}
  //     utils={[handlePhraseChange, handlePhraseSubmit]}
  //   />
  // )
  // }

  //Controller for blip rendering//
  // const blipz = function () {}

  //----------App rendering----------//
  // console.log(
  //   `  Playing: ${playing}\n\n  Player ready: ${playerReady}\n\n  Color ranges:\n\n${unanswer.colors}\n\n  Notes matrix:\n\n${unanswer.notes}\n\n BPM: ${unanswer.bpm}\n\n Bar: ${Tone.Transport.position}`
  // )
  return (
    <div className='App'>
      <div className='about'>
        <h4>
          This windchime simulation is the result of trying to learn the Tone.js
          library. I had another project in mind but quickly learned how much is
          built into the library. this is intended to instead act as a learning
          tool for all o0f the functionalities of the library itself.
        </h4>
      </div>
      <div className='controls'>
        <label>Synth Type </label>
        <select className='synths' onChange={handleSynthChange}>
          <option value='Synth'>Regular Synth</option>
          <option value='MonoSynth'>Mono Synth</option>
          <option value='DuoSynth'>Duo Synth</option>
          <option value='AMSynth'>AM Synth</option>
          <option value='FMSynth'>FM Synth</option>
          <option value='PluckSynth'>Pluck Synth</option>
          <option value='MembraneSynth'>Membrane Synth</option>
          <option value='MetalSynth'>Metal Synth</option>
        </select>
        <label>Note duration </label>
        <select className='duration' onChange={handleDurationChange}>
          <option value='4n'>quarter</option>
          <option value='1m'>whole</option>
          <option value='2n'>half</option>
          <option value='8n'>8th</option>
          <option value='16n'>16th</option>
          <option value='32n'>32nd</option>
        </select>
        <label>Key</label>
        <select className='key' onChange={handleKeyChange}>
          <option value={440.00}>A</option>
          <option value={466.16}>A#</option>
          <option value={246.94	}>B</option>
          <option value={261.63}>C</option>
          <option value={277.18}>C#</option>
          <option value={293.66}>D</option>
          <option value={311.13}>D#</option>
          <option value={329.63}>E</option>
          <option value={349.23}>F</option>
          <option value={369.99}>F#</option>
          <option value={392.00}>G</option>
          <option value={415.30}>G#</option>
        </select>
        <button className='play/pause' onClick={handleTest}>
          Chimes
        </button>
        <button className='chimes-player' onClick={ambientChimes}>
          Play
        </button>
      </div>
      {/* <section className='top'>
        <div className='aleph-container'>
          <svg
            className='aleph'
            style={{
              fill: playing ? `rgb(${unanswer.colors[beatConductor]})` : 'white'
            }}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 5650 5800'
          >
            <path d='M3390 4000a4590 4590 0 0 1 188 255 1110 1110 0 0 1 124 263c20 73 16 265-8 368-18 77-66 178-100 210-27 26-90 35-114 17-12-10-20-35-27-80a960 960 0 0 0-96-320c-45-95-145-254-174-276L1213 2167l-150-155c-22 0-50 47-84 143a3350 3350 0 0 0-195 1133c-1 180 6 232 45 335a1800 1800 0 0 0 189 297l163 202a1720 1720 0 0 1 180 276 580 580 0 0 1 76 298 470 470 0 0 1-40 183c-50 102-143 170-295 216-115 34-206 40-583 40H166c-12-2-28-10-40-23-20-20-35-64-5-100 22-25 28-27 148-34l200-27c325-80 344-274 78-796l-170-365a980 980 0 0 1-73-407 1670 1670 0 0 1 40-393c87-370 283-775 370-920a660 660 0 0 0 37-65 1360 1360 0 0 1 58-94 490 490 0 0 0 58-108c0-18-17-56-28-65-3-3-182-222-196-238-280-317-450-558-512-728a850 850 0 0 1 30-524c42-88 74-120 120-127 30-4 44-1 56 10 17 17 18 20 36 130a900 900 0 0 0 88 279 1660 1660 0 0 0 215 317c6 7 36 40 65 75l1804 2078c148 175 152 178 172 153 10-14 16-40 40-216l227-1444a430 430 0 0 0 5-135c-5-17-50-72-108-132-180-186-260-290-317-410a500 500 0 0 1-50-255c0-202 33-327 107-405 35-37 50-46 76-46 37 0 75 33 85 74 14 60 72 162 275 493l160 236a4240 4240 0 0 0 244 244l92 97 40 50a320 320 0 0 1 24 34 560 560 0 0 1 100 325c10 240-58 442-163 485-24 10-32 10-53-5-30-20-38-40-47-112a830 830 0 0 0-163-371c-63-80-85-68-103 62l-242 1572c-5 137-1 172 20 194l424 502zm667 696c0-263 37-472 150-630 113-156 263-236 445-236s332 80 445 237 150 368 150 630c0 260-37 468-150 627a520 520 0 0 1-445 238c-183 0-332-80-445-237s-150-368-150-630zm217 0c0 350 33 570 100 665a320 320 0 0 0 279 142 300 300 0 0 0 294-170c56-113 84-326 84-638 0-350-33-572-100-666a320 320 0 0 0-277-141c-118 0-210 47-278 140-67 94-100 316-100 666' />
          </svg>
        </div>
        <section className='control'>{controlPanel}</section>
      </section>
      <Blipz /> */}
      <Windchime/>
      <Footer />
    </div>
  )
}

export default App
