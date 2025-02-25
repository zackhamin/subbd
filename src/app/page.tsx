// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JSX } from "react";

export default function Home(): JSX.Element {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Connect Directly with Recruiters in Your Field
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Subscribe to recruiters who post jobs in your area of expertise and receive personalized job alerts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/jobs">Find Jobs</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white/10">
                <Link href="/recruiters">Browse Recruiters</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-3">Find Recruiters</h3>
              <p className="text-gray-600">
                Search and browse through recruiters who specialize in your industry and location.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-3">Subscribe to Updates</h3>
              <p className="text-gray-600">
                Follow recruiters you like and receive daily or weekly job alerts directly from them.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-3">Apply Directly</h3>
              <p className="text-gray-600">
                Apply to jobs with your profile and connect directly with recruiters through the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Next Opportunity?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs through our platform.
          </p>
          <Button size="lg" asChild>
            <Link href="/jobs">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}