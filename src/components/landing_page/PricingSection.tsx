import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import {
  createRazorpayPayment,
  getPaymentPlans,
} from "@/services/paymentService";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { LoginModal } from "../auth/LoginModal";
import { SignupModal } from "../auth/SignupModal";
import ProfilePopup from "../dashboard/ProfilePopup";

const PricingSection: React.FC = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isAnnually, setIsAnnually] = useState(false);
  const { user, isAuthenticated } = useUser();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const fetchedPlans = await getPaymentPlans();
        const sortedPlans = fetchedPlans.sort((a: any, b: any) => {
          const sortA = a.sort_index ?? a.sortIndex ?? a.id ?? a.planid ?? 0;
          const sortB = b.sort_index ?? b.sortIndex ?? b.id ?? b.planid ?? 0;
          return sortA - sortB;
        });
        setPlans(sortedPlans);
      } catch (error) {
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

    const priceToCharge = isAnnually ? Math.floor(plan.price * 10) : plan.price;

    try {
      const paymentData = {
        user_uuid: user.id!,
        price: String(priceToCharge),
        plan_name: plan.name,
        credits: plan.credits || 0,
        plan_id: plan.id || plan.planid || 0,
      };
      await createRazorpayPayment(paymentData);
    } catch (error) {
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
      className="bg-[#0f1116] text-white py-16 md:py-24 px-4 sm:px-6 font-['Poppins']"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
          Build & Launch Your Product
        </h2>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
          Without Writing Code
        </h3>
        <p className="text-sm md:text-base text-gray-400">
          Choose a plan that fits your ambition. Upgrade anytime. Cancel
          anytime.
        </p>
      </div>

      {/* Billing toggle */}
      {/* <div className="flex items-center justify-center gap-4 mb-12">
        <span
          className={`text-sm ${
            !isAnnually ? "text-white font-medium" : "text-gray-400"
          }`}
        >
          Monthly
        </span>
        <button
          onClick={() => setIsAnnually(!isAnnually)}
          className="relative inline-flex h-7 w-14 items-center rounded-full bg-[#2a2d3a] border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1116]"
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
              isAnnually ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
        <span
          className={`text-sm ${
            isAnnually ? "text-white font-medium" : "text-gray-400"
          }`}
        >
          Annually
        </span>
      </div> */}

      {/* Cards */}
      {isLoadingPlans ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <LoadingSpinner size="lg" text="Loading plans..." />
        </div>
      ) : plans.length === 0 ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="text-center">
            <p className="text-xl text-gray-400 mb-4">
              Unable to load pricing plans at the moment.
            </p>
            <p className="text-sm text-gray-500">
              Please try again later or contact support.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 max-w-6xl mx-auto md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, idx) => {
            const isRecommended =
              plan.is_recommended ||
              plan.name?.toLowerCase().includes("pro") ||
              false;

            const displayPrice = isAnnually
              ? Math.floor(plan.price * 10)
              : plan.price;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="h-full"
              >
                <div
                  className={`relative flex flex-col h-full rounded-3xl bg-[#16171d] border shadow-lg px-6 py-8 text-center ${
                    isRecommended
                      ? "border-pink-500 ring-2 ring-pink-500/30 scale-[1.02]"
                      : "border-white/10"
                  }`}
                >
                  {/* Recommended badge */}
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-[#fb02a5] text-white shadow-md">
                      Recommended
                    </div>
                  )}

                  <div className="flex flex-col items-center flex-grow w-full">
                    <h4 className="text-xl font-semibold mb-3">{plan.name}</h4>

                    {/* Price */}
                    <div className="w-full py-3 mb-4 border-y border-white/10">
                      <div className="text-4xl font-bold mt-1">
                        <sup className="align-super text-xl">$</sup>
                        {displayPrice}
                        <span className="text-base font-medium text-gray-400">
                          <sub>/month</sub>
                        </span>
                      </div>
                      {plan.credits && (
                        <p className="mt-1 text-xs text-pink-400">
                          {plan.credits} credits/month
                        </p>
                      )}
                    </div>

                    {/* Subtitle */}
                    <p className="text-sm mb-4 max-w-xs text-gray-300">
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

                    {/* Features */}
                    <ul className="text-sm text-left mb-6 w-full max-w-xs space-y-2">
                      {(plan.features || []).map((f: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 leading-snug"
                        >
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-500" />
                          <span className="font-medium">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA button */}
                  <button
                    onClick={() => handlePlanSelection(plan)}
                    disabled={loadingPlan === plan.name}
                    className="bg-[#fb02a5] hover:bg-[#d62a86] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full text-sm font-semibold mt-auto flex items-center justify-center"
                  >
                    {loadingPlan === plan.name ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plan.button || "Get Started"
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <p className="mt-12 text-sm text-gray-400 text-center">
        Don't find a plan that suits you?{" "}
        <a
          href="/contact"
          className="text-pink-400 cursor-pointer hover:underline"
        >
          Talk to Us
        </a>
      </p>

      {/* Support & Authentication Modals */}
      <ProfilePopup
        open={showProfilePopup}
        onOpenChange={setShowProfilePopup}
        initialSection="support"
      />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </section>
  );
};

export default PricingSection;
