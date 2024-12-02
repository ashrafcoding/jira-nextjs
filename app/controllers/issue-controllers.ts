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
}

export async function getProjectIssues(projectId: string) {
  try {
    const issues = await sql`
      SELECT i.*, 
        reporter.name as reporter_name,
        assignee.name as assignee_name
      FROM issues i
      LEFT JOIN bug_users reporter ON i.reporter_id = reporter.id
      LEFT JOIN bug_users assignee ON i.assignee_id = assignee.id
      WHERE i.project_id = ${projectId}
      ORDER BY i.created_at DESC
    `;
    return issues.rows;
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
        reporter_id, assignee_id
      ) VALUES (
        ${title},
        ${description},
        ${projectId},
        ${priority},
        (SELECT id FROM bug_users WHERE email = ${reporterEmail}),
        (SELECT id FROM bug_users WHERE email = ${assigneeEmail})
      )
      RETURNING *
    `;
    revalidatePath("/dashboard");
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
    return issue.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}