import { auth } from "@/auth";

import { Donut } from "@/app/ui/chart/pie-chart";
import { getIssuesPriorityByUser, getIssuesStatsByUser, getIssueWorkload } from "@/app/controllers/issue-controllers";
import { BarComponent } from "@/app/ui/chart/bar";

export default async function ReportsPage() {
  const session = await auth();
  const email = session?.user?.email;

  const stats = await getIssuesStatsByUser(email as string);
  const issues = await getIssuesPriorityByUser(email as string);
  const workload = await getIssueWorkload();
  
  return (
    <div className="container p-5  ">
      <div className="flex gap-4 justify-around mb-5">
        <div className="flex-auto max-w-md">
          <Donut stats={stats} name="Status" />
        </div>
        <div className="flex-auto max-w-md">
          <Donut stats={issues} name="Priority" />
        </div>
      </div>
        <div className="w-3/4 m-auto">
        <BarComponent workload={workload} />
        </div>
        
    </div>
  )
}