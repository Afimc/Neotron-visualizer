
import { simStore } from "../../core/store/simStore";
import "./ControlsPanel.css";

function ControlsPanel() {
  const inputParams = simStore((s) => s.inputParams);
  const setInputParams = simStore((s) => s.setInputParams);

  const fusionPct = Math.max(
    0,
    100 - inputParams.keepProb - inputParams.leaveProb
  );
  const invalid = inputParams.keepProb + inputParams.leaveProb > 100;


  return (
    <div className="controls_panel">
      <div className="controllers">
        <div className="control">
          <label>
            Steps: <strong>{inputParams.steps}</strong>
          </label>
          <input
            type="range"
            min={1}
            max={200}
            step={1}
            value={inputParams.steps}
            onChange={(e) => setInputParams({ steps: Number(e.target.value) })}
          />

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={inputParams.keepProb}
            onChange={(e) =>
              setInputParams({ keepProb: Number(e.target.value) })
            }
          />

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={inputParams.fusionPower3Prob}
            onChange={(e) =>
              setInputParams({ fusionPower3Prob: Number(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="meta">
        <span>Leave %: {inputParams.leaveProb}</span>
        <span>Fusion % (auto): {fusionPct}</span>
        {invalid && <span className="error">Keep% + Leave% must be ≤ 100</span>}
      </div>
    </div>
  );
}

export default ControlsPanel;
