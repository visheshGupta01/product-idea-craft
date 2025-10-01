import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { createStripeSession } from "@/services/paymentService";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { PRICING_PLANS } from "@/utils/constants";

  const PricingSection: React.FC = () => {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const { user, isAuthenticated } = useUser();
    const plans = PRICING_PLANS.MONTHLY;

    const handlePlanSelection = async (plan: typeof PRICING_PLANS.MONTHLY[number]) => {
      if (!isAuthenticated || !user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to purchase a plan.",
          variant: "destructive",
        });
        return;
      }

      if (plan.name === "Free") {
        toast({
          title: "Free Plan",
          description: "You're already on the free plan!",
        });
        return;
      }

      setLoadingPlan(plan.name);
      
      try {
        const paymentData = {
          user_uuid: user.id!,
          price: plan.price.toString(),
          plan_name: plan.name,
          credits: plan.credits,
        };

        await createStripeSession(paymentData);
      } catch (error) {
        console.error('Payment error:', error);
        toast({
          title: "Payment Error",
          description: "Failed to create payment session. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingPlan(null);
      }
    };

  return (
    <section
      id="pricing"
      className="bg-[#0f1116] text-white py-12 md:py-20 px-4 sm:px-6 font-['Poppins'] text-center"
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
        Lean Pricing.
      </h2>
      <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8">
        Limitless Potential.
      </h3>
      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl min-h-[400px] mx-auto">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className="bg-[#D5E1E7] text-black rounded-xl px-6 py-6 flex flex-col items-center text-center h-full w-[300px]"
          >
            <div className="flex flex-col items-center flex-grow w-full">
              <h4 className="text-lg font-semibold mb-2">{plan.name}</h4>

              <div className="w-full py-3 border-t border-b font-poppins border-[#2C2C2C] mb-4">
                <div className="text-4xl font-bold mt-2">
                  <sup className="align-super text-xl">$</sup>
                  {plan.price}
                  <span className="text-base font-medium text-gray-700">
                    <sub>/mo</sub>
                  </span>
                </div>
              </div>

              <p className="text-sm mb-4 max-w-xs">
                {plan.desc
                  .split("**")
                  .map((text, i) =>
                    i % 2 === 1 ? (
                      <strong key={i}>{text}</strong>
                    ) : (
                      <span key={i}>{text}</span>
                    )
                  )}
              </p>

              <ul className="text-sm text-left mb-6 w-full max-w-xs">
                {plan.features.map((f, i) => (
                  <li
                    key={i}
                    className="mb-2 font-semibold list-disc list-inside"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handlePlanSelection(plan)}
              disabled={loadingPlan === plan.name}
              className="bg-[#fb02a5] hover:bg-[#d62a86] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md text-sm font-supply font-semibold mt-auto flex items-center justify-center"
            >
              {loadingPlan === plan.name ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                plan.button
              )}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-12 text-sm text-gray-400">
        Don’t find a plan that suits you?{" "}
        <span className="text-pink-400 cursor-pointer hover:underline">
          Talk to Us
        </span>
      </p>
    </section>
  );
  };

  export default PricingSection;
