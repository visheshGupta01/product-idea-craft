import React, { useState, useEffect } from "react";
import { X, Check, ShieldCheck, Loader2 } from "lucide-react";
import { getPaymentPlans } from "@/services/paymentService";
import { toast } from "@/hooks/use-toast";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: string) => void;
}

const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
}) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly"
  );

  const [plans, setPlans] = useState<any[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState<boolean>(true);
  const userData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user_data") || "{}")
      : {};

  const currentPlanId = userData?.plan_id || null;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const fetchedPlans = await getPaymentPlans();

        const sortedPlans = fetchedPlans
          .filter((p: any) => p.id !== 1 && Number(p.price) > 0)
          .sort((a: any, b: any) => {
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

    if (isOpen) {
      // only fetch when modal opens (optional but nice)
      fetchPlans();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm h-full w-full">
      <div
        className="relative 
        w-full 
        max-w-xl md:max-w-2xl lg:max-w-3xl 
        bg-[#09090b] 
        rounded-[20px] 
        overflow-hidden 
        border border-zinc-800 
        shadow-2xl 
        flex flex-col 
        max-h-[95vh] 
        overflow-y-auto 
        custom-scrollbar
        transform transition-all duration-300 ease-out
      "
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-3 p-1 rounded-full bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors z-10"
        >
          <X size={16} />
        </button>

        <div className="p-4 md:p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-extrabold text-white mb-1">
              You're so close - let's finish this.
            </h2>
            <p className="text-zinc-400 text-[12px] max-w-2xl mx-auto">
              Your credits are finished, but your project is saved and ready to
              continue. Upgrade now to
            </p>
            <p className="text-zinc-400 text-[10px] max-w-2xl mx-auto">
              instantly unlock everything that helps you launch faster.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <span
                className={`text-[12px] font-medium ${
                  billingCycle === "monthly" ? "text-white" : "text-zinc-500"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() =>
                  setBillingCycle((prev) =>
                    prev === "monthly" ? "annually" : "monthly"
                  )
                }
                className="w-10 h-5 bg-pink-600 rounded-full relative p-0.5 cursor-pointer transition-colors"
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1/2 -translate-y-1/2 transition-all duration-300 ${
                    billingCycle === "annually"
                      ? "left-[calc(100%-0.9rem)]"
                      : "left-0.5"
                  }`}
                />
              </button>
              <span
                className={`text-[12px] font-medium ${
                  billingCycle === "annually" ? "text-white" : "text-zinc-500"
                }`}
              >
                Annually{" "}
                <span className="text-[#4ADE80] text-[10px] bg-[#4ADE80]/10 px-1 py-0.5 rounded ml-0.5">
                  Get 1 month free
                </span>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {isLoadingPlans ? (
              <div className="col-span-full flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
              </div>
            ) : plans.length === 0 ? (
              <div className="col-span-full text-center text-zinc-500 text-sm py-6">
                No plans available right now. Please try again later.
              </div>
            ) : (
              plans.map((plan, index) => {
                const isCurrentPlan =
                  currentPlanId === plan.id;
                const isRecommended =
                  plan.is_recommended || plan.recommended || index === 1; // fallback: second card as recommended

                const price =
                  billingCycle === "monthly"
                    ? plan.price
                    : plan.annual_price ?? plan.price; // adjust if you have real annual prices

                const description =
                  plan.subtitle || plan.desc || "Best for builders";

                const box = [
                  "Typical usage capacity*",
                  `${plan.credits ?? ""} credits`,
                  description,
                ];

                return (
                  <PriceCard
                    key={plan.id || plan.planid || plan.name || index}
                    plan={plan.name}
                    price={price}
                    credits={`${plan.credits ?? ""} credits`}
                    description={description}
                    isCurrent={isCurrentPlan} // 👈 NEW PROP
                    isRecommended={!!isRecommended}
                    features={plan.features || []}
                    box={box}
                    onClick={() => onUpgrade(plan.name.toLowerCase())}
                  />
                );
              })
            )}
          </div>

          <div className="mt-4 text-center flex items-center justify-center gap-1 text-zinc-500 text-[9px]">
            <ShieldCheck size={10} />
            Secure payments via Stripe & Razorpay. Cancel anytime & no hidden
            charges.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;

interface PriceCardProps {
  plan: string;
  price: number;
  credits: string;
  description: string;
  isRecommended: boolean;
  isCurrent: boolean; // 👈 NEW
  features: string[];
  box: string[];
  onClick: () => void;
}

const PriceCard: React.FC<PriceCardProps> = ({
  plan,
  price,
  credits,
  description,
    isRecommended,
  isCurrent,
  features,
  onClick,
  box,
}) => {
  return (
    <div
      className={`relative w-full px-4 py-2 rounded-xl flex flex-col items-center transition-all duration-300 h-full ${
        isRecommended
          ? " border-4 border-pink-600 "
          : "bg-[#121214] border border-zinc-800 hover:border-zinc-700"
      }`}
    >
      <h3 className="text-sm uppercase tracking-wider mb-1">{description}</h3>

      <h2
        className={`${
          isRecommended ? "text-3xl" : "text-2xl"
        } font-extrabold text-white`}
      >
        {plan}
      </h2>

      <div className="flex items-end my-2">
        <span className="text-3xl font-extrabold text-white">${price}</span>
        <span className="text-lg text-zinc-500 font-semibold mb-1">/mo</span>
      </div>

      <p className="text-sm font-semibold mb-2 text-zinc-400">{credits}</p>
      <Box boxtext={box} />

      <ul className="text-left w-full space-y-2 mb-2 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-xs text-zinc-400">
            <Check size={14} className="mt-0.5 mr-2 text-pink-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        disabled={isCurrent}
        onClick={onClick}
        className={`w-full py-3 mt-auto rounded-xl font-bold transition-colors shadow-lg 
    ${
      isCurrent
        ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
        : isRecommended
        ? "bg-pink-600 text-white hover:bg-pink-700 hover:shadow-pink-600/30"
        : "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
    }`}
      >
        {isCurrent
          ? "Current Plan"
          : isRecommended
          ? "Get Pro"
          : `Select ${plan}`}
      </button>
    </div>
  );
};

const Box: React.FC<{ boxtext: string[] }> = ({ boxtext }) => {
  return (
    <div className="w-full p-3 mb-4 rounded-lg text-left bg-zinc-800/50 border border-zinc-700/50">
      <ul className="space-y-1">
        {boxtext.map((text, index) => (
          <li key={index} className="text-zinc-400 text-xs flex items-start">
            {index > 0 && <span className="mr-2">•</span>}
            <span className={index === 0 ? "font-bold text-zinc-300" : ""}>
              {text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
