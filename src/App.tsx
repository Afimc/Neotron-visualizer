import { useState } from 'react'
import ParameterForm from './components/ParameterForm/ParameterForm'
import NeotronField from './components/NeotronSimulator/NeotronSimulator'
import ResultDisplay from './components/ResultDisplay/ResultDisplay'
import { simStore } from './core/store/simStore'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState<'simulation' | 'results'>('simulation')
  const result = simStore((s: any) => s.result)

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-content">
          <h1 className="app__title">
            Neotron Visualizer
          </h1>
          
          <div className="app__tabs">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`app__tab-button ${activeTab === 'simulation' ? 'app__tab-button--active' : ''}`}
            >
              🔬 Simulation
            </button>
            <button
              onClick={() => setActiveTab('results')}
              disabled={!result}
              className={`app__tab-button ${activeTab === 'results' ? 'app__tab-button--active' : ''}`}
            >
              📊 Results
            </button>
          </div>
        </div>
      </header>

      <main className={`app__main ${activeTab === 'simulation' ? 'app__main--simulation' : 'app__main--results'}`}>
        {activeTab === 'simulation' && (
          <aside className="app__sidebar">
            <h2 className="app__sidebar-title">
              ⚙️ Parameters
            </h2>
            <ParameterForm />
          </aside>
        )}

        <section className="app__content">
          <div className={`app__content-wrapper ${activeTab === 'simulation' ? '' : 'app__content-wrapper--hidden'}`}>
            <NeotronField />
          </div>
          
          {activeTab === 'results' && (
            <div className="app__results">
              <h2 className="app__results-title">
                📈 Simulation Results
              </h2>
              <ResultDisplay />
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
