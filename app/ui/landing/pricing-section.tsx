import { Button } from '@/components/ui/button';
import React from 'react';

const PricingSection = () => {
  return (
    <section className="py-16" id="pricing">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="border rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold mb-2">Basic</h3>
            <p className="text-gray-600 mb-4">For individuals and small teams</p>
            <p className="text-3xl font-bold mb-4">$9<span className="text-base font-normal">/month</span></p>
            <ul className="text-left mb-6">
              <li>Up to 5 projects</li>
              <li>Up to 10 team members</li>
              <li>Basic reporting</li>
              <li>Email support</li>
            </ul>
            <Button className="font-bold py-2 px-4 rounded">
              Get Started
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="border rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-gray-600 mb-4">For growing teams and businesses</p>
            <p className="text-3xl font-bold mb-4">$29<span className="text-base font-normal">/month</span></p>
            <ul className="text-left mb-6">
              <li>Up to 20 projects</li>
              <li>Up to 50 team members</li>
              <li>Advanced reporting</li>
              <li>Priority email support</li>
            </ul>
            <Button className=" font-bold py-2 px-4 rounded">
              Get Started
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="border rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
            <p className="text-gray-600 mb-4">For large organizations</p>
            <p className="text-3xl font-bold mb-4">Custom</p>
            <ul className="text-left mb-6">
              <li>Unlimited projects</li>
              <li>Unlimited team members</li>
              <li>Custom reporting</li>
              <li>Dedicated account manager</li>
            </ul>
            <Button className="font-bold py-2 px-4 rounded">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
