import React from 'react';
import { Link } from "wouter";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-semibold text-white font-sans">
                SafeSpace
              </span>
            </div>
            <p className="text-neutral-400 text-sm">
              Finding your perfect home with complete transparency on safety,
              environment, and accessibility.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Features
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-neutral-400 hover:text-white text-sm"
                >
                  Safety Scores
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-neutral-400 hover:text-white text-sm"
                >
                  Environmental Metrics
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-neutral-400 hover:text-white text-sm"
                >
                  HDI Analysis
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-neutral-400 hover:text-white text-sm"
                >
                  Disaster Risk Assessment
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-neutral-400 hover:text-white text-sm"
                >
                  Safety Data Sources
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-neutral-400 hover:text-white text-sm"
                >
                  Environmental Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-neutral-400 hover:text-white text-sm"
                >
                  Accessibility Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-neutral-400 hover:text-white text-sm"
                >
                  Property Evaluations
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center text-neutral-400 text-sm">
                <Mail className="h-4 w-4 mr-2" />
                info@safespace.com
              </li>
              <li className="flex items-center text-neutral-400 text-sm">
                <Phone className="h-4 w-4 mr-2" />
                (555) 123-4567
              </li>
              <li className="flex items-center text-neutral-400 text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                Portland, OR
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-800 text-center">
          <p className="text-neutral-400 text-sm">
            &copy; {new Date().getFullYear()} SafeSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
