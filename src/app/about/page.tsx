import { Button } from "@/components/ui/button";
import Link from "next/link";
import { JSX } from "react";

export default function AboutPage(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About RecruiterConnect</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            RecruiterConnect is a platform that combines the professional networking aspects of LinkedIn with the subscription model of Substack, creating a unique space where job seekers can directly connect with recruiters in their field.
          </p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Our Mission</h2>
          <p className="mb-6">
            We believe that the job search process should be more transparent and personalized. Our mission is to transform how professionals find their next career opportunity by facilitating direct connections between job seekers and the recruiters who understand their industry.
          </p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">How We're Different</h2>
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">Recruiter-Driven Approach</h3>
            <p>
              Unlike traditional job boards where listings get lost in the noise, RecruiterConnect puts recruiters at the center of the experience. By subscribing to specific recruiters, job seekers receive targeted opportunities that match their skills and career goals.
            </p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">Direct Communication</h3>
            <p>
              Our platform encourages direct communication between recruiters and candidates, eliminating the black hole that applications often disappear into on traditional job sites.
            </p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">Personalized Job Feeds</h3>
            <p>
              By following recruiters who specialize in your field, you create a personalized feed of relevant opportunities, delivered directly to you via the platform or email digests.
            </p>
          </div>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Our Team</h2>
          <p className="mb-6">
            RecruiterConnect was founded by a team of professionals who experienced firsthand the frustrations of traditional job searching. With backgrounds spanning recruitment, technology, and human resources, our team is passionate about creating a better way for talented professionals to connect with opportunities.
          </p>
          
          <div className="border-t border-b py-8 my-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Ready to transform your job search?</h2>
            <div className="flex justify-center">
              <Button size="lg" asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}