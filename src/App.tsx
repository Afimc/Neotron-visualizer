
import './App.css'
import ControlsPanel from './components/ControlsPanel/ControlsPanel'
import NeotronField from './components/NeotronSimulator/NeotronSimulator'
import simulateNeotrons from './core/logic/simulation'
import {simStore} from './core/store/simStore'
import type { IResult } from './core/types/types'


function App() {

  const setResult = simStore((state) => state.setResult)
  const { inputParams } = simStore.getState();

  const handleClick = () => {
    const res: IResult = simulateNeotrons({
  steps: inputParams.steps,
  keepProb: inputParams.keepProb / 100,
  leaveProb: inputParams.leaveProb / 100,
  fusionPower3Prob: inputParams.fusionPower3Prob / 100,
})
    setResult(res)
  }

  return (
    <div className="App">
      <ControlsPanel />
      <NeotronField />
      <button className="btn btn-primary" onClick={handleClick}>run</button>
    </div>
  )
}

export default App
