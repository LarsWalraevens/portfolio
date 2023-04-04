import { create } from "zustand";

interface AppStore {
    disabledFade: boolean,
    animationSpeed: number;
    delaySpeed: number;
    setDisabledFade: (val: boolean) => void;
    fadeConditional: (val: number) => number;
}

export const useAppStore = create<AppStore>((set) => ({
    disabledFade: false,
    animationSpeed: 1,
    delaySpeed: 1,
    setDisabledFade(val: boolean) {
        set(() => ({
            disabledFade: val
        }))
    },
    fadeConditional(val: number) {
        return this.disabledFade ? 0 : val * 1.2 + 400;
    }
}));