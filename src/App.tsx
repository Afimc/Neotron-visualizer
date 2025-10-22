
import './App.css'
import ControlsPanel from './components/ControlsPanel/ControlsPanel'
import simulateNeotrons from './core/logic/simulation'
import {simStore} from './core/store/simStore'
import type { IResult } from './core/types/types'


function App() {
  
  const result = simStore((state) => state.result)
  const setResult = simStore((state) => state.setResult)
  const { inputParams } = simStore.getState();

  const handleClick = () => {
    console.log('Button clicked')
    const res: IResult = simulateNeotrons({
  steps: inputParams.steps,
  keepProb: inputParams.keepProb / 100,
  leaveProb: inputParams.leaveProb / 100,
  fusionPower3Prob: inputParams.fusionPower3Prob / 100,
})
    setResult(res)
    console.log('Simulation result set in store:', result)
  }

  return (
    <div className="App">
      <button className="btn btn-primary" onClick={handleClick}>run</button>
      <ControlsPanel />
    </div>
  )
}

export default App
