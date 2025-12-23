import { Step } from "react-joyride";

export const chatSteps: Step[] = [
  { target: "#ai-response-panel", content: "Here, the AI generates responses based on your input.", placement: "top" , disableBeacon: true, spotlightClicks: true,},
  { target: "#model-selector", content: "Choose which AI model to use.", placement: "bottom" },
  { target: "#chat-inputs", content: "Type your message here to chat with AI.", placement: "top" },
  
  
  
  { target: "#preview-switcher", content: "Switch between code and UI preview.", placement: "bottom" },
  { target: "#refresh-preview-btn", content: "Refresh the preview to see latest changes.", placement: "bottom" },
  { target: "#open-preview-newtab-btn", content: "Open the preview in a new tab.", placement: "bottom" },
  { target: "#page-dropdown-btn", content: "View and navigate to other generated pages.", placement: "bottom" },
 {
  target: "#view-mode-buttons", // common parent for web, mob, tab
  content: "Switch between Web, Mobile, and Tablet views using these buttons.",
  placement: "top",
  
},
  { target: "#fullscreen-btn", content: "See the website in fullscreen.", placement: "top" },
  {
  target: "#assign-to-dev-btn", // the button's id
  content: "Click here to assign this development task to a developer from the list.",
  placement: "bottom",
  
},
  { target: "#publish-btn", content: "Click to publish your website to Vercel.", placement: "left" },
  
];
