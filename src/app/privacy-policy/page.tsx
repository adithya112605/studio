
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            This is the placeholder page for the L&T Helpdesk Privacy Policy.
            Detailed information regarding how we collect, use, and protect your
            personal data will be available here soon.
          </p>
          <h2 className="text-xl font-semibold text-foreground pt-4">Information We Collect</h2>
          <p>
            We may collect information such as your PSN, name, project details,
            and the content of your support queries.
          </p>
          <h2 className="text-xl font-semibold text-foreground pt-4">How We Use Your Information</h2>
          <p>
            Your information is used to provide support services, manage tickets,
            improve our helpdesk, and for internal administrative purposes.
          </p>
          <h2 className="text-xl font-semibold text-foreground pt-4">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your data from
            unauthorized access or disclosure.
          </p>
          <h2 className="text-xl font-semibold text-foreground pt-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            the HR department.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
