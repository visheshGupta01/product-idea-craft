import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqData: FAQ[] = [
  {
    question: "What is Imagine.bo?",
    answer:
      "Imagine.bo is an AI-powered platform that helps you generate and customize full websites or apps from simple prompts—no design or coding skills needed.",
  },
  {
    question: "Do I need to know how to code?",
    answer: "No, you can build everything with simple prompts!",
  },
  {
    question: "Can I use my own domain?",
    answer: "Yes, you can connect your custom domain easily.",
  },
  {
    question: "What kind of projects can I build?",
    answer: "Landing pages, portfolios, web apps, and more!",
  },
  {
    question: "Can I edit the designs after generation?",
    answer: "Yes, all generated designs are fully editable.",
  },
  {
    question: "Is there a free plan?",
    answer: "Yes, we offer a free plan to get you started.",
  },
  {
    question: "Can I collaborate with others?",
    answer: "Yes, we support team-based collaboration.",
  },
  {
    question: "Do you offer support?",
    answer: "Absolutely! We have email and chat support.",
  },
  {
    question: "How secure is my data?",
    answer: "We prioritize security and follow industry best practices.",
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first by default

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#0f1116] text-black font-['Poppins'] py-5 px-4 flex justify-center">
      <div className="bg-gradient-to-b from-[#dbe5ed] to-[#fcddec] rounded-2xl max-w-4xl w-full p-10">
        {/* Heading */}
        <h2 className="text-[80px] mt-4 text-[#1E1E1E] font-bold font-poppins text-center mb-2">
          FAQ
        </h2>
        <p className="text-center text-2xl text-[#1E1E1E] mb-16">
          Queries you might have about Imagine.bo
        </p>

        {/* Accordion */}
        {faqData.map((faq, index) => (
          <div key={index} className="border-b border-gray-300 py-4">
            <button
              className="flex font-poppins justify-between w-full text-xl text-left"
              onClick={() => toggleOpen(index)}
            >
              <span className="font-semibold">{faq.question}</span>
              {openIndex === index ? (
                <Minus className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </button>
            {openIndex === index && (
              <p className="text-lg mt-2 font-poppins text-gray-700">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
