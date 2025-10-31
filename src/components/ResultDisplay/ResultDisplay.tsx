import { simStore } from '../../core/store/simStore';

export default function ResultDisplay() {
  const result = simStore((s: any) => s.result);

  if (!result) {
    return (
      <div style={{
        padding: "40px",
        textAlign: "center",
        color: "rgba(255, 255, 255, 0.7)"
      }}>
        <h3>No simulation results yet</h3>
        <p>Run a simulation to see the results here.</p>
      </div>
    );
  }

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.2)"
  };

  const stepStyle = {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "8px",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Summary */}
      <div style={cardStyle}>
        <h3 style={{ color: "white", margin: "0 0 16px 0" }}>📊 Summary</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <div>
            <div style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>Final Neutrons</div>
            <div style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>{result.summary.final}</div>
          </div>
          <div>
            <div style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>Average Coefficient</div>
            <div style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>{result.summary.avgCoef.toFixed(3)}</div>
          </div>
          <div>
            <div style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>Steps Completed</div>
            <div style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>{result.summary.stepsCount}</div>
          </div>
          <div>
            <div style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>Total Fusions</div>
            <div style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>{result.summary.totalFusions}</div>
          </div>
        </div>
        {result.summary.extinctionStep && (
          <div style={{
            marginTop: "16px",
            padding: "12px",
            background: "rgba(239, 68, 68, 0.2)",
            borderRadius: "8px",
            border: "1px solid rgba(239, 68, 68, 0.3)"
          }}>
            <strong style={{ color: "#fca5a5" }}>Extinction at step {result.summary.extinctionStep}</strong>
          </div>
        )}
      </div>

      {/* Parameters */}
      <div style={cardStyle}>
        <h3 style={{ color: "white", margin: "0 0 16px 0" }}>⚙️ Parameters Used</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
          <div>
            <div style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>Steps</div>
            <div style={{ color: "white", fontWeight: "600" }}>{result.meta.params.steps}</div>
          </div>
          <div>
            <div style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>Keep Prob</div>
            <div style={{ color: "white", fontWeight: "600" }}>{result.meta.params.keepProb.toFixed(2)}</div>
          </div>
          <div>
            <div style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>Leave Prob</div>
            <div style={{ color: "white", fontWeight: "600" }}>{result.meta.params.leaveProb.toFixed(2)}</div>
          </div>
          <div>
            <div style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>Fusion3 Prob</div>
            <div style={{ color: "white", fontWeight: "600" }}>{result.meta.params.fusionPower3Prob.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Step by Step Results */}
      <div style={cardStyle}>
        <h3 style={{ color: "white", margin: "0 0 16px 0" }}>📈 Step by Step</h3>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {result.steps.map((step: any) => (
            <div key={step.step} style={stepStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "white" }}>Step {step.step}</strong>
                <span style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>
                  Coefficient: {step.coef.toFixed(3)}
                </span>
              </div>
              <div style={{ 
                marginTop: "8px", 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", 
                gap: "8px",
                fontSize: "14px"
              }}>
                <div>
                  <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>Start:</span>
                  <span style={{ color: "white", fontWeight: "600", marginLeft: "4px" }}>{step.start}</span>
                </div>
                <div>
                  <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>Kept:</span>
                  <span style={{ color: "#60a5fa", fontWeight: "600", marginLeft: "4px" }}>{step.kept}</span>
                </div>
                <div>
                  <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>Left:</span>
                  <span style={{ color: "#fbbf24", fontWeight: "600", marginLeft: "4px" }}>{step.left}</span>
                </div>
                <div>
                  <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>Fused:</span>
                  <span style={{ color: "#34d399", fontWeight: "600", marginLeft: "4px" }}>{step.createdByFusion}</span>
                </div>
                <div>
                  <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>End:</span>
                  <span style={{ color: "white", fontWeight: "600", marginLeft: "4px" }}>{step.end}</span>
                </div>
              </div>
              {step.fusions.length > 0 && (
                <div style={{ marginTop: "8px" }}>
                  <span style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "12px" }}>
                    Fusions: {step.fusions.join(', ')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Metadata */}
      <div style={cardStyle}>
        <h3 style={{ color: "white", margin: "0 0 16px 0" }}>ℹ️ Metadata</h3>
        <div style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>
          <div>Generated: {new Date(result.meta.timestamp).toLocaleString()}</div>
          <div>Version: {result.meta.version}</div>
        </div>
      </div>
    </div>
  );
}
