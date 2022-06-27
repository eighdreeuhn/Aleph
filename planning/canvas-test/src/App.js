import './App.css';
import Canvas from './Canvas';
import * as Canvas from 'canvas';

function App() {

  const state = {}

  return (
    <div className="App">
      <Canvas data={state}/>
    </div>
  );
}

export default App;
