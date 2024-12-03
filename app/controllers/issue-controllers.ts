"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  project_id: string;
  assignee_id: string | null;
  reporter_id: string;
  created_at: string;
  updated_at: string;
  reporter_name?: string;
  assignee_name?: string;
}

export async function getProjectIssues(projectId: string) {
  try {
    const issues = await sql<Issue>`
      SELECT i.*, 
        reporter.name as reporter_name,
        assignee.name as assignee_name
      FROM issues i
      LEFT JOIN bug_users reporter ON i.reporter_id = reporter.id
      LEFT JOIN bug_users assignee ON i.assignee_id = assignee.id
      WHERE i.project_id = ${projectId}
      ORDER BY 
        CASE i.priority
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END,
        i.created_at DESC
    `;
    return issues.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getProjectIssueStats(projectId: string) {
  try {
    const stats = await sql`
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
  title: string,
  description: string,
  projectId: string,
  reporterEmail: string,
  priority: Issue['priority'] = 'medium',
  assigneeEmail?: string
) {
  try {
    const issue = await sql`
      INSERT INTO issues (
        title, description, project_id, priority,
        reporter_id, assignee_id, status
      ) VALUES (
        ${title},
        ${description},
        ${projectId},
        ${priority},
        (SELECT id FROM bug_users WHERE email = ${reporterEmail}),
        (SELECT id FROM bug_users WHERE email = ${assigneeEmail}),
        'open'
      )
      RETURNING *
    `;
    revalidatePath("/dashboard");
    revalidatePath("/projects/${projectId}");
    return issue.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateIssueStatus(
  issueId: string,
  status: Issue['status'],
  userEmail: string
) {
  try {
    const issue = await sql`
      UPDATE issues
      SET status = ${status},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${issueId}
      AND (
        project_id IN (
          SELECT id FROM projects WHERE owner_id = (SELECT id FROM bug_users WHERE email = ${userEmail})
        )
        OR
        assignee_id = (SELECT id FROM bug_users WHERE email = ${userEmail})
      )
      RETURNING *
    `;
    revalidatePath("/dashboard");
    revalidatePath("/projects/${issue.rows[0].project_id}");
    return issue.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}