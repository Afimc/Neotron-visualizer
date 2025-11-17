<div align="center">

# Neotron Visualizer

Interactive playground for experimenting with a simplified neutron chain reaction. Tune branching probabilities, run the Monte‑Carlo simulation, and watch every step unfold through Pixi.js animations and a detailed results dashboard.

</div>

---

## Features
- **Parameter driven simulation** – sliders for steps, keep/leave probabilities, and fusion bias ensure the three probabilities always normalize to 1.0.
- **Animated reactor view** – `src/components/NeotronSimulator/NeotronSimulator.tsx` uses Pixi.js to display particles travelling between stages, fusion bursts, and keeps/leave trajectories with play, pause, step, and speed controls.
- **Rich analytics panel** – `src/components/ResultDisplay/ResultDisplay.tsx` summarizes final population, average coefficient, total fusions, extinction step, and logs every iteration.
- **Single source of truth** – Zustand store (`src/core/store/simStore.ts`) keeps parameters and results in sync across form, simulator, and result views.
- **Typed simulation core** – `src/core/logic/simulation.ts` exposes a pure function that can be reused for headless/unit testing scenarios.

## Simulation model
Every simulation starts with a single “neotron” and iterates for the requested number of steps, or until extinction.

### Parameters
| Name | Range | Description |
| --- | --- | --- |
| `steps` | 1–50 (UI) | Number of iterations to run before stopping. |
| `keepProb` | 0.0–1.0 | Probability a neotron survives unchanged to the next step. |
| `leaveProb` | 0.0–1.0 | Probability a neotron leaves the system entirely. |
| `fusionPower3Prob` | 0.0–1.0 | When a fusion happens, probability it spawns 3 instead of 2 neotrons. |

The probability of “fusion” is automatically inferred as `1 - keepProb - leaveProb`. Each fusion event randomly chooses whether it produces 2 or 3 offspring using `fusionPower3Prob`.

### Outputs
- Step-by-step ledger (`IStepRecord[]`) with counts for kept, left, fusion-created particles, and the growth coefficient `C = end / start`.
- Summary data (`ISummary`) containing the final population, average coefficient across executed steps, total fusion count, and extinction step (if the population hits 0).
- Metadata with the original parameters, timestamp, and algorithm version for reproducibility.

## Tech stack
- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) for the SPA shell.
- [TypeScript](https://www.typescriptlang.org/) for type safety.
- [Pixi.js](https://pixijs.com/) for GPU-accelerated particle visualization.
- [Zustand](https://github.com/pmndrs/zustand) for lightweight global state management.
- [Framer Motion](https://www.framer.com/motion/) and custom CSS for subtle UI polish (see `src/App.css` and component styles).

## Getting started
```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173/ by default)
npm run dev

# Production build
npm run build

# Preview the production build locally
npm run preview

# Lint the codebase
npm run lint
```

> **Node version:** Vite 7 targets Node 18+. Node 20 LTS is recommended.

## Using the visualizer
1. Launch the dev server and open the app.
2. Adjust simulation sliders in the **Parameters** sidebar. The UI keeps the total probability budget at 1.00 so you always run valid scenarios.
3. Click **Run Simulation**. The result is stored in the shared Zustand store.
4. Use the **Simulator** controls to play through the recorded steps, scrub step-by-step, or change the playback speed. Fusion events and kept particles are color coded (see legend under the canvas).
5. Switch to the **Results** tab to inspect summary stats, parameter snapshots, and the step-by-step ledger.

Because the simulation is stochastic, re-running with the same parameters will produce different traces. Deterministic seeding is planned (the `seed` property already exists in `IParams`).

## Project structure
```
├── src
│   ├── App.tsx               # Tabs + layout
│   ├── App.css / index.css   # Global styling
│   ├── components
│   │   ├── ParameterForm/    # Slider-driven input form
│   │   ├── NeotronSimulator/ # Pixi.js canvas + playback UI
│   │   └── ResultDisplay/    # Summary + per-step ledger cards
│   └── core
│       ├── logic/simulation.ts # Monte-Carlo branching model
│       ├── store/simStore.ts   # Zustand store definition
│       └── types/types.ts      # Shared DTOs
└── vite.config.ts / tsconfig*.json
```

## Roadmap ideas
1. Add deterministic seeding + ability to export/import runs.
2. Surface the probability chart (e.g., Recharts) for coefficient vs. step.
3. Persist recent simulations in localStorage for quick comparisons.
4. Package the simulator core as a reusable npm module for other clients.

## License

