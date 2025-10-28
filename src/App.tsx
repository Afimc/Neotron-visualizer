
import './App.css'
import ControlsPanel from './components/ControlsPanel/ControlsPanel'
import NeotronField from './components/NeotronSimulator/NeotronSimulator'
import simulateNeotrons from './core/logic/simulation'
import {simStore} from './core/store/simStore'



function App() {



const handleRun = () => {
  const { inputParams } = simStore.getState();
  const res = simulateNeotrons({
    steps: inputParams.steps,
    keepProb: inputParams.keepProb / 100,
    leaveProb: inputParams.leaveProb / 100,
    fusionPower3Prob: inputParams.fusionPower3Prob / 100,
  });
  simStore.getState().setResult(res);
};


  return (
    <div className="App">
      <ControlsPanel />
      <NeotronField />
      <button className="btn btn-primary" onClick={handleRun}>run</button>
    </div>
  )
}

export default App
