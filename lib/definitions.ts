// export interface User {
//   id?: string;
//   name: string;
//   email: string;
//   image?: string;
//   password: string;
// }

export interface Project {
  avatar_url: string | null;
  id: string;
  name: string;
  description?: string;
  created_at: string;
  owner_id: string;
}

export interface Issue {
  id: string;
  title: string;
  description?: string | null;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  project_id: string;
  reporter_id: string;
  assignee_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  issue_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_name?: string;
  author_email?: string;
}

export interface IssueWithUsers extends Issue {
  reporter_name?: string;
  reporter_email?: string;
  reporter?: {
    id?: string;
    name: string;
    email: string;
  } | null;
  assignee_name?: string;
  assignee_email?: string;
  assignee?: {
    id?: string;
    name: string;
    email: string;
  } | null;
  project_name?: string;
}

export interface IssueCardProps {
  issue: IssueWithUsers;
}

export interface ProjectWithMembers extends Project {
  members?: User[];
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
  email?: string;
  password: string;
  confirmPassword: string;
};

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

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

  export type Stats = {
    total: number;
    open ?: number;
    in_progress?: number;
    resolved?: number;
    closed?: number;
    low?: number;
    medium?: number;
    high?: number;
    critical?: number;
  };