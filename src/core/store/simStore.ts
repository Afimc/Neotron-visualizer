import { create } from "zustand";
import type { IParams, IResult, ISimStore } from "../types/types";

export const simStore = create<ISimStore>()((set) => ({
    result:  null,
    inputParams: {
        steps: 20,
        keepProb: 40,
        leaveProb: 20,
        fusionPower3Prob: 40,
    },

    setResult: (r: IResult) => set({ result: r }),
    setInputParams: (partial: Partial<IParams>) =>
    set((s) => ({ inputParams: { ...s.inputParams, ...partial } })),
}));

