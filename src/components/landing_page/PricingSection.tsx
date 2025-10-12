import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { createRazorpayPayment, getPaymentPlans } from "@/services/paymentService";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

  const PricingSection: React.FC = () => {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [plans, setPlans] = useState<any[]>([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);
    const { user, isAuthenticated } = useUser();

    useEffect(() => {
      const fetchPlans = async () => {
        try {
          setIsLoadingPlans(true);
          const fetchedPlans = await getPaymentPlans();
          setPlans(fetchedPlans);
        } catch (error) {
          console.error('Error fetching plans:', error);
          toast({
            title: "Error",
            description: "Failed to load pricing plans.",
            variant: "destructive",
          });
        } finally {
          setIsLoadingPlans(false);
        }
      };

      fetchPlans();
    }, []);

    const handlePlanSelection = async (plan: any) => {
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
          price: String(plan.price),
          plan_name: plan.name,
          credits: plan.credits || 0,
        };
        await createRazorpayPayment(paymentData);
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
      {isLoadingPlans ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" text="Loading plans..." />
        </div>
      ) : (
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl min-h-[400px] mx-auto">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className="bg-[#D5E1E7] text-black rounded-xl px-6 py-6 flex flex-col items-center text-center w-[300px] h-auto"
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
                {plan.subtitle || plan.desc
                  ? (plan.subtitle || plan.desc)
                      .split("**")
                      .map((text: string, i: number) =>
                        i % 2 === 1 ? (
                          <strong key={i}>{text}</strong>
                        ) : (
                          <span key={i}>{text}</span>
                        )
                      )
                  : ""}
              </p>

              <ul className="text-sm text-left mb-6 w-full max-w-xs">
                {(plan.features || []).map((f: string, i: number) => (
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
                plan.button || 'Get Started'
              )}
            </button>
          </div>
        ))}
      </div>
      )}
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
