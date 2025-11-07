import { useState } from 'react';
import { simStore } from '../../core/store/simStore';
import simulateNeotrons from '../../core/logic/simulation';
import './ParameterForm.css';

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

  return (
    <form onSubmit={handleSubmit} className="parameter-form">
      <div className="parameter-form__field">
        <label className="parameter-form__label">
          Steps: {steps}
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={steps}
          onChange={(e) => setSteps(Number(e.target.value))}
          className="parameter-form__range"
        />
        <div className="parameter-form__hint">
          Number of simulation steps (1-50)
        </div>
      </div>

      <div className="parameter-form__field">
        <label className="parameter-form__label">
          Keep Probability: {keepProb.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={keepProb}
          onChange={(e) => setKeepProb(Number(e.target.value))}
          className="parameter-form__range"
        />
        <div className="parameter-form__hint">
          Probability neutron stays (0.0-1.0)
        </div>
      </div>

      <div className="parameter-form__field">
        <label className="parameter-form__label">
          Leave Probability: {leaveProb.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={leaveProb}
          onChange={(e) => setLeaveProb(Number(e.target.value))}
          className="parameter-form__range"
        />
        <div className="parameter-form__hint">
          Probability neutron leaves (0.0-1.0)
        </div>
      </div>

      <div className="parameter-form__field">
        <label className="parameter-form__label">
          Fusion Power 3 Probability: {fusionPower3Prob.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={fusionPower3Prob}
          onChange={(e) => setFusionPower3Prob(Number(e.target.value))}
          className="parameter-form__range"
        />
        <div className="parameter-form__hint">
          Probability fusion creates 3 vs 2 neutrons
        </div>
      </div>

      <div className="parameter-form__probability-summary">
        <strong>Total Probability:</strong> {(keepProb + leaveProb).toFixed(2)} + {(1 - keepProb - leaveProb).toFixed(2)} (fusion) = 1.00
      </div>

      <button
        type="submit"
        disabled={isRunning}
        className="parameter-form__submit-button"
      >
        {isRunning ? "🔄 Running..." : "🚀 Run Simulation"}
      </button>
    </form>
  );
}
