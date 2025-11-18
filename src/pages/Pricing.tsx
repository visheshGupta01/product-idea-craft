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
import FacebookPixel from "@/lib/FacebookPixel";

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [isAnnually, setIsAnnually] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const fetchedPlans = await getPaymentPlans();
        console.log("Fetched plans:", fetchedPlans);
        setPlans(fetchedPlans);
      } catch (error) {
        toast.error("Failed to fetch pricing plans.");
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = async (planName: string, price: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to continue");
      navigate("/?action=login");
      return;
    }

    if (planName === "Free") {
      toast.info("You are already on the Free plan");
      return;
    }

    setLoadingPlan(planName);

    try {
      const selectedPlan = plans.find((p) => p.name === planName);
      await createRazorpayPayment({
        user_uuid: user?.id || "",
        price: price,
        plan_name: planName,
        credits: selectedPlan?.credits || 0,
        plan_id: selectedPlan?.id || selectedPlan?.planid || 0,
      });
    } catch (error) {
      //console.error('Payment error:', error);
      toast.error("Failed to process payment. Please try again.");
      setLoadingPlan(null);
    }
  };

  if (plans.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f1116] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  } 

  return (
    <div className="min-h-screen bg-[#0f1116]">
      <FacebookPixel />
      <Navbar />

      <div className="container mx-auto px-4 py-16 pt-32">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-poppins md:text-5xl font-bold mb-6">
            Choose Your Plan
          </h1>

          {/* Billing Toggle */}
          {/* <div className="flex items-center justify-center gap-4 mb-12">
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
              className="border relative inline-flex h-6 w-11 items-center rounded-full bg-gray-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                  isAnnually ? "translate-x-6" : "translate-x-1"
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
          </div> */}
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className="relative bg-[#1a1d21] border border-white flex flex-col"
            >
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold mb-4">
                  {plan.name}
                </CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-poppins md:text-5xl font-bold">
                    ${isAnnually ? Math.floor(plan.price * 10) : plan.price}
                  </span>
                  <span className="text-muted-foreground font-poppins text-sm">
                    /month
                  </span>
                </div>
                <p
                  className="text-sm p-3 font-poppins"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {plan.credits} credits/month
                </p>
              </CardHeader>

              <CardContent className="space-y-3 px-6 flex-1">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check
                      className="h-4 w-4 shrink-0 mt-0.5"
                      style={{ color: "hsl(var(--primary))" }}
                    />
                    <span className="text-sm text-foreground font-poppins">
                      {feature}
                    </span>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="px-6 pb-6 pt-4 mt-auto">
                <Button
                  className={`w-full font-semibold font-poppins ${
                    plan.name === "Free"
                      ? "bg-transparent border-2 border-border text-foreground hover:bg-muted"
                      : "text-white"
                  }`}
                  style={
                    plan.name !== "Free"
                      ? { backgroundColor: "hsl(var(--primary))" }
                      : {}
                  }
                  size="lg"
                  onClick={() =>
                    handleSelectPlan(
                      plan.name,
                      String(
                        isAnnually ? Math.floor(plan.price * 10) : plan.price
                      )
                    )
                  }
                  disabled={loadingPlan === plan.name || plan.name === "Free"}
                >
                  {loadingPlan === plan.name ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : plan.name === "Free" ? (
                    "Current Plan"
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>All plans include secure payments via Razorpay</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
