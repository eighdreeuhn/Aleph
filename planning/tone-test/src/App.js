import { useState, useEffect } from 'react'
import './App.css'
import * as Tone from 'tone'
import Blip from './Blip'
import Footer from './Components/Footer'

function App () {
  // const [synaesthetic, setSynaesthetic] = useState([])
  // const [timestamp, setTimestamp] = useState(null)
  const [phrase, setPhrase] = useState('')
  const [letter, setLetter] = useState('')

  //constants ofr calculating note frequencies with A2 as root
  const a = 2 ** (1 / 12)
  const root = 220

  let load = true
  let cycle
  let notes = []
  let counter

  const playBoi = new Tone.Compressor(-50, 5).toDestination()
  const poly = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      volume: 5,
      count: 3,
      spread: 40,
      type: 'sine'
    }
  }).connect(playBoi)

  const drumz = new Tone.MembraneSynth({
    oscillator: {
      type: 'sine'
    },
    attack: 0.1,
    sustain: 0.3,
    delay: 0.25,
    release: 0.1
  }).connect(playBoi)

  const bass = new Tone.Synth({
    oscillator: {
      type: 'triangle'
    }
  })

  const stopPlay = function () {
    Tone.Transport.stop()
  }

  const interpolateNotes = phrase => {
    console.log(phrase)
    return phrase.split('').map(l => root * a ** (l.charCodeAt(0) % 24))
  }

  const generatePalette = tone => {
    let palette = []
    for (let i = 0; i <= 4; i += 2) {
      if (i === 0) {
        palette.push(tone)
        palette.push(tone * a ** 3)
        palette.push(tone * a ** 5)
        palette.push(tone * a ** 7)
        palette.push(tone / 8)
        palette.push((tone / 8) * a ** 3)
        palette.push((tone / 8) * a ** 5)
        palette.push((tone / 8) * a ** 7)
      } else {
        palette.push(tone * i)
        palette.push(tone / i)
        palette.push(tone * i * a ** 3)
        palette.push((tone / i) * a ** 3)
        palette.push(tone * i * a ** 5)
        palette.push((tone / i) * a ** 5)
        palette.push(tone * i * a ** 7)
        palette.push((tone / i) * a ** 7)
      }
    }
    return palette.sort((a, b) => a - b)
  }

  const handlePhraseChange = function (e) {
    setPhrase(e.target.value)
  }

  const handleLetterChange = function (e) {
    if (e.target.value.length === 1) {
      setLetter(e.target.value)
    }
  }

  const handlePhraseSubmit = function (e) {
    e.preventDefault()
    notes = interpolateNotes(phrase)
    setPhrase('')
    cycle = new Tone.Loop(play, '1m')
    Tone.Transport.start()
    cycle.start()
  }
  const handleLetterSubmit = function (e) {
    e.preventDefault()
    const note = interpolateNotes(letter)
    setLetter('')
    playChord(note)
  }

  const play = time => {
    if (load === true) {
      counter = Tone.Transport.position.split(':')[0] % notes.length
      console.log(counter)
      let palette = generatePalette(notes[counter])
      drumz.triggerAttackRelease(22, '8n', time, 2)
      drumz.triggerAttackRelease(22, '8n', '+0.5', 2)
      drumz.triggerAttackRelease(22, '8n', '+1', 2)
      drumz.triggerAttackRelease('8n', '+1.5', 2)
      palette.forEach((note, i) => {
        poly.triggerAttackRelease(note, '4n', `+${(2 / palette.length) * i}`)
        // drumz.triggerAttackRelease('D1', 0.1, now + (2 * i + 1), 4)
        // poly.triggerAttackRelease(note, 1, now + (2 * i), 2)
        // poly.triggerAttackRelease(note * 8, 1, now + (2 * i), 2)
        // poly.triggerAttackRelease(note * 0.5, 1, now + (2 * i), 2)
        // poly.triggerAttackRelease(note * 0.25, 1, now + (2 * i), 2)
        // poly.triggerAttackRelease(note * (a ** 19), 1, now + (2 * i), 2)
      })
      // drumz.triggerAttackRelease('A1', '16n', '+1')
    }
  }

  const playChord = note => {
    note = note[0]
    const poly = new Tone.PolySynth(Tone.FMSynth).connect(playBoi)
    const now = Tone.now()
    poly.triggerAttackRelease(note, 1, now, 2)
    poly.triggerAttackRelease(note * 8, 1, now, 2)
    poly.triggerAttackRelease(note * 0.5, 1, now, 2)
    poly.triggerAttackRelease(note * 0.25, 1, now, 2)
    poly.triggerAttackRelease(note * a ** 19, 1, now, 2)
  }

  return (
    <div className='App'>
      <section className='top'>
        <div className='aleph-container'>
          <svg
            style={{ color: 'white' }}
            className='aleph'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 5650 5800'
          >
            <path d='M3390 4000a4590 4590 0 0 1 188 255 1110 1110 0 0 1 124 263c20 73 16 265-8 368-18 77-66 178-100 210-27 26-90 35-114 17-12-10-20-35-27-80a960 960 0 0 0-96-320c-45-95-145-254-174-276L1213 2167l-150-155c-22 0-50 47-84 143a3350 3350 0 0 0-195 1133c-1 180 6 232 45 335a1800 1800 0 0 0 189 297l163 202a1720 1720 0 0 1 180 276 580 580 0 0 1 76 298 470 470 0 0 1-40 183c-50 102-143 170-295 216-115 34-206 40-583 40H166c-12-2-28-10-40-23-20-20-35-64-5-100 22-25 28-27 148-34l200-27c325-80 344-274 78-796l-170-365a980 980 0 0 1-73-407 1670 1670 0 0 1 40-393c87-370 283-775 370-920a660 660 0 0 0 37-65 1360 1360 0 0 1 58-94 490 490 0 0 0 58-108c0-18-17-56-28-65-3-3-182-222-196-238-280-317-450-558-512-728a850 850 0 0 1 30-524c42-88 74-120 120-127 30-4 44-1 56 10 17 17 18 20 36 130a900 900 0 0 0 88 279 1660 1660 0 0 0 215 317c6 7 36 40 65 75l1804 2078c148 175 152 178 172 153 10-14 16-40 40-216l227-1444a430 430 0 0 0 5-135c-5-17-50-72-108-132-180-186-260-290-317-410a500 500 0 0 1-50-255c0-202 33-327 107-405 35-37 50-46 76-46 37 0 75 33 85 74 14 60 72 162 275 493l160 236a4240 4240 0 0 0 244 244l92 97 40 50a320 320 0 0 1 24 34 560 560 0 0 1 100 325c10 240-58 442-163 485-24 10-32 10-53-5-30-20-38-40-47-112a830 830 0 0 0-163-371c-63-80-85-68-103 62l-242 1572c-5 137-1 172 20 194l424 502zm667 696c0-263 37-472 150-630 113-156 263-236 445-236s332 80 445 237 150 368 150 630c0 260-37 468-150 627a520 520 0 0 1-445 238c-183 0-332-80-445-237s-150-368-150-630zm217 0c0 350 33 570 100 665a320 320 0 0 0 279 142 300 300 0 0 0 294-170c56-113 84-326 84-638 0-350-33-572-100-666a320 320 0 0 0-277-141c-118 0-210 47-278 140-67 94-100 316-100 666' />
          </svg>
        </div>
        <div className='control-panel'>
          <form onSubmit={handlePhraseSubmit}>
            <label>
              <h3>
                Play many notes
                <input
                  type='text'
                  onChange={handlePhraseChange}
                  value={phrase}
                  placeholder='Un-ask your question as a phrase'
                ></input>
              </h3>
            </label>
          </form>
          <form onSubmit={handleLetterSubmit}>
            <label>
              <h3>
                Play a single chord
                <input
                  type='text'
                  onChange={handleLetterChange}
                  value={letter}
                  placeholder='Un-ask your question with a single letter'
                />
              </h3>
            </label>
          </form>
          <button onClick={stopPlay}>STOP</button>
        </div>
      </section>
      <Blip />
      <Footer/>
    </div>
  )
}

export default App
