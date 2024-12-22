'use client';

import { motion } from "framer-motion";
import {
  KanbanSquare,
  Sparkles,
  Users,
  Clock,
  BarChart2,
  Shield,
} from "lucide-react";

const features = [
  {
    name: 'Intuitive Kanban Boards',
    description: 'Visualize your workflow with customizable boards that adapt to your team\'s needs.',
    icon: KanbanSquare,
  },
  {
    name: 'Smart Automation',
    description: 'Automate repetitive tasks and workflows to focus on what matters most.',
    icon: Sparkles,
  },
  {
    name: 'Team Collaboration',
    description: 'Real-time collaboration tools to keep your team aligned and productive.',
    icon: Users,
  },
  {
    name: 'Time Tracking',
    description: 'Built-in time tracking to monitor progress and improve estimation accuracy.',
    icon: Clock,
  },
  {
    name: 'Advanced Analytics',
    description: 'Gain insights into your team\'s performance with detailed reports and metrics.',
    icon: BarChart2,
  },
  {
    name: 'Enterprise Security',
    description: 'Bank-grade security to keep your project data safe and compliant.',
    icon: Shield,
  },
];

export default function FeaturesSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-base font-semibold leading-7 text-primary">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Powerful features for modern teams
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Built for today&apos;s fast-paced development teams, our platform provides all the tools you need to succeed.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col"
              >
                <dt className="text-base font-semibold leading-7">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
