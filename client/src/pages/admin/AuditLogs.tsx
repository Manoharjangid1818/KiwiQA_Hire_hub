import { useState } from "react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ArrowLeft, Shield, Search, RefreshCw, User, Settings, BookOpen, Code } from "lucide-react";
import { format } from "date-fns";

type AuditLog = {
  id: number;
  userId: number | null;
  userEmail: string | null;
  userRole: string | null;
  action: string;
  metadata: Record<string, any> | null;
  timestamp: string | null;
};

const ACTION_ICONS: Record<string, any> = {
  "Created exam": BookOpen,
  "Deleted exam": BookOpen,
  "Started exam": User,
  "Submitted exam": User,
  "Created coding question": Code,
  "Deleted coding question": Code,
  "Submitted coding solution": Code,
};

function getActionColor(action: string): string {
  if (action.toLowerCase().includes("delete")) return "destructive";
  if (action.toLowerCase().includes("created") || action.toLowerCase().includes("submitted")) return "default";
  if (action.toLowerCase().includes("started")) return "secondary";
  return "outline";
}

function AuditLogsContent() {
  const [_, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");

  const { data: logs, isLoading, refetch } = useQuery<AuditLog[]>({
    queryKey: ["/api/admin/audit-logs"],
    staleTime: 15000,
  });

  const uniqueActions = Array.from(new Set(logs?.map(l => l.action) ?? []));

  const filtered = (logs ?? []).filter(log => {
    const matchSearch =
      !search ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.userEmail ?? "").toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || log.userRole === roleFilter;
    const matchAction = actionFilter === "all" || log.action === actionFilter;
    return matchSearch && matchRole && matchAction;
  });

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="h-6 w-6 text-indigo-500" />
                Audit Logs
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track all admin and candidate actions
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} data-testid="button-refresh-logs">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-9"
                  placeholder="Search by action or email…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  data-testid="input-search-logs"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40" data-testid="select-role-filter">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="student">Student / Candidate</SelectItem>
                </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-52" data-testid="select-action-filter">
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  {uniqueActions.map(a => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(search || roleFilter !== "all" || actionFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setSearch(""); setRoleFilter("all"); setActionFilter("all"); }}
                  data-testid="button-clear-filters"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {isLoading ? "Loading…" : `${filtered.length} entries`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center text-gray-400">Loading audit logs…</div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                {logs?.length === 0 ? "No audit logs yet. Actions will appear here." : "No logs match your filters."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left pb-3 text-gray-500 dark:text-gray-400 font-medium">Timestamp</th>
                      <th className="text-left pb-3 text-gray-500 dark:text-gray-400 font-medium">User</th>
                      <th className="text-left pb-3 text-gray-500 dark:text-gray-400 font-medium">Role</th>
                      <th className="text-left pb-3 text-gray-500 dark:text-gray-400 font-medium">Action</th>
                      <th className="text-left pb-3 text-gray-500 dark:text-gray-400 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(log => {
                      const Icon = ACTION_ICONS[log.action] ?? Settings;
                      return (
                        <tr
                          key={log.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          data-testid={`row-audit-log-${log.id}`}
                        >
                          <td className="py-3 pr-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {log.timestamp
                              ? format(new Date(log.timestamp), "MMM d, yyyy HH:mm:ss")
                              : "—"}
                          </td>
                          <td className="py-3 pr-4">
                            <span className="text-gray-800 dark:text-gray-200" data-testid={`text-log-email-${log.id}`}>
                              {log.userEmail ?? "System"}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <Badge
                              variant={log.userRole === "admin" ? "default" : "secondary"}
                              className="capitalize"
                              data-testid={`badge-role-${log.id}`}
                            >
                              {log.userRole ?? "—"}
                            </Badge>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <Icon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                              <Badge
                                variant={getActionColor(log.action) as any}
                                data-testid={`badge-action-${log.id}`}
                              >
                                {log.action}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-3 text-gray-500 dark:text-gray-400 text-xs max-w-xs truncate">
                            {log.metadata
                              ? Object.entries(log.metadata)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(" · ")
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuditLogs() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AuditLogsContent />
    </ProtectedRoute>
  );
}
