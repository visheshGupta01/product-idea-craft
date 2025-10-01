import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { createStripeSession } from "@/services/paymentService";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

  interface Plan {
    name: string;
    price: number;
    desc: string;
    features: string[];
    button: string;
  }

  const monthlyPlans: Plan[] = [
    {
      name: "Free",
      price: 0,
      desc: "Perfect for **early-stage builders** exploring AI-generated sites.",
      features: ["Generate up to 3 projects/month", "Access to core AI prompts"],
      button: "Get Starter Plan",
    },
    {
      name: "Pro",
      price: 19,
      desc: "For **creators and indie founders** who want more flexibility.",
      features: [
        "Unlimited projects",
        "Custom domains",
        "Full prompt library access",
      ],
      button: "Get Pro Plan",
    },
    {
      name: "Team",
      price: 49,
      desc: "For **growing businesses** with advanced needs.",
      features: [
        "Unlimited projects",
        "Custom domains",
        "Full prompt library access",
        "Export code (HTML/CSS)",
      ],
      button: "Get Team Plan",
    },
  ];

  const yearlyPlans: Plan[] = [
    {
      name: "Free",
      price: 0,
      desc: "Perfect for **early-stage builders** exploring AI-generated sites.",
      features: ["Generate up to 3 projects/month", "Access to core AI prompts"],
      button: "Get Starter Plan",
    },
    {
      name: "Pro",
      price: 190,
      desc: "Annual Pro plan for **creators and indie founders** with 2 months free.",
      features: [
        "Unlimited projects",
        "Custom domains",
        "Full prompt library access",
      ],
      button: "Get Pro Plan",
    },
    {
      name: "Team",
      price: 490,
      desc: "Best value for **growing businesses** and fast-growing teams.",
      features: [
        "Unlimited projects",
        "Custom domains",
        "Full prompt library access",
        "Export code (HTML/CSS)",
      ],
      button: "Get Team Plan",
    },
  ];

  const PricingSection: React.FC = () => {
    const [billing, setBilling] = useState<"Monthly" | "Yearly">("Monthly");
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const { user, isAuthenticated } = useUser();
    const plans = billing === "Monthly" ? monthlyPlans : yearlyPlans;

    const handlePlanSelection = async (plan: Plan) => {
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
          userUUID: user.id!,
          price: plan.price.toString(),
          plan_name: plan.name,
          credits: 150,
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
    <section id="pricing" className="bg-[#0f1116] text-white py-12 md:py-20 px-4 sm:px-6 font-['Poppins'] text-center">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2">Lean Pricing.</h2>
      <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8">Limitless Potential.</h3>
      {/* Billing Toggle - Responsive */}
      <div className="max-w-6xl mx-auto flex justify-center sm:justify-start mb-8 md:mb-12">
        <div className="relative border border-gray-500 rounded-[10px] px-1 py-1 flex w-[140px] sm:w-[160px] h-[40px] overflow-hidden">
          {/* Sliding Background */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-[8px] bg-[#FF0E8E]/30 z-0"
            style={{
              left: billing === "Monthly" ? "4px" : "50%",
              transform: billing === "Yearly" ? "translateX(-4px)" : "none",
            }}
          />

          {/* Buttons */}
          <button
            onClick={() => setBilling("Monthly")}
            className={`w-1/2 h-full relative z-10 flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 ${
              billing === "Monthly" ? "text-white" : "text-white/70"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("Yearly")}
            className={`w-1/2 h-full relative z-10 flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 ${
              billing === "Yearly" ? "text-white" : "text-white/70"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl min-h-[400px] mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="bg-[#D5E1E7] text-black rounded-xl px-6 py-6 flex flex-col items-center text-center h-full"
            >
              <div className="flex flex-col items-center flex-grow w-full">
                <h4 className="text-lg font-semibold mb-2">{plan.name}</h4>

                <div className="w-full py-3 border-t border-b font-poppins border-[#2C2C2C] mb-4">
                  <div className="text-4xl font-bold mt-2">
                    <sup className="align-super text-xl">$</sup>
                    {plan.price}
                    <span className="text-base font-medium text-gray-700">
                      {billing === "Monthly" ? <sub>/mo</sub> : <sub>/yr</sub>}
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
