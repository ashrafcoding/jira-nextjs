"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

export async function createSprint(
  projectId: string,
  name: string,
  startDate: Date,
  endDate: Date,
  goal?: string
) {
  try {
    const result = await sql`
      INSERT INTO sprints (project_id, name, start_date, end_date, goal, status)
      VALUES (${projectId}, ${name}, ${startDate.toISOString()}, ${endDate.toISOString()}, ${goal}, 'planned')
      RETURNING *
    `;
    revalidatePath('/dashboard/projects/[id]', 'page');
    return result.rows[0];
  } catch (error) {
    console.error('Error creating sprint:', error);
    throw error;
  }
}

export async function getProjectSprints(projectId: string) {
  try {
    const sprints = await sql`
      SELECT * FROM sprints 
      WHERE project_id = ${projectId}
      ORDER BY start_date DESC
    `;
    return sprints.rows;
  } catch (error) {
    console.error('Error getting sprints:', error);
    throw error;
  }
}

export async function updateSprint(
  sprintId: string,
  name: string,
  startDate: Date,
  endDate: Date,
  goal?: string,
  status?: 'planned' | 'active' | 'completed'
) {
  try {
    const result = await sql`
      UPDATE sprints
      SET name = ${name},
          start_date = ${startDate.toISOString()},
          end_date = ${endDate.toISOString()},
          goal = ${goal},
          status = COALESCE(${status}, status)
      WHERE id = ${sprintId}
      RETURNING *
    `;
    revalidatePath('/dashboard/projects/[id]', 'page');
    return result.rows[0];
  } catch (error) {
    console.error('Error updating sprint:', error);
    throw error;
  }
}

export async function deleteSprint(sprintId: string) {
  try {
    await sql`
      DELETE FROM sprints
      WHERE id = ${sprintId}
    `;
    revalidatePath('/dashboard/projects/[id]', 'page');
  } catch (error) {
    console.error('Error deleting sprint:', error);
    throw error;
  }
}

export async function startSprint(sprintId: string) {
  try {
    const result = await sql`
      UPDATE sprints
      SET status = 'active',
          started_at = CURRENT_TIMESTAMP
      WHERE id = ${sprintId}
      RETURNING *
    `;
    revalidatePath('/dashboard/projects/[id]', 'page');
    return result.rows[0];
  } catch (error) {
    console.error('Error starting sprint:', error);
    throw error;
  }
}

export async function completeSprint(sprintId: string) {
  try {
    const result = await sql`
      UPDATE sprints
      SET status = 'completed',
          completed_at = CURRENT_TIMESTAMP
      WHERE id = ${sprintId}
      RETURNING *
    `;
    revalidatePath('/dashboard/projects/[id]', 'page');
    return result.rows[0];
  } catch (error) {
    console.error('Error completing sprint:', error);
    throw error;
  }
}
