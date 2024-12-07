"use server";

import { sql } from "@vercel/postgres";

export async function seedSprintsForProject(projectId: string) {
  try {
    // Insert completed sprint
    await sql`
      INSERT INTO sprints (project_id, name, start_date, end_date, goal, status, started_at, completed_at)
      VALUES (
        ${projectId},
        'Sprint 1: Initial Setup',
        CURRENT_TIMESTAMP - INTERVAL '4 weeks',
        CURRENT_TIMESTAMP - INTERVAL '2 weeks',
        'Set up basic project infrastructure and core features',
        'completed',
        CURRENT_TIMESTAMP - INTERVAL '4 weeks',
        CURRENT_TIMESTAMP - INTERVAL '2 weeks'
      )
    `;

    // Insert active sprint
    await sql`
      INSERT INTO sprints (project_id, name, start_date, end_date, goal, status, started_at)
      VALUES (
        ${projectId},
        'Sprint 2: Feature Development',
        CURRENT_TIMESTAMP - INTERVAL '2 weeks',
        CURRENT_TIMESTAMP + INTERVAL '2 weeks',
        'Implement key user-requested features and improvements',
        'active',
        CURRENT_TIMESTAMP - INTERVAL '2 weeks'
      )
    `;

    // Insert planned sprint
    await sql`
      INSERT INTO sprints (project_id, name, start_date, end_date, goal, status)
      VALUES (
        ${projectId},
        'Sprint 3: Testing & Polish',
        CURRENT_TIMESTAMP + INTERVAL '2 weeks',
        CURRENT_TIMESTAMP + INTERVAL '4 weeks',
        'Focus on testing, bug fixes, and UI polish',
        'planned'
      )
    `;

    return { success: true };
  } catch (error) {
    console.error('Error seeding sprints:', error);
    throw error;
  }
}
