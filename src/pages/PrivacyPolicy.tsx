import React from "react";
import Navbar from "@/components/landing_page/Navbar";
import Footer from "@/components/landing_page/Footer";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen pt-8 bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-16 font-poppins">
        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Effective Date: October 4, 2025</p>

        <div className="space-y-8 text-foreground">
          <section>
            <p className="leading-relaxed">
              Your privacy matters to us. This Privacy Policy explains how Imagine.bo collects, uses, and protects your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Personal Data:</strong> Name, email, billing details, account credentials.</li>
              <li><strong>Usage Data:</strong> Device info, IP address, app performance logs.</li>
              <li><strong>Content:</strong> Projects and apps you create on Imagine.bo.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To provide and improve Services.</li>
              <li>To offer personalized support (including SDE assistance).</li>
              <li>To process payments and enforce our guarantee.</li>
              <li>To communicate updates, product changes, and promotional content (opt-out available).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
            <p className="leading-relaxed mb-4">
              We do not sell your data. We may share limited data with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Payment processors (for billing).</li>
              <li>Cloud hosting providers.</li>
              <li>Legal authorities, if required by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="leading-relaxed mb-4">
              We retain user data as long as your account is active or required by law.
            </p>
            <p className="leading-relaxed">
              You may request deletion of your account and associated data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Security</h2>
            <p className="leading-relaxed">
              We use encryption, secure servers, and role-based access to protect your data. However, no online service is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="leading-relaxed">
              Our Services are not intended for children under 13. We do not knowingly collect data from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">International Users</h2>
            <p className="leading-relaxed">
              Your data may be stored and processed in countries where we or our service providers operate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="leading-relaxed mb-4">
              Depending on your jurisdiction, you may have rights to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access, correct, or delete your data.</li>
              <li>Object to certain uses of your data.</li>
              <li>Port your data to another service.</li>
            </ul>
            <p className="leading-relaxed mt-4">
              To exercise rights, contact <a href="mailto:privacy@imagine.bo" className="text-primary hover:underline">privacy@imagine.bo</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to the Privacy Policy</h2>
            <p className="leading-relaxed">
              We may update this Policy to reflect changes in technology, law, or business practices. Updates will be posted with a new effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="leading-relaxed">
              For questions or requests, contact us:
            </p>
            <p className="leading-relaxed mt-2">
              📧 <a href="mailto:support@imagine.bo" className="text-primary hover:underline">support@imagine.bo</a>
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

export default PrivacyPolicy;
