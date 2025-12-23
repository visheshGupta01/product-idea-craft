import Joyride, { EVENTS, STATUS, CallBackProps } from "react-joyride";
import { useNavigate } from "react-router-dom";
import { useTour } from "./tourContext";
import { ALL_STEPS, HOME_COUNT, TOTAL_STEPS } from "./steps";
import TourTooltip from "./TourTooltip";

const CHAT_ROUTE = "/dummy-chat";

const Tour = () => {
  const navigate = useNavigate();
  const { run, stepIndex, setStepIndex, stopTour } = useTour();

  const handleCallback = (data: CallBackProps) => {
    const { index, type, action, status } = data;

    if (type === EVENTS.STEP_AFTER) {
      // ▶️ NEXT
      if (action === "next") {
        const next = index + 1;

        // 🔁 HOME → CHAT (CRITICAL FIX)
        if (next === HOME_COUNT) {
          navigate(CHAT_ROUTE);

          // ⏳ wait for chat page DOM to mount
          setTimeout(() => {
            setStepIndex(next);
          }, 400);

          return;
        }

        setStepIndex(next);
      }

      // ◀️ BACK
      if (action === "prev") {
        const prev = index - 1;

        if (prev === HOME_COUNT - 1) {
          navigate("/");
        }

        setStepIndex(prev);
      }
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      stopTour();
      navigate("/");
    }
  };

  return (
    <Joyride
      steps={ALL_STEPS}
      run={run}
      stepIndex={stepIndex}
      continuous
      scrollToFirstStep
      disableOverlayClose
      showSkipButton
      tooltipComponent={(props) => (
        <TourTooltip
          {...props}
          globalIndex={props.index + 1}
          totalSteps={TOTAL_STEPS}
        />
      )}
      callback={handleCallback}
      styles={{ options: { zIndex: 10000 } }}
    />
  );
};

export default Tour;
