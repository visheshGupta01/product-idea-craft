// src/components/Tour/tourContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface TourContextType {
  run: boolean;
   stepIndex: number;
  startTour: () => void;
  stopTour: () => void;
  setStepIndex: (i: number) => void;
   

}

// Create context with initial value as null
const TourContext = createContext<TourContextType | null>(null);

// Define props for the provider
interface TourProviderProps {
  children: ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const [run, setRun] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState(0);

   const startTour = () => {
    setStepIndex(0);
    setRun(true);
  };

   const stopTour = () => {
    setRun(false);
    setStepIndex(0);
  };

  

  return (
    <TourContext.Provider value={{ run, stepIndex, setStepIndex, startTour, stopTour }}>
      {children}
    </TourContext.Provider>
  );
};

// Custom hook with proper typing
export const useTour = () => {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
};