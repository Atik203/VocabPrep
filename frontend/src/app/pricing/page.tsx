"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

const pricingTiers = [
  {
    name: "Free Tier",
    price: 0,
    period: "forever",
    description: "Perfect for casual learners getting started",
    requests: 100,
    requestPeriod: "per day",
    features: [
      "100 AI requests per day",
      "Vocabulary enhancement with AI",
      "Practice feedback and suggestions",
      "Access to all vocabulary features",
      "Word progress tracking",
      "Quiz generation",
      "Example sentences",
    ],
    limitations: [
      "Daily limit resets at midnight UTC",
      "Standard response time",
    ],
    cta: "Current Plan",
    highlighted: false,
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Premium",
    price: 3.99,
    period: "per month",
    description: "For serious learners who want unlimited growth",
    requests: 500,
    requestPeriod: "per month",
    badge: "Best Value",
    features: [
      "500 AI requests per month",
      "Everything in Free tier",
      "Priority AI response time",
      "Advanced vocabulary suggestions",
      "No daily limits - use anytime",
      "Personalized learning insights",
      "Export your progress data",
      "Priority email support",
    ],
    limitations: [],
    cta: "Upgrade to Premium",
    highlighted: true,
    icon: Crown,
    color: "from-purple-500 to-pink-500",
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <Badge className="mb-4" variant="secondary">
          <Zap className="w-3 h-3 mr-1" />
          AI-Powered Learning
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-600">
          Choose Your Learning Plan
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Start with our generous free tier. Upgrade anytime to unlock premium
          features and accelerate your vocabulary mastery.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
        {pricingTiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <Card
              key={tier.name}
              className={`relative ${
                tier.highlighted
                  ? "border-2 border-purple-500 shadow-2xl scale-105"
                  : "border"
              }`}
            >
              {tier.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-purple-500 to-pink-500">
                  {tier.badge}
                </Badge>
              )}

              <CardHeader className="text-center pb-8">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br ${tier.color} flex items-center justify-center`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-base">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center py-4">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold">${tier.price}</span>
                    <span className="text-muted-foreground">
                      /{tier.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {tier.requests} AI requests {tier.requestPeriod}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Limitations */}
                {tier.limitations.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">
                      Limitations:
                    </p>
                    <ul className="space-y-1">
                      {tier.limitations.map((limitation) => (
                        <li
                          key={limitation}
                          className="text-xs text-muted-foreground flex items-start gap-2"
                        >
                          <span>•</span>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${
                    tier.highlighted
                      ? "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      : ""
                  }`}
                  variant={tier.highlighted ? "default" : "outline"}
                  size="lg"
                  asChild
                >
                  <Link href={tier.highlighted ? "/checkout" : "/dashboard"}>
                    {tier.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Feature Comparison
        </h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Feature</th>
                <th className="text-center p-4 font-semibold">Free</th>
                <th className="text-center p-4 font-semibold">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-4">AI Requests</td>
                <td className="text-center p-4">100/day</td>
                <td className="text-center p-4 font-semibold text-purple-600">
                  500/month
                </td>
              </tr>
              <tr>
                <td className="p-4">Vocabulary Enhancement</td>
                <td className="text-center p-4">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center p-4">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="p-4">Practice Feedback</td>
                <td className="text-center p-4">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center p-4">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="p-4">Response Priority</td>
                <td className="text-center p-4 text-muted-foreground">
                  Standard
                </td>
                <td className="text-center p-4 font-semibold text-purple-600">
                  High Priority
                </td>
              </tr>
              <tr>
                <td className="p-4">Daily Limits</td>
                <td className="text-center p-4 text-muted-foreground">
                  Yes (resets daily)
                </td>
                <td className="text-center p-4 font-semibold text-purple-600">
                  No daily limits
                </td>
              </tr>
              <tr>
                <td className="p-4">Progress Export</td>
                <td className="text-center p-4 text-muted-foreground">-</td>
                <td className="text-center p-4">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="p-4">Email Support</td>
                <td className="text-center p-4 text-muted-foreground">
                  Community
                </td>
                <td className="text-center p-4 font-semibold text-purple-600">
                  Priority
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">
              What happens when I reach my AI request limit?
            </h3>
            <p className="text-sm text-muted-foreground">
              Free tier users will need to wait until midnight UTC for their
              quota to reset. Premium users have a monthly quota that provides
              much more flexibility. You can still use all other features
              without AI assistance.
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
            <p className="text-sm text-muted-foreground">
              Yes! Premium subscriptions can be canceled anytime. You'll
              continue to have access until the end of your billing period, then
              automatically revert to the free tier.
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">
              How is an "AI request" counted?
            </h3>
            <p className="text-sm text-muted-foreground">
              Each time you use AI to enhance vocabulary or get practice
              feedback counts as one request. Simple lookups and non-AI features
              don't count toward your limit.
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">
              Is my payment information secure?
            </h3>
            <p className="text-sm text-muted-foreground">
              Absolutely. We use Stripe for payment processing, which is
              PCI-compliant and trusted by millions of businesses worldwide. We
              never store your credit card information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
