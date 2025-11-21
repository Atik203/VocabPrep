"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGetUsageStatsQuery } from "@/redux/features/ai/aiApi";
import { format } from "date-fns";
import { Award, Calendar, Sparkles, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

export function AIDashboard() {
  const { data, isLoading, error } = useGetUsageStatsQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Unable to load AI usage statistics
          </p>
        </CardContent>
      </Card>
    );
  }

  const {
    currentPeriod,
    subscriptionTier,
    totalLifetimeRequests,
    recentUsage,
  } = data.data;
  const usagePercentage = (currentPeriod.used / currentPeriod.limit) * 100;
  const isLowQuota = currentPeriod.remaining < 20;
  const isFree = subscriptionTier === "free";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">AI Usage Dashboard</h2>
          <p className="text-muted-foreground">
            Track your AI-powered learning activity
          </p>
        </div>
        <Badge
          variant={isFree ? "secondary" : "default"}
          className={isFree ? "" : "bg-linear-to-r from-purple-600 to-pink-600"}
        >
          {subscriptionTier === "free" ? "Free Tier" : "Premium"}
        </Badge>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Current Quota */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Remaining Requests
            </CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPeriod.remaining}</div>
            <p className="text-xs text-muted-foreground">
              of {currentPeriod.limit} {currentPeriod.periodType}
            </p>
            <Progress value={100 - usagePercentage} className="mt-3" />
            {isLowQuota && (
              <Badge variant="destructive" className="mt-2 text-xs">
                Running Low
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Used This Period */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Used This {currentPeriod.periodType === "daily" ? "Day" : "Month"}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPeriod.used}</div>
            <p className="text-xs text-muted-foreground">
              {usagePercentage.toFixed(1)}% of quota
            </p>
          </CardContent>
        </Card>

        {/* Lifetime Total */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lifetime Total
            </CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLifetimeRequests}</div>
            <p className="text-xs text-muted-foreground">AI requests made</p>
          </CardContent>
        </Card>

        {/* Reset Date */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resets On</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(new Date(currentPeriod.resetDate), "MMM d")}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(currentPeriod.resetDate), "h:mm a")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade CTA (if free tier) */}
      {isFree && (
        <Card className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Upgrade to Premium
            </CardTitle>
            <CardDescription>
              Get 500 AI requests per month with no daily limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">Only $3.99/month</p>
                <p className="text-sm text-muted-foreground">
                  5x more requests • Priority support • No daily caps
                </p>
              </div>
              <Button
                className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                asChild
              >
                <Link href="/pricing">Upgrade Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Usage History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your AI usage over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {recentUsage.length > 0 ? (
            <div className="space-y-3">
              {recentUsage.slice(0, 10).map((day) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-sm text-muted-foreground">
                      {format(new Date(day.date), "MMM d")}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {day.requests} requests
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {day.tokensUsed.toLocaleString()} tokens
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={day.successRate >= 90 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {day.successRate}% success
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No AI usage history yet. Start enhancing your vocabulary!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💡 Pro Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use AI enhancement to get better example sentences</li>
            <li>• Practice feedback helps you learn from mistakes faster</li>
            <li>• Your quota resets automatically - no action needed</li>
            <li>• Premium users can use requests anytime during the month</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
