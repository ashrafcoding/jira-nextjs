"use server";
import { sql } from "@vercel/postgres";
import { User } from "../../lib/definitions";
import bcrypt from "bcryptjs";
import { revalidatePath, revalidateTag } from "next/cache";



export async function getAllUsers() {
  try {
    const users = await sql`SELECT * FROM bug_users`;
    return users?.rows;
  } catch {
    console.error({ message: "Failed to fetch users." });
  }
}
export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM bug_users WHERE email=${email}`;
    return user.rows[0];
  } catch  {
    console.error({ message: "Failed to fetch user."});
  }
}

// sign up function
export async function signUp(data: User) {
  try {
    const { name, email, password } = data;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user =
      await sql`INSER INTO bug_users (name, email, password) values (${name}, ${email}, ${hashed}) RETURNING *`;
    return user.rows[0];
  } catch {
    console.error({ message: "failed to sign up" });
  }
}

// create team
export async function createTeam(data: {name: string}, email: string) {
  try {
    const user = await getUser(email);
    if (!user) {
      console.error({ message: "failed to create team: user not found" });
      return;
    }
    const {id} = user;
    const {name} = data;
    const team = await sql`INSERT INTO teams (name, owner_id) VALUES (${name}, ${id}) RETURNING *`;
    revalidatePath("/team");
    revalidateTag("teams");
    return team.rows[0];
  } catch {
    console.error({ message: "failed to create team" });
  }
}

export async function getTeams(email: string) {
  // get all the teams that the user is a member or owner of

  try {
    const user = await getUser(email);
    if (!user) {
      console.error({ message: "failed to get teams: user not found" });
      return;
    }
    const {id} = user;    
    const teams = await sql`SELECT * FROM teams WHERE id IN (SELECT team_id FROM team_members WHERE user_id=${id})`;
    return teams.rows;
    
  } catch {
    console.error({ message: "failed to get teams" });
  }
}

export async function getTeam(id: string) {
  try {
    const team = await sql`SELECT * FROM teams WHERE id=${id}`;
    return team.rows[0];
  } catch {
    console.error({ message: "failed to get team" });
  }
}
  

export async function deleteTeam(id: string) {
  try {
    const team = await sql`DELETE FROM teams WHERE id=${id} RETURNING *`;
    revalidatePath("/team");
    revalidateTag("teams");
    return team.rows[0];
  } catch {
    console.error({ message: "failed to delete team" });
  }
}

export async function updateTeam(id: string, name: string) {
  try {
    const team = await sql`UPDATE teams SET name=${name} WHERE id=${id} RETURNING *`;
    revalidatePath("/team");
    revalidateTag("teams");
    return team.rows[0];
  } catch {
    console.error({ message: "failed to update team" });
  }
}

export async function addTeamMember(teamId: string, email: string) {

  try {
    const user = await getUser(email);
    if (!user) {
      console.error({ message: "failed to add team member: user not found" });
      return { message: "failed to add team member: an email sent to the user to join the team" };
    }
    const {id: userId} = user;
    const member = await sql`SELECT * FROM team_members WHERE team_id=${teamId} AND user_id=${userId}`;
    if (member.rows.length > 0) {
      console.error({ message: "failed to add team member: user already in team" });
      return { message: "failed to add team member: user already in team" };
    }
    const team = await sql`INSERT INTO team_members (team_id, user_id) VALUES (${teamId}, ${userId}) RETURNING *`;
    revalidatePath("/team/${teamId}");
    revalidateTag("teams");   
    return team.rows[0];
  } catch(error) {
    return {message: 'failed to add team member', error};
  }
}

export async function getTeamMembers(teamId: string) {
  try {
    const team = await sql`SELECT * FROM team_members WHERE team_id=${teamId}`;
    return team.rows;
  } catch {
    console.error({ message: "failed to get team members" });
  }
}

export async function removeTeamMember(teamId: string, userId: string) {
  try {
    const team = await sql`DELETE FROM team_members WHERE team_id=${teamId} AND user_id=${userId} RETURNING *`;
    return team.rows[0];
  } catch {
    console.error({ message: "failed to remove team member" });
  }
}
