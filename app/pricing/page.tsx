"use client";

import { Button } from "@/components/ui/button";
import { Bird, Check, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    emails: "50",
    description: "Perfect for trying out NightOwl Mail",
    features: [
      "50 emails per month",
      "Basic email editor",
      "1 email template",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Starter",
    price: "$9.99",
    period: "/month",
    emails: "400",
    description: "For small businesses and creators",
    features: [
      "400 emails per month",
      "Advanced email editor",
      "10 email templates",
      "Priority support",
      "Custom sender name",
    ],
    cta: "Subscribe",
    popular: false,
  },
  {
    name: "Professional",
    price: "$19.99",
    period: "/month",
    emails: "1,200",
    description: "For growing businesses",
    features: [
      "1,200 emails per month",
      "All editor features",
      "Unlimited templates",
      "Priority support",
      "Custom sender name",
      "Analytics dashboard",
    ],
    cta: "Subscribe",
    popular: true,
  },
  {
    name: "Business",
    price: "$49.99",
    period: "/month",
    emails: "5,000",
    description: "For established businesses",
    features: [
      "5,000 emails per month",
      "All Professional features",
      "API access",
      "Team collaboration",
      "Advanced analytics",
      "Dedicated support",
    ],
    cta: "Subscribe",
    popular: false,
  },
  {
    name: "Enterprise",
    price: "$99.99",
    period: "/month",
    emails: "15,000",
    description: "For large organizations",
    features: [
      "15,000 emails per month",
      "All Business features",
      "Custom integrations",
      "SLA guarantee",
      "Account manager",
      "White-label option",
    ],
    cta: "Subscribe",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Bird className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">NightOwl Mail</h1>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Back to Editor
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
          <p className="text-sm text-muted-foreground">
            All plans include our beautiful email editor and responsive templates.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border ${
                  plan.popular
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border bg-card"
                } p-6 flex flex-col`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <div className="flex items-center gap-2 mb-6 pb-6 border-b border-border">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">
                    <strong>{plan.emails}</strong> emails/month
                  </span>
                </div>

                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => alert("Coming soon!")}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 border-t border-border bg-card/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Need more than 15,000 emails?
          </h2>
          <p className="text-muted-foreground mb-6">
            Contact us for a custom enterprise plan tailored to your specific needs.
            We offer volume discounts and custom integrations.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={() => window.location.href = "mailto:contact@nightowlmail.com"}
          >
            <Mail className="h-4 w-4" />
            Contact Sales
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Bird className="h-4 w-4 text-primary" />
          <span>NightOwl Mail - Professional Email Marketing</span>
        </div>
      </footer>
    </div>
  );
}
