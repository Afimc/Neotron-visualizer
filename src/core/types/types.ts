export interface IStepRecord {
    step: number;
    start: number;
    kept: number;
    left: number;
    createdByFusion: number;
    fusions: number[]; 
    end: number;
    coef: number;
}

export interface ISummary {
    final: number;
    avgCoef: number;
    stepsCount: number;
    totalFusions: number;
    extinctionStep: number | null;
}

export interface IParams {
    steps: number;
    keepProb: number;
    leaveProb: number;
    fusionPower3Prob: number;
    seed?: number;
}

export interface IMeta {
    params: IParams;
    timestamp: string;
    version: string;
}

export interface IResult {
    meta: IMeta;
    steps: IStepRecord[];
    summary: ISummary;
}

export interface ISimStore {
    result: IResult | null;
    inputParams: IParams;
    setResult: (r: IResult) => void;
    setInputParams: (p: Partial<IParams>) => void;
}