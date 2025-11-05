import React from "react";
import Navbar from "@/components/landing_page/Navbar";
import Footer from "@/components/landing_page/Footer";

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen pt-8 bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-16 font-poppins">
        <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Use</h1>
        <p className="text-muted-foreground mb-8">Effective Date: October 4, 2025</p>

        <div className="space-y-8 text-foreground">
          <section>
            <p className="leading-relaxed">
              Welcome to Imagine.bo to build your application. By accessing or using our platform, users agree to be bound by these Terms of Use. We've highlighted some important parameters around usage below. Please read carefully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Nature of Services</h2>
            <p className="leading-relaxed">
              Imagine.bo is a no-code application development platform with software development engineer ("SDE") support. Our mission is to help non-technical founders and teams build, launch, and scale functional applications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Guarantee</h2>
            <p className="leading-relaxed mb-4">
              We guarantee that every paid user will be able to launch an application capable of handling at least 1,000 transactions per second (TPS) provided the following conditions are met:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You follow Imagine.bo's recommended build process, templates, and best practices.</li>
              <li>You engage with our SDE (Software Development Engineer) support team whenever you encounter blockers or need performance-related assistance.</li>
              <li>You do not materially alter performance-critical architecture against the guidance of our SDEs.</li>
            </ul>
            <p className="leading-relaxed mt-4">
              If, after meeting the above conditions, your application cannot achieve 1,000 TPS, you are entitled to a 100% refund of subscription fees paid in the last 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Eligibility</h2>
            <p className="leading-relaxed">
              You must be at least 18 years old to use Imagine.bo. By using our Services, you confirm that you have the legal capacity to enter into this Agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Accounts</h2>
            <p className="leading-relaxed mb-2">You agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Maintain the confidentiality of your login credentials.</li>
              <li>Notify us immediately of unauthorized use of your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptable Use</h2>
            <p className="leading-relaxed mb-2">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the Services for illegal or fraudulent purposes.</li>
              <li>Upload malicious code, viruses, or attempt to disrupt Imagine.bo systems.</li>
              <li>Violate intellectual property rights of others.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You retain ownership of apps you create on Imagine.bo.</li>
              <li>All rights, title, and interest in Imagine.bo, its software, trademarks, and content remain our property.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Payments & Refunds</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Fees are charged on a subscription basis.</li>
              <li>Refunds are only issued under the performance guarantee clause or as required by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Integrations</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Imagine.bo may integrate with external APIs and services.</li>
              <li>We are not responsible for downtime, changes, or failures of third-party providers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To the maximum extent permitted by law, Imagine.bo will not be liable for indirect, incidental, or consequential damages.</li>
              <li>Our total liability will not exceed the amount you paid us in the 12 months preceding a claim.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="leading-relaxed">
              We may suspend or terminate your account if you violate these Terms. You may cancel at any time, but fees are non-refundable except as covered by the guarantee.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p className="leading-relaxed">
              These Terms are governed by the laws of India (HQ jurisdiction), unless otherwise required by local law where you reside.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes</h2>
            <p className="leading-relaxed">
              We may update these Terms periodically. Continued use means you accept the updated Terms.
            </p>
          </section>

          <section className="pt-8 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Developed by <span className="font-semibold">synergyLabs</span>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
