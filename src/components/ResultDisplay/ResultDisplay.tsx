import { simStore } from '../../core/store/simStore';
import './ResultDisplay.css';

export default function ResultDisplay() {
  const result = simStore((s: any) => s.result);

  if (!result) {
    return (
      <div className="result-display__no-data">
        <h3>No simulation results yet</h3>
        <p>Run a simulation to see the results here.</p>
      </div>
    );
  }

  return (
    <div className="result-display">
      <div className="result-display__card">
        <h3 className="result-display__card-title">📊 Summary</h3>
        <div className="result-display__summary-grid">
          <div>
            <div className="result-display__stat-label">Final Neutrons</div>
            <div className="result-display__stat-value">{result.summary.final}</div>
          </div>
          <div>
            <div className="result-display__stat-label">Average Coefficient</div>
            <div className="result-display__stat-value">{result.summary.avgCoef.toFixed(3)}</div>
          </div>
          <div>
            <div className="result-display__stat-label">Steps Completed</div>
            <div className="result-display__stat-value">{result.summary.stepsCount}</div>
          </div>
          <div>
            <div className="result-display__stat-label">Total Fusions</div>
            <div className="result-display__stat-value">{result.summary.totalFusions}</div>
          </div>
        </div>
        {result.summary.extinctionStep && (
          <div className="result-display__extinction">
            <strong className="result-display__extinction-text">
              Extinction at step {result.summary.extinctionStep}
            </strong>
          </div>
        )}
      </div>

      <div className="result-display__card">
        <h3 className="result-display__card-title">⚙️ Parameters Used</h3>
        <div className="result-display__params-grid">
          <div>
            <div className="result-display__stat-label">Steps</div>
            <div className="result-display__param-value">{result.meta.params.steps}</div>
          </div>
          <div>
            <div className="result-display__stat-label">Keep Prob</div>
            <div className="result-display__param-value">{result.meta.params.keepProb.toFixed(2)}</div>
          </div>
          <div>
            <div className="result-display__stat-label">Leave Prob</div>
            <div className="result-display__param-value">{result.meta.params.leaveProb.toFixed(2)}</div>
          </div>
          <div>
            <div className="result-display__stat-label">Fusion3 Prob</div>
            <div className="result-display__param-value">{result.meta.params.fusionPower3Prob.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="result-display__card">
        <h3 className="result-display__card-title">📈 Step by Step</h3>
        <div className="result-display__steps-container">
          {result.steps.map((step: any) => (
            <div key={step.step} className="result-display__step">
              <div className="result-display__step-header">
                <strong className="result-display__step-title">Step {step.step}</strong>
                <span className="result-display__step-coef">
                  Coefficient: {step.coef.toFixed(3)}
                </span>
              </div>
              <div className="result-display__step-details">
                <div>
                  <span className="result-display__step-label">Start:</span>
                  <span className="result-display__step-value">{step.start}</span>
                </div>
                <div>
                  <span className="result-display__step-label">Kept:</span>
                  <span className="result-display__step-value result-display__step-value--kept">{step.kept}</span>
                </div>
                <div>
                  <span className="result-display__step-label">Left:</span>
                  <span className="result-display__step-value result-display__step-value--left">{step.left}</span>
                </div>
                <div>
                  <span className="result-display__step-label">Fused:</span>
                  <span className="result-display__step-value result-display__step-value--fused">{step.createdByFusion}</span>
                </div>
                <div>
                  <span className="result-display__step-label">End:</span>
                  <span className="result-display__step-value">{step.end}</span>
                </div>
              </div>
              {step.fusions.length > 0 && (
                <div className="result-display__fusions">
                  <span className="result-display__fusions-text">
                    Fusions: {step.fusions.join(', ')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="result-display__card">
        <h3 className="result-display__card-title">ℹ️ Metadata</h3>
        <div className="result-display__metadata">
          <div>Generated: {new Date(result.meta.timestamp).toLocaleString()}</div>
          <div>Version: {result.meta.version}</div>
        </div>
      </div>
    </div>
  );
}
