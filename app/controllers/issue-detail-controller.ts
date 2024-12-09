"use server";

import { sql } from '@vercel/postgres';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {  IssueWithUsers } from '@/lib/definitions';

// Schema for fetching issue details
const IssueDetailSchema = z.object({
  issueId: z.string()
});

export async function getIssueDetails(formData: FormData): Promise<IssueWithUsers | null> {
  const session = await auth();
  
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      issueId: formData.get('issueId')
    };

    const validatedData = IssueDetailSchema.parse(rawData);

    const issueQuery = await sql<IssueWithUsers>`
      SELECT 
        i.*,
        reporter.id as reporter_id,
        reporter.name as reporter_name,
        reporter.email as reporter_email,
        assignee.id as assignee_id,
        assignee.name as assignee_name,
        assignee.email as assignee_email,
        p.name as project_name
      FROM issues i
      LEFT JOIN bug_users reporter ON i.reporter_id = reporter.id
      LEFT JOIN bug_users assignee ON i.assignee_id = assignee.id
      LEFT JOIN projects p ON i.project_id = p.id
      WHERE i.id = ${validatedData.issueId}
    `;

    if (issueQuery.rows.length === 0) {
      return null;
    }

    const issue = issueQuery.rows[0];

    return {
      ...issue,
      reporter: issue.reporter_id ? {
        id: issue.reporter_id,
        name: issue.reporter_name!,
        email: issue.reporter_email!
      } : null,
      assignee: issue.assignee_id ? {
        id: issue.assignee_id,
        name: issue.assignee_name!,
        email: issue.assignee_email!
      } : null,
      project_name: issue.project_name || undefined
    };
  } catch (error) {
    console.error('Error fetching issue details:', error);
    throw error;
  }
}

export async function getIssueComments(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      issueId: formData.get('issueId')
    };

    const validatedData = IssueDetailSchema.parse(rawData);

    const commentsQuery = await sql`
      SELECT 
        c.*,
        u.name as author_name,
        u.email as author_email
      FROM comments c
      JOIN bug_users u ON c.author_id = u.id
      WHERE c.issue_id = ${validatedData.issueId}
      ORDER BY c.created_at DESC
    `;

    return commentsQuery.rows;
  } catch (error) {
    console.error('Error fetching issue comments:', error);
    throw error;
  }
}

export async function addIssueComment(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      issueId: formData.get('issueId'),
      content: formData.get('content')
    };

    const validatedData = z.object({
      issueId: z.string(),
      content: z.string().min(1, "Comment cannot be empty")
    }).parse(rawData);

    // Find the current user's ID
    const userQuery = await sql`
      SELECT id FROM bug_users WHERE email = ${session.user.email}
    `;

    if (userQuery.rows.length === 0) {
      throw new Error('User not found');
    }

    const authorId = userQuery.rows[0].id;

    // Insert comment
    const commentQuery = await sql`
      INSERT INTO comments (issue_id, author_id, content, created_at)
      VALUES (${validatedData.issueId}, ${authorId}, ${validatedData.content}, NOW())
      RETURNING *
    `;

    revalidatePath(`/issues/${validatedData.issueId}`);

    return commentQuery.rows[0];
  } catch (error) {
    console.error('Error adding issue comment:', error);
    throw error;
  }
}

export async function deleteComment(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      commentId: formData.get('commentId')
    };

    const validatedData = z.object({
      commentId: z.string()
    }).parse(rawData);

    // Verify user ownership of comment
    const commentCheck = await sql`
      SELECT c.id, c.author_id, u.email
      FROM comments c
      JOIN bug_users u ON c.author_id = u.id
      WHERE c.id = ${validatedData.commentId}
    `;

    if (commentCheck.rows.length === 0) {
      throw new Error('Comment not found');
    }

    const comment = commentCheck.rows[0];

    // Check if current user is the comment author
    if (comment.email !== session.user.email) {
      throw new Error('Unauthorized to delete this comment');
    }

    // Delete comment
    await sql`
      DELETE FROM comments 
      WHERE id = ${validatedData.commentId}
    `;

    revalidatePath(`/issues/${comment.issue_id}`);

    return { 
      success: true, 
      message: 'Comment deleted successfully' 
    };
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}
