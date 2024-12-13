// import 'server-only';
"use server";
import { sql } from '@vercel/postgres';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Issue, IssueWithUsers } from '@/lib/definitions';

interface IssueRow extends Omit<Issue, 'reporter_name' | 'reporter_email' | 'assignee_name' | 'assignee_email'> {
  reporter_name: string | null;
  reporter_email: string | null;
  assignee_name: string | null;
  assignee_email: string | null;
}

// Schema for issue editing
const EditIssueSchema = z.object({
  issueId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  assigneeEmail: z.string().email().optional().nullable()
});

// Schema for issue deletion
const DeleteIssueSchema = z.object({
  issueId: z.string()
});

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

export async function getIssuesStatsByUser(email: string): Promise<IssueStats> {
  try {
    const stats = await sql<IssueStats>`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'open') as open,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved,
        COUNT(*) FILTER (WHERE status = 'closed') as closed
      FROM issues
      WHERE reporter_id = (SELECT id FROM bug_users WHERE email = ${email})
    `;
    return stats.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
} 

export async function getIssuesPriorityByUser(email: string): Promise<IssueStats> {
  try {
    const stats = await sql<IssueStats>`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE priority = 'critical') as critical,
        COUNT(*) FILTER (WHERE priority = 'high') as high,
        COUNT(*) FILTER (WHERE priority = 'medium') as medium,
        COUNT(*) FILTER (WHERE priority = 'low') as low
      FROM issues
      WHERE reporter_id = (SELECT id FROM bug_users WHERE email = ${email})
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

export async function editIssue(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  try {
    // Parse and validate input
    const rawData = {
      issueId: formData.get('issueId'),
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      status: formData.get('status'),
      assigneeEmail: formData.get('assigneeEmail')
    };

    const validatedData = EditIssueSchema.parse(rawData);

    // First, validate user permissions
    const userCheck = await sql`
      SELECT id FROM bug_users WHERE email = ${session.user.email}
    `;

    if (userCheck.rows.length === 0) {
      throw new Error('User not found');
    }

    // Get current issue details
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
      WHERE i.id = ${validatedData.issueId}
    `;

    if (!currentIssue.rows[0]) {
      throw new Error('Issue not found');
    }

    // Prepare assignee update if provided
    let assigneeId = null;
    if (validatedData.assigneeEmail) {
      const assignee = await sql`
        SELECT id FROM bug_users WHERE email = ${validatedData.assigneeEmail}
      `;
      if (assignee.rows.length > 0) {
        assigneeId = assignee.rows[0].id;
      }
    }

    // Update issue
    const issue = await sql<IssueRow>`
      UPDATE issues
      SET 
        title = COALESCE(${validatedData.title}, title),
        description = COALESCE(${validatedData.description}, description),
        priority = COALESCE(${validatedData.priority}, priority),
        status = COALESCE(${validatedData.status}, status),
        assignee_id = COALESCE(${assigneeId}, assignee_id),
        updated_at = NOW()
      WHERE id = ${validatedData.issueId}
      RETURNING *
    `;

    const updatedIssue: IssueWithUsers = {
      ...issue.rows[0],
      reporter_name: currentIssue.rows[0].reporter_name || undefined,
      reporter_email: currentIssue.rows[0].reporter_email || undefined,
      assignee_name: currentIssue.rows[0].assignee_name || undefined,
      assignee_email: validatedData.assigneeEmail || currentIssue.rows[0].assignee_email || undefined,
      assignee: validatedData.assigneeEmail ? {
        name: currentIssue.rows[0].assignee_name!,
        email: validatedData.assigneeEmail,
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
    console.error('Error editing issue:', error);
    throw error;
  }
}

export async function deleteIssue(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      issueId: formData.get('issueId')
    };

    const validatedData = DeleteIssueSchema.parse(rawData);

    // First, validate user permissions
    const userCheck = await sql`
      SELECT id FROM bug_users WHERE email = ${session.user.email}
    `;

    if (userCheck.rows.length === 0) {
      throw new Error('User not found');
    }

    // Get issue details to check project
    const issueCheck = await sql`
      SELECT project_id FROM issues WHERE id = ${validatedData.issueId}
    `;

    if (issueCheck.rows.length === 0) {
      throw new Error('Issue not found');
    }

    // Delete the issue
    await sql`
      DELETE FROM issues 
      WHERE id = ${validatedData.issueId}
    `;

    revalidatePath("/dashboard");
    revalidatePath(`/projects/${issueCheck.rows[0].project_id}`);

    return { 
      success: true, 
      message: 'Issue deleted successfully' 
    };
  } catch (error) {
    console.error('Error deleting issue:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

export async function getUserIssues(email: string): Promise<IssueWithUsers[]> {
  try {
    const issues = await sql<IssueWithUsers>`
      SELECT 
        i.*,
        reporter.name as reporter_name,
        reporter.email as reporter_email,
        assignee.name as assignee_name,
        assignee.email as assignee_email
      FROM issues i
      LEFT JOIN bug_users reporter ON i.reporter_id = reporter.id
      LEFT JOIN bug_users assignee ON i.assignee_id = assignee.id
      WHERE reporter.email = ${email}  
      ORDER BY 
        CASE 
          WHEN i.priority = 'critical' THEN 1
          WHEN i.priority = 'high' THEN 2
          WHEN i.priority = 'medium' THEN 3
          WHEN i.priority = 'low' THEN 4
        END,
        i.created_at DESC
    `;
    return issues.rows;
  } catch (error) {
    console.error('Error fetching user issues:', error);
    throw error;
  }
} 

// Display the number of issues assigned to each team member, showing workload distribution.    
export async function getIssueWorkload(): Promise<{ [key: string]: number }> {
  try {
    const workload = await sql<{
      name: string;  count: number 
}>`
      SELECT u.name, COUNT(*) as count
      FROM issues i
      JOIN bug_users u ON i.assignee_id = u.id
      GROUP BY u.name
      ORDER BY count DESC
    `;
    return workload.rows.reduce((acc, item) => {
      acc[item.name] = item.count;
      return acc;
    }, {} as { [key: string]: number });
  } catch (error) {
    console.error('Error fetching issue workload:', error);
    throw error;
  }
}