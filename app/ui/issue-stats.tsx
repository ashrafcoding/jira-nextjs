import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDot, Clock, CheckCircle2, XCircle } from "lucide-react";

interface IssueStatsProps {
  stats: {
    total: number;
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
}

export function IssueStats({ stats }: IssueStatsProps) {
  const statCards = [
    {
      title: "Total Issues",
      value: stats.total,
      icon: CircleDot,
      className: "text-blue-500 bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "In Progress",
      value: stats.in_progress,
      icon: Clock,
      className: "text-yellow-500 bg-yellow-50 dark:bg-yellow-950",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      className: "text-green-500 bg-green-50 dark:bg-green-950",
    },
    {
      title: "Closed",
      value: stats.closed,
      icon: XCircle,
      className: "text-red-500 bg-red-50 dark:bg-red-950",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.className}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}