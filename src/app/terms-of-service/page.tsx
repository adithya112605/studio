
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
          <CardTitle className="font-headline text-3xl">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Welcome to the L&T Helpdesk. By accessing or using this service,
            you agree to be bound by these Terms of Service.
          </p>
          <h2 className="text-xl font-semibold text-foreground pt-4">Use of Service</h2>
          <p>
            This helpdesk is provided for L&T employees to raise and manage
            work-related queries and issues. Misuse of the system is strictly
            prohibited.
          </p>
          <h2 className="text-xl font-semibold text-foreground pt-4">Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials (PSN and password).
          </p>
          <h2 className="text-xl font-semibold text-foreground pt-4">Prohibited Conduct</h2>
          <p>
            Users must not submit offensive, inappropriate, or confidential
            information unrelated to their support queries.
          </p>
          <h2 className="text-xl font-semibold text-foreground pt-4">Modifications to Terms</h2>
          <p>
            L&T reserves the right to modify these terms at any time. Continued
            use of the service after changes constitutes acceptance of the new
            terms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
