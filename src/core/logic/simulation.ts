import type { IParams, IResult, IStepRecord } from "../types/types";


function simulateNeotrons(params:IParams): IResult {
  const { steps, keepProb, leaveProb, fusionPower3Prob } = params;
  console.log(`Starting simulation with params: steps=${steps}, keepProb=${keepProb}, leaveProb=${leaveProb}, fusionPower3Prob=${fusionPower3Prob}`);
  let neotrons = 1;
  const stepRecords: IStepRecord[] = [];
  const coefficients: number[] = [];

  for (let step = 1; step <= steps; step++) {
    const start = neotrons;
    let kept = 0;
    let left = 0;
    let createdByFusion = 0;
    const fusionEvents: number[] = [];

    for (let i = 0; i < start; i++) {
      const travelPropability = Math.random();

      if (travelPropability < keepProb) {
        kept += 1;
      } else if (travelPropability <keepProb + leaveProb) {
        left += 1;
      } else {
        const fusionpower = Math.random() < fusionPower3Prob ? 3 : 2;
        createdByFusion += fusionpower;
        fusionEvents.push(fusionpower);
      }
    }

    neotrons = kept + createdByFusion;
    const C = start > 0 ? neotrons / start : 0;
    coefficients.push(C);

    stepRecords.push({
      step,
      start,
      kept,
      left,
      createdByFusion,
      fusions: fusionEvents,
      end: neotrons,
      coef: C,  
    });

    console.log(
      `Step ${step}: start=${start}, kept=${kept}, left=${left}, ` +
        `fusions=${fusionEvents.length} -> [${fusionEvents.join(", ")}], ` +
        `createdByFusion=${createdByFusion}, C=${C.toFixed(2)}, end=${neotrons}`
    );

    if (neotrons === 0) break;
  }

  const avgC =
    coefficients.length > 0
      ? coefficients.reduce((a, b) => a + b, 0) / coefficients.length
      : 0;

  const extinctionStep =
    stepRecords.length > 0 && stepRecords[stepRecords.length - 1].end === 0
      ? stepRecords.length
      : null;

  const result: IResult = {
    meta: {
      params: {
        steps,
        keepProb,
        leaveProb,
        fusionPower3Prob,
      },
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    },
    steps: stepRecords,
    summary: {
      final: neotrons,
      avgCoef: avgC,
      stepsCount: stepRecords.length,
      totalFusions: stepRecords.reduce((a, s) => a + s.fusions.length, 0),
      extinctionStep,
    },
  };
  return result;
}

export default simulateNeotrons;