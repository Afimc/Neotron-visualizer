import { useState } from 'react'
import ParameterForm from './components/ParameterForm/ParameterForm'
import NeotronField from './components/NeotronSimulator/NeotronSimulator'
import ResultDisplay from './components/ResultDisplay/ResultDisplay'
import { simStore } from './core/store/simStore'

function App() {
  const [activeTab, setActiveTab] = useState<'simulation' | 'results'>('simulation')
  const result = simStore((s: any) => s.result)

  const tabButtonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <header style={{
        background: "rgba(255, 255, 255, 0.95)",
        padding: "20px 24px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <h1 style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: "700",
            color: "#374151"
          }}>
            Neotron Visualizer
          </h1>
          
          <div style={{
            display: "flex",
            gap: "8px",
            padding: "4px",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            borderRadius: "12px"
          }}>
            <button
              onClick={() => setActiveTab('simulation')}
              style={{
                ...tabButtonStyle,
                backgroundColor: activeTab === 'simulation' ? "white" : "transparent",
                color: activeTab === 'simulation' ? "#374151" : "#6b7280",
                boxShadow: activeTab === 'simulation' ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none"
              }}
            >
              🔬 Simulation
            </button>
            <button
              onClick={() => setActiveTab('results')}
              disabled={!result}
              style={{
                ...tabButtonStyle,
                backgroundColor: activeTab === 'results' ? "white" : "transparent",
                color: activeTab === 'results' ? "#374151" : "#6b7280",
                boxShadow: activeTab === 'results' ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none",
                opacity: result ? 1 : 0.5,
                cursor: result ? "pointer" : "not-allowed"
              }}
            >
              📊 Results
            </button>
          </div>
        </div>
      </header>

      <main style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "24px",
        display: "grid",
        gridTemplateColumns: activeTab === 'simulation' ? "350px 1fr" : "1fr",
        gap: "24px",
        minHeight: "calc(100vh - 100px)"
      }}>
        {activeTab === 'simulation' && (
          <aside style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            height: "fit-content"
          }}>
            <h2 style={{
              margin: "0 0 20px 0",
              fontSize: "20px",
              fontWeight: "600",
              color: "#374151"
            }}>
              ⚙️ Parameters
            </h2>
            <ParameterForm />
          </aside>
        )}

        <section style={{
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          minHeight: "600px"
        }}>
          {/* Always render both components but hide the inactive one */}
          <div style={{ display: activeTab === 'simulation' ? 'block' : 'none', width: "100%", height: "100%" }}>
            <NeotronField />
          </div>
          
          {activeTab === 'results' && (
            <div style={{ padding: "24px" }}>
              <h2 style={{
                margin: "0 0 20px 0",
                fontSize: "24px",
                fontWeight: "600",
                color: "white"
              }}>
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
