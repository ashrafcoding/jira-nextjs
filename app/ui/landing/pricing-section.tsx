"use client";
import { motion } from "framer-motion"; // Importing motion for animations
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react'; // Importing Lucide icons

export default function PricingSection(){
  return (
    <section className="py-16" id="pricing">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <motion.div
            className="border rounded-lg p-6 shadow-md"
            initial={{ opacity: 0, y: 20 }} // Initial state
            whileInView={{ opacity: 1, y: 0 }} // State when in view
            transition={{ duration: 0.5 }} // Animation duration
          >
            <h3 className="text-xl font-bold mb-2">Basic</h3>
            <p className="text-gray-600 mb-4">For individuals and small teams</p>
            <p className="text-3xl font-bold mb-4">$9<span className="text-base font-normal">/month</span></p>
            <ul className="text-left mb-6">
              <li className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Up to 5 projects
              </li>
              <li className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Up to 10 team members
              </li>
              <li className="flex items-center mb-2">
                <XCircle className="w-5 h-5 text-red-500 mr-2" /> Advanced reporting (not included)
              </li>
              <li className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Email support
              </li>
            </ul>
            <Button className="font-bold py-2 px-4 rounded">
              Get Started
            </Button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            className="border rounded-lg p-6 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-gray-600 mb-4">For growing teams and businesses</p>
            <p className="text-3xl font-bold mb-4">$29<span className="text-base font-normal">/month</span></p>
            <ul className="text-left mb-6">
              <li className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Up to 20 projects
              </li>
              <li className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Up to 50 team members
              </li>
              <li className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Advanced reporting
              </li>
              <li className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Priority email support
              </li>
            </ul>
            <Button className="font-bold py-2 px-4 rounded">
              Get Started
            </Button>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div
            className="border rounded-lg p-6 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
            <p className="text-gray-600 mb-4">For large organizations</p>
            <p className="text-3xl font-bold mb-4">Contact Us<span className="text-base font-normal"> for pricing</span></p>
            <ul className="text-left mb-6">
              <li className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Unlimited projects
              </li>
              <li className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Unlimited team members
              </li>
              <li className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Custom reporting
              </li>
              <li className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> 24/7 support
              </li>
            </ul>
            <Button className="font-bold py-2 px-4 rounded">
              Contact Us
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

