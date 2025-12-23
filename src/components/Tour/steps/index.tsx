// src/components/Tour/steps/index.ts
import { Step } from "react-joyride";
import { homeSteps } from "./homeSteps";
import { chatSteps } from "./chatSteps";

interface TourSteps {
  home: Step[];
  chat:Step[];
}

export const ALL_STEPS: Step[] = [
  ...homeSteps,
  ...chatSteps,
];

export const HOME_COUNT = homeSteps.length;
export const TOTAL_STEPS = ALL_STEPS.length;
