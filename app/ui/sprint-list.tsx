'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { startSprint, completeSprint } from '../controllers/sprint-controllers';
import { PlayCircle, CheckCircle2 } from 'lucide-react';
import { Sprint } from '@/lib/definitions';

export function SprintList({ sprints }: { sprints: Sprint[] }) {
  const handleStartSprint = async (sprintId: string) => {
    try {
      await startSprint(sprintId);
    } catch (error) {
      console.error('Error starting sprint:', error);
    }
  };

  const handleCompleteSprint = async (sprintId: string) => {
    try {
      await completeSprint(sprintId);
    } catch (error) {
      console.error('Error completing sprint:', error);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {sprints.map((sprint) => (
        <Card key={sprint.id} className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="flex-none">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium leading-none">
                {sprint.name}
              </CardTitle>
              <div className="rounded-full px-2 py-1 text-xs font-semibold" 
                style={{
                  backgroundColor: sprint.status === 'completed' ? 'rgb(22 163 74 / 0.1)' : 
                                sprint.status === 'active' ? 'rgb(37 99 235 / 0.1)' : 
                                'rgb(234 179 8 / 0.1)',
                  color: sprint.status === 'completed' ? 'rgb(22 163 74)' : 
                        sprint.status === 'active' ? 'rgb(37 99 235)' : 
                        'rgb(234 179 8)'
                }}>
                {sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}
              </div>
            </div>
            <CardDescription className="mt-2">
              {sprint.goal || 'No goal set'}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Date:</span>
                <span>{format(new Date(sprint.start_date), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End Date:</span>
                <span>{format(new Date(sprint.end_date), 'MMM d, yyyy')}</span>
              </div>
              {sprint.started_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Started:</span>
                  <span>{format(new Date(sprint.started_at), 'MMM d, yyyy')}</span>
                </div>
              )}
              {sprint.completed_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed:</span>
                  <span>{format(new Date(sprint.completed_at), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex-none pt-1">
            {sprint.status === 'planned' && (
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleStartSprint(sprint.id)}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Start Sprint
              </Button>
            )}
            {sprint.status === 'active' && (
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleCompleteSprint(sprint.id)}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete Sprint
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
