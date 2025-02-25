// app/recruiters/page.tsx
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
import { Search, Filter, Building, MapPin, UserPlus } from "lucide-react";
import Image from "next/image";
import { JSX } from "react";

interface Recruiter {
  id: number;
  name: string;
  company: string;
  location: string;
  hiringAreas: string[];
  jobsPosted: number;
  bio: string;
  imageUrl: string;
}

export default function RecruitersPage(): JSX.Element {
  // Mock recruiters data - in a real app this would come from an API
  const recruiters: Recruiter[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "TechTalent Recruiters",
      location: "San Francisco, CA",
      hiringAreas: ["Frontend", "React", "UI/UX"],
      jobsPosted: 12,
      bio: "Specialized in connecting top frontend talent with innovative tech companies across the Bay Area.",
      imageUrl: "/api/placeholder/80/80",
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "DevHire Solutions",
      location: "Remote",
      hiringAreas: ["Backend", "Cloud", "DevOps"],
      jobsPosted: 8,
      bio: "Focused on backend and infrastructure roles for remote-first companies. 10+ years in technical recruiting.",
      imageUrl: "/api/placeholder/80/80",
    },
    {
      id: 3,
      name: "Emily Zhang",
      company: "CreativeHub",
      location: "New York, NY",
      hiringAreas: ["UI/UX", "Product Design", "Graphic Design"],
      jobsPosted: 15,
      bio: "Helping design talent find their perfect match in creative agencies and tech companies in NYC and beyond.",
      imageUrl: "/api/placeholder/80/80",
    },
    {
      id: 4,
      name: "David Wilson",
      company: "InfraTech Recruiting",
      location: "Austin, TX",
      hiringAreas: ["DevOps", "SRE", "Cloud Architecture"],
      jobsPosted: 10,
      bio: "Connecting top infrastructure and DevOps talent with fast-growing tech companies.",
      imageUrl: "/api/placeholder/80/80",
    },
    {
      id: 5,
      name: "Jessica Martinez",
      company: "Mobile Talent Group",
      location: "Chicago, IL",
      hiringAreas: ["iOS", "Android", "React Native"],
      jobsPosted: 7,
      bio: "Specialized in mobile development roles across various industries, with a focus on the Midwest.",
      imageUrl: "/api/placeholder/80/80",
    },
    {
      id: 6,
      name: "Robert Kim",
      company: "Data Recruiting Partners",
      location: "Seattle, WA",
      hiringAreas: ["Data Science", "Machine Learning", "AI"],
      jobsPosted: 14,
      bio: "Connecting data professionals with cutting-edge companies in the Pacific Northwest and beyond.",
      imageUrl: "/api/placeholder/80/80",
    },
    {
      id: 7,
      name: "Amanda Johnson",
      company: "FinTech Talent Advisors",
      location: "Boston, MA",
      hiringAreas: ["Blockchain", "Fintech", "Security"],
      jobsPosted: 6,
      bio: "Specialized in recruiting for financial technology companies and blockchain startups.",
      imageUrl: "/api/placeholder/80/80",
    },
    {
      id: 8,
      name: "Chris Thompson",
      company: "Engineering Talent Partners",
      location: "Denver, CO",
      hiringAreas: ["Full Stack", "JavaScript", "Python"],
      jobsPosted: 11,
      bio: "Helping growing companies find full stack developers and engineers in the Mountain West region.",
      imageUrl: "/api/placeholder/80/80",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Recruiters in Your Field</h1>

      {/* Search and filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search recruiters by name, company, or specialty"
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="md:w-auto flex items-center">
              <Filter size={16} className="mr-2" />
              Filter
            </Button>
            <Button className="w-full md:w-auto">Search</Button>
          </div>
        </div>
      </div>

      {/* Recruiters grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recruiters.map((recruiter) => (
          <Card key={recruiter.id} className="flex flex-col overflow-hidden h-full">
            <CardHeader className="flex flex-row items-start space-y-0 gap-3 pb-3">
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border bg-gray-100">
                <Image
                  src={recruiter.imageUrl}
                  alt={recruiter.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">{recruiter.name}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Building size={14} className="mr-1" />
                  {recruiter.company}
                </CardDescription>
                <CardDescription className="flex items-center mt-1">
                  <MapPin size={14} className="mr-1" />
                  {recruiter.location}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="flex-grow">
              <p className="text-sm text-gray-600 mb-3">{recruiter.bio}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {recruiter.hiringAreas.map((area) => (
                  <Badge key={area} variant="secondary" className="font-normal">
                    {area}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-medium">{recruiter.jobsPosted}</span> active job postings
              </p>
            </CardContent>

            <CardFooter className="border-t pt-4">
              <Button className="w-full flex items-center" variant="outline" disabled>
                <UserPlus size={16} className="mr-2" />
                Follow Recruiter
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}