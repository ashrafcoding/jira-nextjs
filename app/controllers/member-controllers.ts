"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";

export async function getProjectMembers(projectId: string) {
  try {
    const members = await sql`
      SELECT pm.*, bu.name, bu.email 
      FROM project_members pm 
      JOIN bug_users bu ON pm.user_id = bu.id 
      WHERE pm.project_id = ${projectId}
    `;
    return members.rows;
  } catch (error) {
    console.error(error);
  }
}

export async function addProjectMember(projectId: string, userEmail: string, role: string = 'member') {
  try {
    await sql`
      INSERT INTO project_members (project_id, user_id, role)
      VALUES (
        ${projectId}, 
        (SELECT id FROM bug_users WHERE email = ${userEmail}),
        ${role}
      )
    `;
    revalidatePath("/dashboard");
    revalidateTag("projects");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function removeProjectMember(projectId: string, userId: string) {
  try {
    await sql`
      DELETE FROM project_members 
      WHERE project_id = ${projectId} AND user_id = ${userId}
    `;
    revalidatePath("/dashboard");
    revalidateTag("projects");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateMemberRole(projectId: string, userId: string, role: string) {
  try {
    await sql`
      UPDATE project_members 
      SET role = ${role}
      WHERE project_id = ${projectId} AND user_id = ${userId}
    `;
    revalidatePath("/dashboard");
    revalidateTag("projects");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const users = await sql`SELECT id, name, email FROM bug_users`;
    return users.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
