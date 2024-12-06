"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";

export async function getProject(id: string) {
  try {
    const project = await sql`SELECT * FROM projects WHERE id=${id}`;
    if(!project.rows[0]) throw new Error("Project not found")
    return project.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getProjects() {
  try {
    const projects = await sql`SELECT * FROM projects`;
    return projects.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserProjects(email: string) {
  try {
    // Get both owned projects and projects where user is a member
    const projects = await sql`
      SELECT DISTINCT p.*, 
        CASE 
          WHEN p.owner_id = (SELECT id FROM bug_users WHERE email = ${email}) THEN true 
          ELSE false 
        END as is_owner,
        COALESCE(pm.role, 'none') as member_role
      FROM projects p
      LEFT JOIN project_members pm ON p.id = pm.project_id
      LEFT JOIN bug_users bu ON pm.user_id = bu.id
      WHERE p.owner_id = (SELECT id FROM bug_users WHERE email = ${email})
      OR bu.email = ${email}
      ORDER BY p.created_at DESC
    `;
    return projects.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function checkProjectOwnership(projectId: string, userEmail: string) {
  const result = await sql`
    SELECT EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = ${projectId}
      AND p.owner_id = (SELECT id FROM bug_users WHERE email = ${userEmail})
    ) as is_owner
  `;
  return result.rows[0].is_owner;
}

export async function deleteProject(id: string, userEmail: string) {
  try {
    const isOwner = await checkProjectOwnership(id, userEmail);
    if (!isOwner) {
      throw new Error("Unauthorized: Only project owners can delete projects");
    }

    await sql`DELETE FROM projects WHERE id=${id}`;
    revalidatePath("/dashboard");
    revalidateTag("projects");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createProject(name: string, description: string, email: string) {
  try {
    const project = await sql`
      INSERT INTO projects (name, description, owner_id) 
      VALUES (
        ${name}, 
        ${description}, 
        (SELECT id FROM bug_users WHERE email = ${email})
      ) 
      RETURNING *
    `;
    revalidatePath("/dashboard");
    revalidateTag("projects");
    return project.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateProject(id: string, name: string, description: string, userEmail: string) {
  try {
    const isOwner = await checkProjectOwnership(id, userEmail);
    if (!isOwner) {
      throw new Error("Unauthorized: Only project owners can update projects");
    }

    const project = await sql`
      UPDATE projects 
      SET name=${name}, description=${description} 
      WHERE id=${id} 
      RETURNING *
    `;
    revalidatePath("/dashboard");
    revalidateTag("projects");
    return project.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// In project-controllers.ts
export async function getProjectMembers(projectId: string) {
  'use server';
  
  try {
    const members = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        CASE 
          WHEN p.owner_id = u.id THEN 'owner'
          ELSE COALESCE(pm.role, 'member')
        END as role
      FROM bug_users u
      LEFT JOIN project_members pm ON u.id = pm.user_id
      LEFT JOIN projects p ON pm.project_id = p.id
      WHERE p.id = ${projectId}
      ORDER BY 
        CASE 
          WHEN p.owner_id = u.id THEN 1
          ELSE 2
        END,
        u.name
    `;
    return members.rows;
  } catch (error) {
    console.error('Error fetching project members:', error);
    throw error;
  }
}

export async function updateProjectAvatar(projectId: string, avatarUrl: string) {
  try {
    await sql`
      UPDATE projects
      SET avatar_url = ${avatarUrl}
      WHERE id = ${projectId}
    `;
    return true;
  } catch (error) {
    console.error('Error updating project avatar:', error);
    throw error;
  }
}