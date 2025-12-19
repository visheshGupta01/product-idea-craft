import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import {
  createRazorpayPayment,
  getPaymentPlans,
} from "@/services/paymentService";
import { toast } from "sonner";
import Navbar from "@/components/landing_page/Navbar";
import Footer from "@/components/landing_page/Footer";
import { trackEvent } from "@/utils/metaPixel";

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, profile } = useUser();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [isAnnually, setIsAnnually] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const fetchedPlans = await getPaymentPlans();
        // Sort plans by id / sort_index
        const sortedPlans = fetchedPlans.sort((a: any, b: any) => {
          const sortA = a.sort_index ?? a.sortIndex ?? a.id ?? a.planid ?? 0;
          const sortB = b.sort_index ?? b.sortIndex ?? b.id ?? b.planid ?? 0;
          return sortA - sortB;
        });
        setPlans(sortedPlans);
      } catch (error) {
        toast.error("Failed to fetch pricing plans.");
      }
    };

    fetchPlans();
  }, []);

  const isCurrentPlan = (planName: string) => {
    if (!isAuthenticated) return false;

    try {
      const userData = localStorage.getItem("user_data");
      if (!userData) return console.warn("No user data found in localStorage"), false;

      const parsedUserData = JSON.parse(userData);
      const userPlanId = parsedUserData?.plan_id;

      if (!userPlanId) return false;
      const currentPlan = plans.find((p) => p.name === planName);
      const currentPlanId = currentPlan?.id || currentPlan?.planid;

      return userPlanId === currentPlanId;
    } catch (error) {
      return false;
    }
  };

  const handleSelectPlan = async (planName: string, price: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to continue");
      navigate("/?action=login");
      return;
    }

    if (isCurrentPlan(planName)) {
      toast.info(`You are already on the ${planName} plan`);
      return;
    }

    // Track InitiateCheckout and Subscribe events when user clicks Get Started
    trackEvent("InitiateCheckout", {
      content_name: planName,
      value: parseFloat(price),
      currency: "USD",
    });
    trackEvent("Subscribe", {
      content_name: planName,
      value: parseFloat(price),
      currency: "USD",
    });

    setLoadingPlan(planName);

    try {
      const selectedPlan = plans.find((p) => p.name === planName);
      await createRazorpayPayment({
        user_id: profile?.id || user?.id || "",
        amount: price,
        plan_name: planName,
        credits: selectedPlan?.credits || 0,
        plan_id: selectedPlan?.id || selectedPlan?.planid || 0,
      });
    } catch (error) {
      toast.error("Failed to process payment. Please try again.");
      setLoadingPlan(null);
    }
  };

  if (plans.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f1116] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1116] text-white">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 pb-20">
        {/* Hero heading + subtitle */}
        <section className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <h1 className="text-3xl md:text-5xl font-bold font-poppins mb-4 leading-tight">
            Build & Launch Your Product
            <br className="hidden md:block" /> Without Writing Code
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-poppins">
            Choose a plan that fits your ambition. Upgrade anytime. Cancel
            anytime.
          </p>
        </section>

        {/* Billing toggle row */}
        {/* <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
          <div className="flex items-center gap-4">
            <span
              className={`text-sm font-supply ${
                !isAnnually
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnually(!isAnnually)}
              className="relative inline-flex h-7 w-14 items-center rounded-full bg-[#2a2d3a] border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1116]"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                  isAnnually ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-supply ${
                isAnnually
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              Annually
            </span>
          </div>

          <span className="inline-flex items-center px-4 py-1 rounded-full bg-[#22c55e] text-xs font-semibold text-black shadow-sm">
            Get 1 month free
          </span>
        </div> */}

        {/* Cards */}
        <section className="grid gap-6 max-w-6xl mx-auto md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan: any) => {
            const isRecommended = plan.recommended || plan.id == 2 || false;

            const displayPrice = isAnnually
              ? Math.floor(plan.price * 10)
              : plan.price;

            const current = isCurrentPlan(plan.name);

            // optional: usage text for grey box
            // usageRaw can be: string | string[] | undefined
            const usageRaw =
              plan.typical_usage ||
              plan.usage_desc ||
              plan.usageDescription ||
              "";

            // Normalize into an array of lines
            let usageLines: string[] = [];

            if (Array.isArray(usageRaw)) {
              usageLines = usageRaw.map((l) => l.trim()).filter(Boolean);
            } else if (typeof usageRaw === "string" && usageRaw.length > 0) {
              usageLines = usageRaw
                .split(/\n|\|/)
                .map((l: string) => l.trim())
                .filter(Boolean);
            } else {
              usageLines = [];
            }
            return (
              <Card
                key={plan.name}
                className={`relative flex flex-col bg-[#16171d] border rounded-3xl overflow-hidden transition-transform ${
                  isRecommended
                    ? "border-[#ff2fb3] shadow-[0_0_0_2px_#ff2fb3]"
                    : "border-white/10"
                }`}
              >
                {isRecommended && (
                  <div className="absolute top-0 left-0 right-0 h-9 flex items-center justify-center bg-[#ff2fb3] text-xs font-bold tracking-wide font-poppins text-white rounded-t-3xl">
                    Recommended
                  </div>
                )}
                <CardHeader className="text-center pb-4 pt-12">
                  <CardTitle className="text-xl md:text-2xl font-bold mb-2 font-poppins">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold font-poppins text-white">
                        ${displayPrice}
                      </span>
                      <span className="text-sm text-white/70 font-poppins">
                        /month
                      </span>
                    </div>

                    <p className="text-sm font-semibold mt-1 font-poppins text-[#ff2fb3]">
                      {plan.credits} credits
                    </p>
                  </CardDescription>
                </CardHeader>

                {usageLines.length > 0 && (
                  <div className="mx-6 mb-4 rounded-xl bg-[#262933] px-4 py-3 text-left">
                    <p className="text-xs font-poppins font-bold mb-1 text-gray-200">
                      Typical usage capacity*
                    </p>

                    <div className="space-y-1 text-xs">
                      {usageLines.map((line, idx) => {
                        const isOr = /^or$/i.test(line);

                        return isOr ? (
                          // 🔹 OR styling
                          <div
                            key={idx}
                            className="text-center text-gray-200 font-semibold italic tracking-wide"
                          >
                            OR
                          </div>
                        ) : (
                          // 🔹 Normal usage item
                          <div
                            key={idx}
                            className="text-[11px] space-y-1 font-poppins text-gray-200"
                          >
                            <span>• </span>
                            <span>{line}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <CardContent className="px-6 pb-4 flex-1 space-y-3">
                  {plan.features?.map((feature: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 text-sm font-poppins"
                    >
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-[#ff4db8]" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter className="px-6 pb-6 pt-2 mt-auto">
                  <Button
                    className={`w-full font-bold font-poppins rounded-xl ${
                      current
                        ? "bg-transparent border border-white/20 text-foreground hover:bg-white/5"
                        : "text-white"
                    }`}
                    style={
                      !current ? { backgroundColor: "hsl(var(--primary))" } : {}
                    }
                    size="lg"
                    onClick={() =>
                      handleSelectPlan(plan.name, String(displayPrice))
                    }
                    disabled={loadingPlan === plan.name || current}
                  >
                    {loadingPlan === plan.name ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : current ? (
                      "Current Plan"
                    ) : plan.cta_label ? (
                      plan.cta_label
                    ) : (
                      "Get Started"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </section>

        <p className="text-center mt-10 text-xs md:text-sm text-muted-foreground font-poppins">
          All plans include secure payments via PayPal & Razorpay
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;