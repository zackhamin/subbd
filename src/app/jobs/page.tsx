// app/jobs/page.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, Clock } from "lucide-react";
import { JSX } from "react";

interface Recruiter {
  name: string;
  id: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  posted: string;
  description: string;
  recruiter: Recruiter;
  tags: string[];
}

export default function JobsPage(): JSX.Element {
  // Mock jobs data - in a real app this would come from an API
  const jobs: Job[] = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      posted: "2 days ago",
      description: "We're looking for an experienced frontend developer with React expertise to join our growing team.",
      recruiter: {
        name: "Sarah Johnson",
        id: "sarah-johnson",
      },
      tags: ["React", "TypeScript", "NextJS"],
    },
    {
      id: 2,
      title: "Product Manager",
      company: "InnovateCo",
      location: "Remote",
      type: "Full-time",
      posted: "1 week ago",
      description: "Join our product team to help shape the future of our SaaS platform.",
      recruiter: {
        name: "Michael Chen",
        id: "michael-chen",
      },
      tags: ["Product", "SaaS", "B2B"],
    },
    {
      id: 3,
      title: "DevOps Engineer",
      company: "CloudScale",
      location: "Austin, TX",
      type: "Contract",
      posted: "3 days ago",
      description: "Help us build and maintain our cloud infrastructure and CI/CD pipelines.",
      recruiter: {
        name: "David Wilson",
        id: "david-wilson",
      },
      tags: ["AWS", "Kubernetes", "Docker"],
    },
    {
      id: 4,
      title: "UX/UI Designer",
      company: "DesignWorks",
      location: "New York, NY",
      type: "Full-time",
      posted: "1 day ago",
      description: "Create beautiful, intuitive interfaces for our client projects.",
      recruiter: {
        name: "Emily Zhang",
        id: "emily-zhang",
      },
      tags: ["Figma", "UI Design", "User Research"],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Next Job</h1>

      {/* Search and filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Job title, keyword, or company"
              className="pl-10"
            />
          </div>
          <div className="relative md:w-64">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Location"
              className="pl-10"
            />
          </div>
          <Button className="w-full md:w-auto">Search Jobs</Button>
        </div>
      </div>

      {/* Job listings */}
      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold hover:text-blue-600 transition-colors">
                    {job.title}
                  </CardTitle>
                  <CardDescription className="text-base">{job.company}</CardDescription>
                </div>
                <Button variant="outline" size="sm">Apply</Button>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-y-2 mb-3">
                <div className="flex items-center text-gray-500 mr-6">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex items-center text-gray-500 mr-6">
                  <Briefcase size={16} className="mr-1" />
                  <span className="text-sm">{job.type}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock size={16} className="mr-1" />
                  <span className="text-sm">Posted {job.posted}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-3">{job.description}</p>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 border-t pt-3 bg-gray-50">
              Posted by{" "}
              <span className="font-medium text-blue-600 hover:underline ml-1">
                {job.recruiter.name}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}