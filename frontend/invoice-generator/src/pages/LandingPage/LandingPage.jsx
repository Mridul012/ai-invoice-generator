import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Sparkles,
  FileText,
  BarChart3,
  ClipboardPaste,
  Cpu,
  Download,
  Zap,
  ShieldCheck,
  Clock,
  TrendingUp,
} from "lucide-react";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: Sparkles,
      title: "AI Invoice Generator",
      description:
        "Paste raw text and let AI extract client details, items, and prices automatically.",
    },
    {
      icon: FileText,
      title: "Invoice Management",
      description:
        "Create, view, and manage all your invoices in one place with status tracking.",
    },
    {
      icon: BarChart3,
      title: "Dashboard Analytics",
      description:
        "Get a quick overview of total invoices, revenue, and pending payments.",
    },
  ];

  const steps = [
    {
      icon: ClipboardPaste,
      step: "1",
      title: "Paste Invoice Text",
      description: "Copy and paste any invoice or billing text into the AI parser.",
    },
    {
      icon: Cpu,
      step: "2",
      title: "AI Extracts Data",
      description: "Our AI reads the text and extracts structured invoice data instantly.",
    },
    {
      icon: Download,
      step: "3",
      title: "Generate & Download",
      description: "Review the extracted data, create the invoice, and download it.",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Save Time with Automation",
      description: "No more manual data entry — let AI do the heavy lifting.",
    },
    {
      icon: ShieldCheck,
      title: "Reduce Manual Errors",
      description: "AI ensures accurate extraction of names, amounts, and items.",
    },
    {
      icon: Clock,
      title: "Generate Invoices Instantly",
      description: "Create professional invoices in seconds, not minutes.",
    },
    {
      icon: TrendingUp,
      title: "Smart Business Insights",
      description: "Track revenue, pending payments, and invoice trends from your dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-800">AI Invoice</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-20 md:py-28 px-4">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 max-w-3xl mx-auto leading-tight tracking-tight">
          Generate Professional Invoices in Seconds
        </h1>
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
          Use AI to extract invoice data from text and create clean invoices
          instantly. No more manual work.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="bg-blue-600 text-white px-8 py-3.5 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="border border-gray-300 text-gray-700 px-8 py-3.5 rounded-lg text-base font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            Try AI Generator
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-3">
            Features
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-lg mx-auto text-base md:text-lg">
            Everything you need to manage invoices smarter and faster.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md hover:scale-[1.02] transition-all duration-200"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-3">
            How It Works
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-lg mx-auto text-base md:text-lg">
            Three simple steps to go from raw text to a professional invoice.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                  Step {step.step}
                </span>
                <h3 className="text-lg font-semibold text-gray-800 mt-2 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-3">
            Why Choose AI Invoice
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-lg mx-auto text-base md:text-lg">
            Built for freelancers, small businesses, and students who need
            simple invoicing.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <benefit.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-500">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ready to Simplify Your Invoicing?
          </h2>
          <p className="text-gray-500 mb-8 text-base md:text-lg">
            Join and start generating professional invoices with AI today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="bg-blue-600 text-white px-8 py-3.5 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-gray-300 text-gray-700 px-8 py-3.5 rounded-lg text-base font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Try AI Generator
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-gray-100">
        <p className="text-sm text-gray-400">
          © 2026 AI Invoice Generator.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;