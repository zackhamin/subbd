// app/contact/page.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { JSX } from "react";

export default function ContactPage(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-8">
          We'd love to hear from you! Get in touch with our team.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Email Card */}
          <Card>
            <CardHeader className="pb-2">
              <Mail className="h-8 w-8 mb-2 text-blue-600" />
              <CardTitle className="text-lg">Email</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-blue-600 hover:underline">
                <a href="mailto:hello@recruiterconnect.com">hello@recruiterconnect.com</a>
              </CardDescription>
            </CardContent>
          </Card>

          {/* Phone Card */}
          <Card>
            <CardHeader className="pb-2">
              <Phone className="h-8 w-8 mb-2 text-blue-600" />
              <CardTitle className="text-lg">Phone</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-blue-600 hover:underline">
                <a href="tel:+15551234567">+1 (555) 123-4567</a>
              </CardDescription>
            </CardContent>
          </Card>

          {/* Office Card */}
          <Card>
            <CardHeader className="pb-2">
              <MapPin className="h-8 w-8 mb-2 text-blue-600" />
              <CardTitle className="text-lg">Office</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                123 Recruitment Avenue<br />
                San Francisco, CA 94105
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="text-sm font-medium">
                      First name
                    </label>
                    <Input id="first-name" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="text-sm font-medium">
                      Last name
                    </label>
                    <Input id="last-name" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" placeholder="How can we help you?" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Please provide as much detail as possible..."
                    rows={5}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Send Message</Button>
            </CardFooter>
          </Card>

          {/* FAQ Section */}
          <div className="md:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-2">How do I sign up as a recruiter?</h3>
              <p className="text-gray-600">
                To sign up as a recruiter, simply create an account and select the "Recruiter" option during registration. You'll then be guided through setting up your profile.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-2">How much does it cost to use RecruiterConnect?</h3>
              <p className="text-gray-600">
                Basic job searching and recruiter following is free for job seekers. Recruiters have different subscription tiers based on posting volume and additional features.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-2">Can I control how often I receive job emails?</h3>
              <p className="text-gray-600">
                Yes, you can set your email preferences to receive daily or weekly digests, or disable email notifications completely and use only the platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">How can I delete my account?</h3>
              <p className="text-gray-600">
                You can delete your account at any time through your account settings. If you need assistance, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}