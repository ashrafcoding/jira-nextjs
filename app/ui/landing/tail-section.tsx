import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const TailSection = () => {
  return (
    <section className="py-16" id="contact" >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg  mb-8">
          Join thousands of teams already using our platform to streamline their
          workflow.
        </p>
        <Link href="/register" className="text-lg font-bold mb-8">
          <Button className=" font-bold py-2 px-4 rounded mb-8">
            Sign Up Now
          </Button>
        </Link>

        {/* Contact Us Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
          <p className="text-lg  mb-4">
            Have questions or need assistance? Reach out to our team.
          </p>
          <Link
            href="mailto:support@example.com"
            className="text-blue-500 hover:underline"
          >
            support@example.com
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TailSection;
