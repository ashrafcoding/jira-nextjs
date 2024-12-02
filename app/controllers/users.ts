"use server";
import { sql } from "@vercel/postgres";
import { User } from "../../lib/definitions";
import bcrypt from "bcryptjs";

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
  } catch {
    console.error({ message: "Failed to fetch user." });
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
