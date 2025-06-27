
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cookie } from "lucide-react";

export default function CookiePolicyPage() {
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
          <div className="flex items-center space-x-3">
            <Cookie className="w-8 h-8 text-primary" />
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary">Cookie Policy</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground prose prose-invert max-w-none dark:prose-invert prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80">
          <p className="text-lg">
            This Cookie Policy explains how Larsen & Toubro Helpdesk ("we", "us", "our")
            uses cookies and similar technologies to recognize you when you visit our website.
            It explains what these technologies are and why we use them, as well as your rights
            to control our use of them.
          </p>
          
          <h2 className="font-headline text-2xl font-normal tracking-wide text-foreground pt-4">1. What are cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when
            you visit a website. Cookies are widely used by website owners in order to make
            their websites work, or to work more efficiently, as well as to provide reporting
            information.
          </p>
          <p>
            Cookies set by the website owner (in this case, Larsen & Toubro Helpdesk) are called
            "first-party cookies". Cookies set by parties other than the website owner are called
            "third-party cookies". Third-party cookies enable third-party features or
            functionality to be provided on or through the website (e.g., advertising,
            interactive content, and analytics).
          </p>

          <h2 className="font-headline text-2xl font-normal tracking-wide text-foreground pt-4">2. Why do we use cookies?</h2>
          <p>
            We use first-party cookies for several reasons. Some cookies are required for
            technical reasons in order for our Website to operate, and we refer to these as
            "essential" or "strictly necessary" cookies. For the L&T Helpdesk, these primarily include:
          </p>
          <ul>
            <li><strong>Session Cookies:</strong> To manage your login state and ensure secure access to your account.</li>
            <li><strong>Preference Cookies:</strong> To remember your preferences, such as your theme choice (light/dark mode) or cookie consent status.</li>
          </ul>
          <p>
            We do not currently use third-party cookies for advertising or extensive analytics on this internal helpdesk platform. Our focus is on operational functionality.
          </p>

          <h2 className="font-headline text-2xl font-normal tracking-wide text-foreground pt-4">3. Types of cookies we use</h2>
          <ul>
            <li>
              <strong>Strictly Necessary Cookies:</strong> These cookies are essential to provide you with services available through our Website and to enable you to use some of its features. For example, they help to authenticate users and prevent fraudulent use of user accounts. Without these cookies, the services that you have asked for cannot be provided, and we only use these cookies to provide you with those services.
            </li>
            <li>
              <strong>Functionality Cookies:</strong> These cookies allow us to remember choices you make when you use our Website, such as remembering your login details or language preference. The purpose of these cookies is to provide you with a more personal experience and to avoid you having to re-enter your preferences every time you visit our Website. For this helpdesk, this includes remembering your cookie consent.
            </li>
          </ul>

          <h2 className="font-headline text-2xl font-normal tracking-wide text-foreground pt-4">4. Your choices regarding cookies</h2>
          <p>
            You have the right to decide whether to accept or reject cookies.
          </p>
          <ul>
            <li>
              <strong>Cookie Consent Banner:</strong> We provide a consent banner that allows you to acknowledge our use of cookies. By clicking "Got it!", you consent to our use of cookies as described in this policy.
            </li>
            <li>
              <strong>Browser Controls:</strong> Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.
            </li>
          </ul>
          <p>
            Please note that if you choose to block or delete cookies, some parts of our Service may not function properly.
          </p>

          <h2 className="font-headline text-2xl font-normal tracking-wide text-foreground pt-4">5. Changes to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time in order to reflect, for example,
            changes to the cookies we use or for other operational, legal, or regulatory reasons.
            Please therefore re-visit this Cookie Policy regularly to stay informed about our use
            of cookies and related technologies.
          </p>

          <h2 className="font-headline text-2xl font-normal tracking-wide text-foreground pt-4">6. Contact Us</h2>
          <p>
            If you have any questions or concerns about our use of cookies,
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
