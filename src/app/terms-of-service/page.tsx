
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground prose prose-invert max-w-none dark:prose-invert prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80">
          <p className="text-lg">
            Welcome to the Larsen & Toubro Helpdesk (the "Service"). These Terms of Service ("Terms")
            govern your access to and use of the Service. By accessing or using the Service,
            you agree to be bound by these Terms.
          </p>

          <h2 className="text-2xl font-semibold text-foreground pt-4">1. Use of the Service</h2>
          <p>
            The Service is provided exclusively for Larsen & Toubro employees and authorized personnel
            for the purpose of raising, managing, and resolving work-related queries and issues.
            You agree to use the Service only for its intended purposes and in compliance with all
            applicable L&T policies and local laws.
          </p>

          <h2 className="text-2xl font-semibold text-foreground pt-4">2. Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials
            (PSN and password) and for all activities that occur under your account. You must
            notify HR or IT support immediately of any unauthorized use of your account or any
            other breach of security. Larsen & Toubro is not liable for any loss or damage
            arising from your failure to comply with this section.
          </p>

          <h2 className="text-2xl font-semibold text-foreground pt-4">3. Prohibited Conduct</h2>
          <p>
            In connection with your use of the Service, you agree not to:
          </p>
          <ul>
            <li>Submit any information that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable.</li>
            <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
            <li>Upload, post, email, transmit, or otherwise make available any material that contains software viruses or any other computer code, files, or programs designed to interrupt, destroy, or limit the functionality of any computer software or hardware or telecommunications equipment.</li>
            <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
            <li>Submit confidential L&T information that is not directly relevant to your support query or that you are not authorized to share.</li>
            <li>Attempt to gain unauthorized access to any portion of the Service or any other accounts, computer systems, or networks connected to the Service.</li>
            <li>Use the Service for any personal, non-work-related purposes.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground pt-4">4. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain
            the exclusive property of Larsen & Toubro. The Service is protected by copyright,
            trademark, and other laws.
          </p>

          <h2 className="text-2xl font-semibold text-foreground pt-4">5. Disclaimers and Limitation of Liability</h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Larsen & Toubro makes
            no warranties, expressed or implied, and hereby disclaims and negates all other
            warranties including, without limitation, implied warranties or conditions of
            merchantability, fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>
          <p>
            In no event shall Larsen & Toubro or its suppliers be liable for any damages
            (including, without limitation, damages for loss of data or profit, or due to
            business interruption) arising out of the use or inability to use the Service,
            even if Larsen & Toubro or an authorized representative has been notified orally
            or in writing of the possibility of such damage.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground pt-4">6. Service Availability and Modifications</h2>
          <p>
             Larsen & Toubro reserves the right to modify, suspend, or discontinue the Service (or any part or content thereof) at any time with or without notice. We will not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.
          </p>

          <h2 className="text-2xl font-semibold text-foreground pt-4">7. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India,
            without regard to its conflict of law provisions and L&T internal policies.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground pt-4">8. Changes to Terms</h2>
          <p>
            Larsen & Toubro reserves the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material, we will make reasonable efforts
            to provide notice prior to any new terms taking effect. What constitutes a material
            change will be determined at our sole discretion. By continuing to access or use our
            Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>

          <h2 className="text-2xl font-semibold text-foreground pt-4">9. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact the L&T HR department or your designated IT support contact.
          </p>
          <p className="mt-6 text-sm">
            <em>Last Updated: June 19, 2025 (Placeholder Date)</em>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
