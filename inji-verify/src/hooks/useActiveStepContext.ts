import {createContext, useContext} from "react";

let activeStep: number = 0;
const setActiveStep = (newValue: number) => {
    activeStep = newValue;
}
const getActiveStep = () => activeStep;
export const ActiveStepContext = createContext({getActiveStep, setActiveStep});
export const useActiveStepContext = () => useContext(ActiveStepContext);
