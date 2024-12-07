"use server";

import { Issue, IssueWithUsers } from "@/lib/definitions";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

interface IssueRow extends Omit<Issue, 'reporter_name' | 'reporter_email' | 'assignee_name' | 'assignee_email'> {
  reporter_name: string | null;
  reporter_email: string | null;
  assignee_name: string | null;
  assignee_email: string | null;
}

export async function getProjectIssues(projectId: string): Promise<IssueWithUsers[]> {
  try {
    const issues = await sql<IssueRow>`
      SELECT 
        i.*,
        reporter.name as reporter_name,
        reporter.email as reporter_email,
        assignee.name as assignee_name,
        assignee.email as assignee_email
      FROM issues i
      LEFT JOIN bug_users reporter ON i.reporter_id = reporter.id
      LEFT JOIN bug_users assignee ON i.assignee_id = assignee.id
      WHERE i.project_id = ${projectId}
      ORDER BY 
        CASE 
          WHEN i.priority = 'critical' THEN 1
          WHEN i.priority = 'high' THEN 2
          WHEN i.priority = 'medium' THEN 3
          WHEN i.priority = 'low' THEN 4
        END,
        i.created_at DESC
    `;

    return issues.rows.map(issue => ({
      ...issue,
      reporter_name: issue.reporter_name || undefined,
      reporter_email: issue.reporter_email || undefined,
      assignee_name: issue.assignee_name || undefined,
      assignee_email: issue.assignee_email || undefined,
      assignee: issue.assignee_name ? {
        name: issue.assignee_name,
        email: issue.assignee_email!,
      } : null,
      reporter: {
        name: issue.reporter_name!,
        email: issue.reporter_email!,
      },
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

type IssueStats = {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
};

export async function getProjectIssueStats(projectId: string): Promise<IssueStats> {
  try {
    const stats = await sql<IssueStats>`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'open') as open,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved,
        COUNT(*) FILTER (WHERE status = 'closed') as closed
      FROM issues
      WHERE project_id = ${projectId}
    `;
    return stats.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createIssue(
  projectId: string,
  title: string,
  description: string,
  reporterEmail: string,
  priority: Issue['priority'] = 'medium',
  assigneeEmail?: string
): Promise<IssueWithUsers> {
  try {
    // First, get user IDs
    const reporter = await sql`
      SELECT id, name FROM bug_users WHERE email = ${reporterEmail}
    `;
    
    let assigneeId = null;
    let assigneeName = null;
    if (assigneeEmail) {
      const assignee = await sql`
        SELECT id, name FROM bug_users WHERE email = ${assigneeEmail}
      `;
      if (assignee.rows.length > 0) {
        assigneeId = assignee.rows[0].id;
        assigneeName = assignee.rows[0].name;
      }
    }

    const issue = await sql<IssueRow>`
      INSERT INTO issues (
        title, description, status, priority,
        project_id, reporter_id, assignee_id
      ) VALUES (
        ${title}, ${description}, 'open', ${priority},
        ${projectId}, ${reporter.rows[0].id}, ${assigneeId}
      )
      RETURNING *
    `;

    revalidatePath("/dashboard");
    revalidatePath(`/projects/${projectId}`);

    const createdIssue: IssueWithUsers = {
      ...issue.rows[0],
      reporter_name: reporter.rows[0].name,
      reporter_email: reporterEmail,
      assignee_name: assigneeName || undefined,
      assignee_email: assigneeEmail,
      assignee: assigneeEmail && assigneeName ? {
        name: assigneeName,
        email: assigneeEmail,
      } : null,
      reporter: {
        name: reporter.rows[0].name,
        email: reporterEmail,
      },
    };

    return createdIssue;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateIssueStatus(
  issueId: string,
  status: Issue['status'],
  // userEmail: string
): Promise<IssueWithUsers> {
  try {
    // First get the issue with user details
    const currentIssue = await sql<IssueRow>`
      SELECT 
        i.*,
        reporter.name as reporter_name,
        reporter.email as reporter_email,
        assignee.name as assignee_name,
        assignee.email as assignee_email
      FROM issues i
      LEFT JOIN bug_users reporter ON i.reporter_id = reporter.id
      LEFT JOIN bug_users assignee ON i.assignee_id = assignee.id
      WHERE i.id = ${issueId}
    `;

    if (!currentIssue.rows[0]) {
      throw new Error('Issue not found');
    }

    // Update the status
    const issue = await sql<IssueRow>`
      UPDATE issues
      SET 
        status = ${status},
        updated_at = NOW()
      WHERE id = ${issueId}
      RETURNING *
    `;

    const updatedIssue: IssueWithUsers = {
      ...issue.rows[0],
      reporter_name: currentIssue.rows[0].reporter_name || undefined,
      reporter_email: currentIssue.rows[0].reporter_email || undefined,
      assignee_name: currentIssue.rows[0].assignee_name || undefined,
      assignee_email: currentIssue.rows[0].assignee_email || undefined,
      assignee: currentIssue.rows[0].assignee_name ? {
        name: currentIssue.rows[0].assignee_name,
        email: currentIssue.rows[0].assignee_email!,
      } : null,
      reporter: {
        name: currentIssue.rows[0].reporter_name!,
        email: currentIssue.rows[0].reporter_email!,
      },
    };

    revalidatePath("/dashboard");
    revalidatePath(`/projects/${updatedIssue.project_id}`);
    
    return updatedIssue;
  } catch (error) {
    console.error(error);
    throw error;
  }
}