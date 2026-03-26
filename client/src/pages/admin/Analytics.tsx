import { useState } from "react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line
} from "recharts";
import { ArrowLeft, BarChart2, PieChart as PieIcon, Clock, RefreshCw } from "lucide-react";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6366f1", "#3b82f6"];

function AnalyticsContent() {
  const [_, setLocation] = useLocation();

  const {
    data: scoreDistribution,
    isLoading: loadingScore,
    refetch: refetchScore
  } = useQuery<{ range: string; count: number }[]>({
    queryKey: ["/api/admin/analytics/score-distribution"],
    staleTime: 30000,
  });

  const {
    data: passFailData,
    isLoading: loadingPassFail,
    refetch: refetchPassFail
  } = useQuery<{ passed: number; failed: number; pending: number }>({
    queryKey: ["/api/admin/analytics/pass-fail"],
    staleTime: 30000,
  });

  const {
    data: avgTimeData,
    isLoading: loadingAvgTime,
    refetch: refetchAvgTime
  } = useQuery<{ examTitle: string; avgMinutes: number }[]>({
    queryKey: ["/api/admin/analytics/avg-time"],
    staleTime: 30000,
  });

  const passFailPieData = passFailData
    ? [
        { name: "Shortlisted / Selected", value: passFailData.passed },
        { name: "Rejected", value: passFailData.failed },
        { name: "Pending Review", value: passFailData.pending },
      ].filter(d => d.value > 0)
    : [];

  const totalAttempts = passFailData
    ? passFailData.passed + passFailData.failed + passFailData.pending
    : 0;

  function handleRefresh() {
    refetchScore();
    refetchPassFail();
    refetchAvgTime();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/admin")}
              data-testid="button-back-dashboard"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Performance insights across all exams</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} data-testid="button-refresh-analytics">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <BarChart2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Attempts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-total-attempts">
                    {loadingPassFail ? "—" : totalAttempts}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <PieIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pass Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-pass-rate">
                    {loadingPassFail || !passFailData
                      ? "—"
                      : totalAttempts > 0
                      ? `${Math.round((passFailData.passed / totalAttempts) * 100)}%`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg Time (across exams)</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-avg-time">
                    {loadingAvgTime || !avgTimeData || avgTimeData.length === 0
                      ? "—"
                      : `${Math.round(
                          avgTimeData.reduce((s, d) => s + d.avgMinutes, 0) /
                            avgTimeData.filter(d => d.avgMinutes > 0).length || 0
                        )} min`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Score Distribution Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart2 className="h-4 w-4 text-indigo-500" />
                Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingScore ? (
                <div className="h-64 flex items-center justify-center text-gray-400">Loading…</div>
              ) : !scoreDistribution || scoreDistribution.every(d => d.count === 0) ? (
                <div className="h-64 flex items-center justify-center text-gray-400">No completed attempts yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={scoreDistribution} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, fontSize: 13 }}
                      formatter={(value) => [`${value} candidates`, "Count"]}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Candidates" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Pass vs Fail Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieIcon className="h-4 w-4 text-emerald-500" />
                Result Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPassFail ? (
                <div className="h-64 flex items-center justify-center text-gray-400">Loading…</div>
              ) : passFailPieData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-400">No attempts yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={passFailPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {passFailPieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} candidates`]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Average Time Taken Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-blue-500" />
              Average Time Taken per Exam (minutes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAvgTime ? (
              <div className="h-64 flex items-center justify-center text-gray-400">Loading…</div>
            ) : !avgTimeData || avgTimeData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400">No exam data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={avgTimeData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis
                    dataKey="examTitle"
                    tick={{ fontSize: 11 }}
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} unit=" min" />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, fontSize: 13 }}
                    formatter={(value) => [`${value} minutes`, "Avg Time"]}
                  />
                  <Bar dataKey="avgMinutes" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Avg Time (min)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Analytics() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AnalyticsContent />
    </ProtectedRoute>
  );
}
