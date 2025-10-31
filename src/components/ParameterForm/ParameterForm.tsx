import { useState } from 'react';
import { simStore } from '../../core/store/simStore';
import simulateNeotrons from '../../core/logic/simulation';

export default function ParameterForm() {
  const [steps, setSteps] = useState(10);
  const [keepProb, setKeepProb] = useState(0.3);
  const [leaveProb, setLeaveProb] = useState(0.3);
  const [fusionPower3Prob, setFusionPower3Prob] = useState(0.5);
  const [isRunning, setIsRunning] = useState(false);

  const setResult = simStore((s: any) => s.setResult);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);

    // Simulate delay for better UX
    setTimeout(() => {
      const result = simulateNeotrons({
        steps,
        keepProb,
        leaveProb,
        fusionPower3Prob
      });
      
      setResult(result);
      setIsRunning(false);
    }, 100);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "white",
    transition: "border-color 0.2s ease"
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px"
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={labelStyle}>
          Steps: {steps}
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={steps}
          onChange={(e) => setSteps(Number(e.target.value))}
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "3px",
            background: "#e5e7eb",
            outline: "none"
          }}
        />
        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
          Number of simulation steps (1-50)
        </div>
      </div>

      <div>
        <label style={labelStyle}>
          Keep Probability: {keepProb.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={keepProb}
          onChange={(e) => setKeepProb(Number(e.target.value))}
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "3px",
            background: "#e5e7eb",
            outline: "none"
          }}
        />
        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
          Probability neutron stays (0.0-1.0)
        </div>
      </div>

      <div>
        <label style={labelStyle}>
          Leave Probability: {leaveProb.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={leaveProb}
          onChange={(e) => setLeaveProb(Number(e.target.value))}
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "3px",
            background: "#e5e7eb",
            outline: "none"
          }}
        />
        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
          Probability neutron leaves (0.0-1.0)
        </div>
      </div>

      <div>
        <label style={labelStyle}>
          Fusion Power 3 Probability: {fusionPower3Prob.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={fusionPower3Prob}
          onChange={(e) => setFusionPower3Prob(Number(e.target.value))}
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "3px",
            background: "#e5e7eb",
            outline: "none"
          }}
        />
        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
          Probability fusion creates 3 vs 2 neutrons
        </div>
      </div>

      <div style={{
        padding: "16px",
        backgroundColor: "#f3f4f6",
        borderRadius: "8px",
        fontSize: "13px",
        color: "#6b7280"
      }}>
        <strong>Total Probability:</strong> {(keepProb + leaveProb).toFixed(2)} + {(1 - keepProb - leaveProb).toFixed(2)} (fusion) = 1.00
      </div>

      <button
        type="submit"
        disabled={isRunning}
        style={{
          padding: "12px 24px",
          backgroundColor: isRunning ? "#9ca3af" : "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: isRunning ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
        }}
      >
        {isRunning ? "🔄 Running..." : "🚀 Run Simulation"}
      </button>
    </form>
  );
}
