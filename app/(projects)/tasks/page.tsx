import { getUserIssues } from "@/app/controllers/issue-controllers";
import ProjectIssuesClient from "@/app/ui/issue/project-issues-client";
import { auth } from "@/auth";

export default async function TasksPage() {
    // get user email
    const session = await auth();
    const email = session?.user?.email;
    const issues = await getUserIssues(email as string);
    return <ProjectIssuesClient issues={issues}  />;

  
}