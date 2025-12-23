// src/components/Tour/TourTooltip.tsx
import { TooltipRenderProps } from "react-joyride";

interface Props extends TooltipRenderProps {
  globalIndex: number;
  totalSteps: number;
}

const TourTooltip = ({
  step,
  index,
  backProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep,
  globalIndex,
  totalSteps,
}: Props) => {
  return (
    <div
      {...tooltipProps}
      className="bg-white rounded-lg p-4 shadow-xl max-w-sm"
    >
      <div className="text-sm text-gray-800 mb-3">
        {step.content}
      </div>

      {/* GLOBAL STEP COUNT */}
      <div className="text-xs text-gray-500 mb-3">
        Step {globalIndex} of {totalSteps}
      </div>

      <div className="flex justify-between items-center">
        <button {...skipProps} className="text-xs text-gray-400">
          Skip
        </button>

        <div className="flex gap-2">
             {globalIndex > 1 && ( // Hide Back button on first step
         <button
  {...backProps}
  disabled={backProps.disabled}
  className={`
    px-3 py-1.5 rounded-md text-sm font-medium
    transition-colors
    ${
      backProps.disabled
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
    }
  `}
>
  Back
</button>
 )}


          <button
            {...primaryProps}
            className="px-4 py-1.5 bg-pink-600 text-white rounded-md text-sm"
          >
           {location.pathname === "/" ? "Next" : isLastStep ? "Done" : "Next"}

          </button>
        </div>
      </div>
    </div>
  );
};

export default TourTooltip;
