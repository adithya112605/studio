
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 md:py-16 text-foreground bg-background min-h-screen">
      <div className="mb-8">
        <Button variant="outline" asChild className="hover:bg-accent hover:text-accent-foreground">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <Card className="shadow-xl bg-card text-card-foreground border-border">
        <CardHeader>
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground prose prose-invert max-w-none dark:prose-invert prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80">
          <p className="text-lg">
            This Privacy Policy describes how Larsen & Toubro Helpdesk ("we", "us", or "our")
            collects, uses, and discloses your information in connection with your use of our
            internal helpdesk services (the "Service").
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground pt-4">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you use the Service. This may include:
          </p>
          <ul>
            <li><strong>Account Information:</strong> Your PSN, name, business email, project details, job code, grade, and supervisor information when your account is created or updated.</li>
            <li><strong>Ticket Information:</strong> Details you provide when submitting a support ticket, including the query itself, priority level, follow-up information, and any attachments.</li>
            <li><strong>Communication Information:</strong> Records of communications with support staff and system notifications.</li>
            <li><strong>Usage Information:</strong> We may log information about your access and use of the Service, such as IP address, browser type, and pages visited (for system improvement and security).</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground pt-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, operate, and maintain the Service.</li>
            <li>Process and manage your support tickets, including assignment and escalation.</li>
            <li>Communicate with you about your tickets, account, and Service updates.</li>
            <li>Improve the Service, including analyzing usage trends and gathering feedback.</li>
            <li>Ensure the security and integrity of our systems.</li>
            <li>Comply with internal policies and legal obligations.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground pt-4">3. How We Share Your Information</h2>
          <p>
            Your information is primarily used internally within Larsen & Toubro for the purposes of providing the Helpdesk Service. We may share information:
          </p>
          <ul>
            <li>With relevant L&T personnel (e.g., your supervisors, IT support) as necessary to resolve your tickets.</li>
            <li>If required by law or in response to valid legal processes.</li>
            <li>To protect the rights, property, or safety of Larsen & Toubro, our employees, or others.</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>

          <h2 className="text-2xl font-semibold text-foreground pt-4">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures designed to protect
            your personal information from unauthorized access, use, alteration, or disclosure.
            However, no internet-based site can be 100% secure, so we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-semibold text-foreground pt-4">5. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes
            outlined in this Privacy Policy, unless a longer retention period is required or permitted by law
            or L&T internal policies.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground pt-4">6. Your Rights and Choices</h2>
          <p>
            You may have certain rights regarding your personal information, subject to L&T's internal policies and applicable laws. You can typically:
          </p>
          <ul>
              <li>Access and review your profile information.</li>
              <li>Update certain profile information through the Service or by contacting HR/Admin.</li>
              <li>Manage your notification preferences within the Service settings.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground pt-4">7. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any
            material changes by posting the new Privacy Policy on this page and/or through other
            communication channels within the Service.
          </p>

          <h2 className="text-2xl font-semibold text-foreground pt-4">8. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our data practices,
            please contact the L&T HR department or your designated IT support contact.
          </p>
          <p className="mt-6 text-sm">
            <em>Last Updated: June 19, 2025 (Placeholder Date)</em>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
