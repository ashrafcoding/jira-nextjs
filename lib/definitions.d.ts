import { z, object, string } from "zod";

export type Product = {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  img: string;
};

export type User = {
  id?: string;
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const FormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(2, { message: 'Password must be at least 6 characters long' })
      .regex(/[a-zA-Z0-9]/, { message: 'Password must be alphanumeric' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type Project = {
  id: string;
  name: string;
  description: string;
  status: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
};

export type Issue = {
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
  reporter_email?: string;
  assignee_name?: string;
  assignee_email?: string;
};

export type IssueWithUsers = Issue & {
  assignee: {
    name: string;
    email: string;
  } | null;
  reporter: {
    name: string;
    email: string;
  };
};

export interface IssueCardProps {
  issue: IssueWithUsers;
}

export interface Sprint {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  goal: string | null;
  status: 'planned' | 'active' | 'completed';
  started_at: string | null;
  completed_at: string | null;
}
