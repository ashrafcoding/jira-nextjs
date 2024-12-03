import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// Sample project names and descriptions
const projectTemplates = [
  // Original 10 projects
  { name: "E-commerce Platform", description: "Building a modern e-commerce solution with Next.js" },
  { name: "Task Management App", description: "Developing a comprehensive task tracking system" },
  { name: "Social Media Dashboard", description: "Creating an analytics dashboard for social media metrics" },
  { name: "Mobile Banking App", description: "Implementing secure mobile banking features" },
  { name: "Learning Management System", description: "Building an educational platform for online courses" },
  { name: "Healthcare Portal", description: "Developing a patient management system" },
  { name: "Real Estate Platform", description: "Creating a property listing and management solution" },
  { name: "Inventory System", description: "Building a warehouse management system" },
  { name: "Content Management", description: "Implementing a modern CMS platform" },
  { name: "HR Management", description: "Developing an employee management system" },
  // 20 Additional projects
  { name: "Customer Support Portal", description: "Building a ticketing system for customer support" },
  { name: "Analytics Dashboard", description: "Creating data visualization tools for business metrics" },
  { name: "Video Streaming Platform", description: "Developing a video content delivery system" },
  { name: "Project Portfolio", description: "Showcasing company projects and achievements" },
  { name: "Document Management", description: "Building a secure document storage and sharing system" },
  { name: "Event Management System", description: "Creating an event planning and tracking platform" },
  { name: "Bug Tracking System", description: "Developing a comprehensive issue tracking solution" },
  { name: "Resource Scheduler", description: "Building a resource allocation and scheduling system" },
  { name: "Knowledge Base", description: "Creating a centralized information repository" },
  { name: "API Gateway", description: "Implementing a unified API management system" },
  { name: "Data Pipeline", description: "Building ETL processes for data warehousing" },
  { name: "Monitoring Dashboard", description: "Creating system health monitoring tools" },
  { name: "Authentication Service", description: "Implementing SSO and user authentication" },
  { name: "Payment Gateway", description: "Developing secure payment processing system" },
  { name: "Notification Service", description: "Building real-time notification system" },
  { name: "Chat Application", description: "Creating real-time messaging platform" },
  { name: "Reporting Engine", description: "Developing automated report generation system" },
  { name: "Asset Management", description: "Building digital asset management platform" },
  { name: "Workflow Automation", description: "Creating business process automation tools" },
  { name: "Mobile App Backend", description: "Developing API services for mobile applications" }
];

// Issue templates with varying priorities and types
const issueTemplates = [
  // Original 10 issues
  { title: "Implement user authentication", description: "Set up OAuth and email authentication", priority: "high" },
  { title: "Fix responsive layout", description: "Address mobile view issues", priority: "medium" },
  { title: "Optimize database queries", description: "Improve performance of main dashboard", priority: "high" },
  { title: "Update dependencies", description: "Upgrade to latest package versions", priority: "low" },
  { title: "Add error logging", description: "Implement comprehensive error tracking", priority: "medium" },
  { title: "Implement dark mode", description: "Add theme switching functionality", priority: "low" },
  { title: "Security audit", description: "Review and fix security vulnerabilities", priority: "critical" },
  { title: "Add unit tests", description: "Increase test coverage", priority: "medium" },
  { title: "Improve accessibility", description: "Implement ARIA labels and keyboard navigation", priority: "high" },
  { title: "Setup CI/CD", description: "Configure automated deployment pipeline", priority: "medium" },
  // 50 Additional issues
  { title: "Implement caching layer", description: "Add Redis caching for improved performance", priority: "high" },
  { title: "Add data validation", description: "Implement input validation across forms", priority: "medium" },
  { title: "Create API documentation", description: "Document all API endpoints using Swagger", priority: "high" },
  { title: "Implement rate limiting", description: "Add API rate limiting for security", priority: "medium" },
  { title: "Setup monitoring", description: "Implement application monitoring", priority: "high" },
  { title: "Add search functionality", description: "Implement full-text search capability", priority: "medium" },
  { title: "Optimize images", description: "Implement image optimization pipeline", priority: "low" },
  { title: "Add export feature", description: "Allow data export to CSV/Excel", priority: "medium" },
  { title: "Implement filters", description: "Add advanced filtering options", priority: "medium" },
  { title: "Setup backup system", description: "Implement automated backups", priority: "critical" },
  { title: "Add batch processing", description: "Implement batch operations", priority: "high" },
  { title: "Improve error messages", description: "Enhance user-facing error messages", priority: "low" },
  { title: "Add data encryption", description: "Implement end-to-end encryption", priority: "critical" },
  { title: "Optimize frontend bundle", description: "Reduce bundle size", priority: "medium" },
  { title: "Add audit logs", description: "Implement system audit logging", priority: "high" },
  { title: "Setup SSL", description: "Configure SSL certificates", priority: "critical" },
  { title: "Add pagination", description: "Implement data pagination", priority: "medium" },
  { title: "Implement webhooks", description: "Add webhook support", priority: "high" },
  { title: "Add data import", description: "Create data import functionality", priority: "medium" },
  { title: "Setup email service", description: "Implement email notifications", priority: "high" },
  { title: "Add file upload", description: "Implement file upload capability", priority: "medium" },
  { title: "Create user roles", description: "Implement role-based access", priority: "high" },
  { title: "Add analytics", description: "Implement usage analytics", priority: "medium" },
  { title: "Optimize queries", description: "Improve database performance", priority: "high" },
  { title: "Add search filters", description: "Implement advanced search", priority: "medium" },
  { title: "Setup logging", description: "Add application logging", priority: "high" },
  { title: "Implement SSO", description: "Add single sign-on support", priority: "critical" },
  { title: "Add data validation", description: "Implement input validation", priority: "medium" },
  { title: "Create API docs", description: "Document API endpoints", priority: "high" },
  { title: "Add rate limits", description: "Implement rate limiting", priority: "medium" },
  { title: "Setup monitoring", description: "Add system monitoring", priority: "high" },
  { title: "Optimize images", description: "Implement image processing", priority: "low" },
  { title: "Add export", description: "Create export functionality", priority: "medium" },
  { title: "Implement filters", description: "Add data filtering", priority: "medium" },
  { title: "Setup backups", description: "Create backup system", priority: "critical" },
  { title: "Add batch jobs", description: "Implement batch processing", priority: "high" },
  { title: "Improve errors", description: "Enhance error handling", priority: "low" },
  { title: "Add encryption", description: "Implement data encryption", priority: "critical" },
  { title: "Optimize assets", description: "Reduce asset sizes", priority: "medium" },
  { title: "Add logging", description: "Implement audit logging", priority: "high" },
  { title: "Setup security", description: "Configure security measures", priority: "critical" },
  { title: "Add pagination", description: "Implement data paging", priority: "medium" },
  { title: "Create webhooks", description: "Add webhook functionality", priority: "high" },
  { title: "Setup imports", description: "Create import system", priority: "medium" },
  { title: "Add notifications", description: "Implement notifications", priority: "high" },
  { title: "Implement uploads", description: "Add file uploading", priority: "medium" },
  { title: "Setup roles", description: "Create role system", priority: "high" },
  { title: "Add metrics", description: "Implement metrics tracking", priority: "medium" },
  { title: "Optimize performance", description: "Improve system performance", priority: "high" },
  { title: "Add search", description: "Implement search functionality", priority: "medium" },
  { title: "Setup logs", description: "Create logging system", priority: "high" }
];

const statuses = ['open', 'in_progress', 'resolved', 'closed'];

export async function GET() {
  try {
    // Fetch existing users
    const existingUsers = await sql`
      SELECT id, email FROM bug_users
    `;

    if (existingUsers.rows.length === 0) {
      return NextResponse.json(
        { error: "No users found in database. Please create users first." },
        { status: 400 }
      );
    }

    // Clear existing project data but keep users
    await sql`TRUNCATE projects, project_members, issues CASCADE`;

    // Create projects
    const projects = await Promise.all(
      projectTemplates.map(async (project, index) => {
        const ownerIndex = index % existingUsers.rows.length;
        const owner = existingUsers.rows[ownerIndex];
        
        return sql`
          INSERT INTO projects (name, description, owner_id)
          VALUES (${project.name}, ${project.description}, ${owner.id})
          RETURNING id, owner_id
        `;
      })
    );

    // Add project members
    for (const project of projects) {
      const projectData = project.rows[0];
      // Add 2-3 random members to each project
      const memberCount = 2 + Math.floor(Math.random() * 2);
      const availableUsers = existingUsers.rows.filter(u => u.id !== projectData.owner_id);
      
      for (let i = 0; i < memberCount && i < availableUsers.length; i++) {
        const randomIndex = Math.floor(Math.random() * availableUsers.length);
        const randomUser = availableUsers[randomIndex];
        // Remove selected user to avoid duplicates
        availableUsers.splice(randomIndex, 1);
        
        await sql`
          INSERT INTO project_members (project_id, user_id, role)
          VALUES (${projectData.id}, ${randomUser.id}, 'member')
        `;
      }
    }

    // Create issues
    for (const project of projects) {
      const projectData = project.rows[0];
      // Create 3-4 issues per project
      const issueCount = 3 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < issueCount; i++) {
        const template = issueTemplates[Math.floor(Math.random() * issueTemplates.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const reporter = existingUsers.rows[Math.floor(Math.random() * existingUsers.rows.length)];
        const assignee = existingUsers.rows[Math.floor(Math.random() * existingUsers.rows.length)];

        await sql`
          INSERT INTO issues (
            title, description, status, priority,
            project_id, reporter_id, assignee_id
          ) VALUES (
            ${template.title}, ${template.description}, ${status}, ${template.priority},
            ${projectData.id}, ${reporter.id}, ${assignee.id}
          )
        `;
      }
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      stats: {
        users: existingUsers.rows.length,
        projects: projects.length,
        issueTemplates: issueTemplates.length
      }
    });

  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: "Failed to seed database", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}