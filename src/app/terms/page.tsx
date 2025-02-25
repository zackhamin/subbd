import { JSX } from "react";

// app/terms/page.tsx
export default function TermsPage(): JSX.Element {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              By using RecruiterConnect, you agree to these Terms and Conditions. Please read them carefully.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing or using RecruiterConnect, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4">2. User Accounts</h2>
            <p className="mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
            <p className="mb-6">
              You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4">3. User Content</h2>
            <p className="mb-4">
              Our service allows recruiters to post content including job listings and company information, and allows applicants to post personal and professional information for employment purposes.
            </p>
            <p className="mb-6">
              You are solely responsible for the content that you post, including its legality, reliability, and appropriateness. By posting content, you represent and warrant that the content is accurate and does not violate any law or infringe any rights of any third party.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4">4. Subscription Services</h2>
            <p className="mb-4">
              Certain features of RecruiterConnect may be offered on a subscription basis. You will be billed in advance on a recurring and periodic basis, depending on the type of subscription plan you select.
            </p>
            <p className="mb-6">
              At the end of each period, your subscription will automatically renew under the same conditions unless you cancel it or RecruiterConnect cancels it.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4">5. Privacy Policy</h2>
            <p className="mb-6">
              Please refer to our Privacy Policy for information on how we collect, use, and disclose information from our users. By using RecruiterConnect, you agree to our collection and use of information in accordance with our Privacy Policy.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4">6. Limitation of Liability</h2>
            <p className="mb-6">
              In no event shall RecruiterConnect, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4">7. Changes to Terms</h2>
            <p className="mb-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4">8. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about these Terms, please contact us at legal@recruiterconnect.com.
            </p>
          </div>
        </div>
      </div>
    );
  }