import React from 'react';
import Navbar from "@/components/landing_page/Navbar";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactUs: React.FC = () => {

  return (
    <div className="min-h-screen pt-8 bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-16 font-poppins">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">Get In Touch</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Reach out using the contact information below.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8 animate-fade-up animation-delay-100">
          <div className="bg-card p-8 rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Email</h3>
                  <p className="text-muted-foreground">support@imaginebo.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Office</h3>
                  <p className="text-muted-foreground">123 Innovation Street<br />Tech City, TC 12345</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-xl border border-primary/20">
            <h3 className="text-xl font-semibold text-foreground mb-3">Quick Response</h3>
            <p className="text-muted-foreground">
              We typically respond within 24 hours during business days. For urgent matters, please call our support line.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>Powered by synergyLabs</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;