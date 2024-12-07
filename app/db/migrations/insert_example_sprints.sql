-- Insert example sprints for each project
INSERT INTO sprints (project_id, name, start_date, end_date, goal, status, started_at, completed_at)
SELECT 
    p.id as project_id,
    'Sprint 1: Initial Setup' as name,
    CURRENT_TIMESTAMP as start_date,
    CURRENT_TIMESTAMP + INTERVAL '2 weeks' as end_date,
    'Set up basic project infrastructure and core features' as goal,
    'completed' as status,
    CURRENT_TIMESTAMP - INTERVAL '2 weeks' as started_at,
    CURRENT_TIMESTAMP - INTERVAL '1 day' as completed_at
FROM projects p;

INSERT INTO sprints (project_id, name, start_date, end_date, goal, status, started_at)
SELECT 
    p.id as project_id,
    'Sprint 2: Feature Development' as name,
    CURRENT_TIMESTAMP as start_date,
    CURRENT_TIMESTAMP + INTERVAL '2 weeks' as end_date,
    'Implement key user-requested features and improvements' as goal,
    'active' as status,
    CURRENT_TIMESTAMP as started_at
FROM projects p;

INSERT INTO sprints (project_id, name, start_date, end_date, goal, status)
SELECT 
    p.id as project_id,
    'Sprint 3: Testing & Polish' as name,
    CURRENT_TIMESTAMP + INTERVAL '2 weeks' as start_date,
    CURRENT_TIMESTAMP + INTERVAL '4 weeks' as end_date,
    'Focus on testing, bug fixes, and UI polish' as goal,
    'planned' as status
FROM projects p;
