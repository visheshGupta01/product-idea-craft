// src/components/Tour/steps/homeSteps.ts
import { Step } from "react-joyride";

export const homeSteps: Step[] = [
  {
    target: "#idea-box",
    content:
      "Welcome! This is where your journey starts. Describe the idea you want to turn into a website.",
    placement: "center",
  },
  {
    target: "#idea-input",
    content:
      "Type your website idea here. You can also use special commands like @analyse or @research.",
    placement: "top",
  },
  {
    target: "#voice-input-btn",
    content:
      "Prefer speaking? Use the mic to describe your idea using voice input.",
    placement: "right",
  },
  {
    target: "#file-upload-btn",
    content:
      "You can upload a PDF or document to give more context about your idea.",
    placement: "right",
  },
  {
    target: "#start-building-btn",
    content:
      "Once you’re ready, click here and our AI will start building your idea.",
    placement: "top",
  },
];
