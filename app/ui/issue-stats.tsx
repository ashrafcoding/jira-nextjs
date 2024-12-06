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
      className: "text-gray-500",
    },
    {
      title: "In Progress",
      value: stats.in_progress,
      icon: Clock,
      className: "text-yellow-500",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      className: "text-green-500",
    },
    {
      title: "Closed",
      value: stats.closed,
      icon: XCircle,
      className: "text-red-500",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.className}`} />
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