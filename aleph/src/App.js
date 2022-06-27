import { useState, useEffect} from 'react'
import Aleph from './Components/Aleph';
import './App.css';

function App() {

  const [unsearch, setUnsearch] = useState('')

  return (
    <div className="App">
      <Aleph />
    </div>
  );
}

export default App;
