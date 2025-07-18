import StackedCards from "./StackedCards";

export default function VisionSection() {
  return (
    <div className="relative bg-gradient-to-b from-[#d5e1e7] to-[#ffd9f2] pt-16 mt-10">
      {/* Section Heading - now part of normal flow */}
      <div className="p-8 text-center bg-transparent">
        <p className="uppercase text-l tracking-widest text-[#22282A] font-['Supply'] mb-4">
          [End-to-End Idea to Product Deployment]
        </p>
        <h1 className="text-6xl font-bold text-[#22282A] leading-tight">
          Vision to Launch,
          <br />
          Seamless Development,
          <br />
          AI-Powered Precision, and
          <br />
          Impactful Go-to-Market.
        </h1>
      </div>

      {/* Stacked Cards */}
      <StackedCards />
    </div>
  );
}
