import React from "react";
import Navbar from "@/components/landing_page/Navbar";
import Footer from "@/components/landing_page/Footer";
import {
  Zap,
  Users,
  TrendingUp,
  DollarSign,
  Cloud,
  Shield,
  BarChart3,
  Puzzle,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  const whyFoundersLoveIt = [
    {
      icon: Zap,
      title: "Bulletproof Architecture",
      description: "Apps survive viral traffic spikes from day one.",
    },
    {
      icon: Users,
      title: "Human Safety Net",
      description: "Senior engineers jump in whenever you hit a snag.",
    },
    {
      icon: TrendingUp,
      title: "Built-in Network Effects",
      description: "Growth levers baked into every template.",
    },
    {
      icon: DollarSign,
      title: "Predictable Pricing",
      description: "Start free, upgrade only when needed.",
    },
  ];

  const featureHighlights = [
    {
      icon: Cloud,
      title: "One-click scalability",
      description:
        "Deploy to AWS, GCP, or Vercel with a single click. Your app scales automatically.",
    },
    {
      icon: Shield,
      title: "Secure by default",
      description:
        "OWASP, GDPR & SOC2 aligned security practices built into every app.",
    },
    {
      icon: BarChart3,
      title: "Integrated analytics",
      description: "Track LTV/CAC, NPS & churn with built-in dashboards.",
    },
    {
      icon: Puzzle,
      title: "Instant extensions",
      description: "Add chat-bots, payments, auth, SEO in seconds.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1B2123]">
      <Navbar />

      {/* Welcome Section */}
      <section className="pt-24 pb-12 px-4 md:px-8 bg-[#1B2123]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-poppins">
            Welcome
          </h1>
          <p className="text-gray-300 mb-8 font-poppins">
            Learn about more Imagine.bo and get started
          </p>

          {/* YouTube Embeds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-800">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/MiByV5o-K_w?si=2nPp8sLnMboGtuiq"
                title="Building the Imagine.bo: Escaping the Startup Vibe Coding Trap"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-800">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/aLaN6roMbWU?si=I-L_FrIAqnDO5CeG"
                title="Building the Imagine.bo: Escaping the Startup Vibe Coding Trap"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <p className="text-gray-300 text-center max-w-4xl mx-auto font-poppins">
            Imagine.bo is an AI-first creation platform that turns your ideas
            into interactive apps, dashboards, and tools. Just share your
            vision, and imagine.bo brings it to life—fast, simple, and ready to
            use.
          </p>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-16 px-4 md:px-8 bg-[#1B2123]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4 font-poppins">
            Meet the Team
          </h2>
          <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12 font-poppins">
            We're the same Synlabs crew that's been shipping AI-driven high
            volume mission critical products for IKEA and Flipkart —now
            laser-focused on making product building friction-free for founders.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sushil Kumar */}
            <div className="bg-[#C6D6DD] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                  <img
                    src="/sushil.avif"
                    alt="Sushil Kumar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black font-poppins">
                    Sushil Kumar
                  </h3>
                  <p className="text-[#545454] font-poppins font-medium text-sm mb-2">
                    Co-Founder and Chief Innovation Officer
                  </p>
                </div>
              </div>
              <p className="text-black mt-4 text-sm leading-relaxed font-poppins">
                Founder of Jazari (North India's first dedicated AI institute,
                (2017) and SynergyLabs (enterprise-grade software studio, IIT
                Delhi alum, mentor at Venture Studio @ IIT Delhi & ex VP Goldman
                Sachs with 25 years of ML leadership; drives deep tech R&D that
                keeps our platform ahead of the curve.
              </p>
            </div>

            {/* Raahull Leekha */}
            <div className="bg-[#C6D6DD] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                  <img
                    src="/rahul.png"
                    alt="Raahull Leekha"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black font-poppins">
                    Raahull Leekha
                  </h3>
                  <p className="text-[#545454] font-poppins font-medium text-sm mb-2">
                    Co-Founder and CEO
                  </p>
                </div>
              </div>
              <p className="text-black mt-4 text-sm leading-relaxed font-poppins">
                Co-founder of Jazari (North India's first dedicated AI
                institute, 2017) and SynergyLabs (enterprise-grade software
                studio)–driving vision, growth, and customer success across 40+
                countries. External Faculty of Design Thinking at NIFT Panchkula
                and serial entrepreneur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Founders Love It Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-[#c6dde8] to-[#FFD9F2]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-black text-center mb-4 font-poppins">
            Why founders love it
          </h2>
          <p className="text-gray-600 text-center mb-12 font-poppins">
            Built by founders, for founders. Everything you need to succeed.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyFoundersLoveIt.map((item, index) => (
              <div
                key={index}
                className="bg-[#C6D6DD] backdrop-blur rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-[#e0f2fe] rounded-full flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-[#0284c7]" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2 font-poppins">
                  {item.title}
                </h3>
                <p className="text-black text-sm font-poppins">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-16 px-4 md:px-8 bg-[#1B2123]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-4xl font-bold text-white text-center mb-4 font-poppins">
            Feature Highlights
          </h2>
          <p className="text-white text-center mb-12 font-poppins">
            Built by founders, for founders. Everything you need to succeed.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureHighlights.map((item, index) => (
              <div
                key={index}
                className="bg-[#B1C5CE] rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-[#D5E1E7] rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-[#0284c7]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black mb-1 font-poppins">
                    {item.title}
                  </h3>
                  <p className="text-black text-sm font-poppins">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-[#D5E1E7] to-[#FFD9F2]">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="imagine.bo" className="h-12 md:h-16" />
            <span className="text-black text-2xl md:text-3xl font-semibold font-poppins">
              imagine.bo
            </span>
          </div>
          <Button
            onClick={() => navigate("/")}
            className="bg-pink-500 hover:bg-[#FF00A9] text-white px-8 py-3 rounded-full text-lg font-medium font-supply flex items-center gap-2"
          >
            Get Started <ArrowUpRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
