import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}
const faqData: FAQ[] = [
  {
    question: "What is Imagine.bo?",
    answer: `
      <p>Imagine.bo is a no-code platform that transforms raw startup ideas into fully structured business plans and production-ready applications. It guides users through the entire entrepreneurial journey—analyzing their idea, conducting market research, creating ideal customer profiles, defining MVP (Minimum Viable Product) features, outlining the scope of work, designing a site map, and building a full-stack application—all without writing a single line of code.</p>
    `,
  },
  {
    question: "Who Can Use Imagine.bo?",
    answer: `
      <p>Imagine.bo is ideal for:</p>
      <ul class="list-disc list-inside mb-2">
        <li>Entrepreneurs launching new ideas</li>
        <li>Startups looking to validate concepts</li>
        <li>Non-technical founders building MVPs</li>
        <li>Professionals creating quick business prototypes</li>
      </ul>
      <p>Whether you’re just getting started or already have experience, Imagine.bo is designed for you.</p>
    `,
  },
  {
    question: "Is Imagine.bo Free?",
    answer: `
      <p>Yes, Imagine.bo offers a free plan with limited usage quotas.<br/>
      For expanded features, higher quotas, and expert support, paid plans are available.</p>
    `,
  },
  {
    question: "Can I Use My Own Domain?",
    answer: `
      <p>Absolutely! If you already have a custom domain, you can use it to host your Imagine.bo-generated project.</p>
    `,
  },
  {
    question: "What Kind of Projects Can I Build?",
    answer: `
      <p>With Imagine.bo, you can quickly build:</p>
      <ul class="list-disc list-inside mb-2">
        <li>Simple prototypes</li>
        <li>Startup landing pages</li>
        <li>Internal management tools</li>
        <li>Market test MVPs</li>
      </ul>
      <p>The platform helps validate if your idea is viable by building a working prototype to attract real user feedback and traffic.</p>
    `,
  },
  {
    question: "What Services Does Imagine.bo Offer?",
    answer: `
      <p>Imagine.bo includes a complete suite of startup tools:</p>
      <ul class="list-disc list-inside mb-2">
        <li><b>AI-Powered Idea Analysis</b> – Validate and refine your idea</li>
        <li><b>Market & Competitor Research</b> – Understand your target space</li>
        <li><b>Ideal Customer Profiles</b> – Define and visualize your audience</li>
        <li><b>MVP Feature Design</b> – Focus on what really matters</li>
        <li><b>Scope of Work</b> – Plan milestones and deliverables</li>
        <li><b>Site Map Generation</b> – Structurally plan your application</li>
        <li><b>Full-Stack Application Development</b> – No-code app builder with real code behind</li>
        <li><b>One-Click Deployment</b> – Deploy on platforms like Netlify or Vercel</li>
      </ul>
    `,
  },
  {
    question: "Can I Collaborate with Others?",
    answer: `
      <p>Yes! Imagine.bo supports team collaboration.<br/>
      Invite team members or mentors to your project for feedback, contributions, or co-building.</p>
    `,
  },
  {
    question: "How Does Imagine.bo Support No-Code Development?",
    answer: `
      <p>You simply describe your idea in plain English, and our AI-driven platform:</p>
      <ul class="list-disc list-inside mb-2">
        <li>Automatically generates UI components</li>
        <li>Builds backend logic and APIs</li>
        <li>Structures your codebase using best practices</li>
        <li>Provides editable components and smart prompts for updates</li>
      </ul>
    `,
  },
  {
    question: "Do I Need to Create an Account?",
    answer: `
      <p>Yes, an account is required to unlock Imagine.bo’s full functionality, such as idea validation, MVP creation, and app development. Some features may be available without signing up.</p>
    `,
  },
  {
    question: "How Do I Get Started?",
    answer: `
      <p>Just follow these steps:</p>
      <ol class="list-decimal list-inside mb-2">
        <li>Sign up at <a href="https://www.imagine.bo" target="_blank">www.imagine.bo</a></li>
        <li>Describe your startup idea in simple English</li>
        <li>Follow the guided steps to analyze, research, and design your product</li>
        <li>Let our AI build and deploy your application—ready for testing or launch</li>
      </ol>
    `,
  },
  {
    question: "Can I Export My Work?",
    answer: `
      <p>Yes. You can:</p>
      <ul class="list-disc list-inside mb-2">
        <li>Export your business plan, customer personas, or site map as PDFs</li>
        <li>Export your generated code directly to GitHub</li>
      </ul>
    `,
  },
  {
    question: "Do I Need Technical Skills?",
    answer: `
      <p>No. Imagine.bo is built for non-technical users.<br/>
      You don’t need any programming experience to use our tools or build your application.</p>
    `,
  },
  {
    question: "Can Imagine.bo Help Me Validate My Business Idea?",
    answer: `
      <p>Yes. With Imagine.bo, you can:</p>
      <ul class="list-disc list-inside mb-2">
        <li>Analyze your idea’s potential with AI</li>
        <li>Conduct basic market research</li>
        <li>Design a working MVP</li>
        <li>Measure initial traction and user feedback</li>
      </ul>
    `,
  },
  {
    question: "What If the AI Can't Solve My Problem?",
    answer: `
      <p>You can assign your issue to a real human developer using our "Assign to Dev" feature.</p>
    `,
  },
  {
    question: "Is Developer Support Free?",
    answer: `
      <p>No, developer support is paid. Charges depend on the complexity and scope of the task.</p>
    `,
  },
  {
    question: "Can I Assign My Whole Project to a Developer?",
    answer: `
      <p>Yes. If you’re unsure how to modify code or content, you can fully hand over your project to a developer to make all the necessary changes.</p>
    `,
  },
  {
    question: "Can I Edit the Generated Website?",
    answer: `
      <p>Yes! All components are fully editable.<br/>
      You can also give follow-up prompts, and the AI will regenerate or modify the code as requested.</p>
    `,
  },
];

const FAQSection: React.FC = () => {
  return (
    <section className="bg-[#0f1116] text-black font-['Poppins'] py-5 px-4 flex justify-center">
      <div className="bg-gradient-to-b from-[#dbe5ed] to-[#fcddec] rounded-2xl max-w-4xl w-full p-6 md:p-10">
        {/* Heading - Responsive */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] mt-2 md:mt-4 text-[#1E1E1E] font-bold font-poppins text-center mb-2">
          FAQ
        </h2>
        <p className="text-center text-lg sm:text-xl md:text-2xl text-[#1E1E1E] mb-8 md:mb-16">
          Queries you might have about Imagine.bo
        </p>

        {/* Accordion - Responsive */}
        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="w-full"
        >
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-gray-300"
            >
              {/* Trigger: ONLY question + arrow */}
              <AccordionTrigger className="flex font-poppins justify-between items-center w-full text-base sm:text-lg md:text-xl text-left py-3 md:py-4 font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>

              {/* Content: ONLY answer */}
              <AccordionContent className="text-[12px] sm:text-base md:text-[17px] font-poppins text-gray-700 pb-3 md:pb-4">
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
