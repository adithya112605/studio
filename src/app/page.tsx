
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, MessageSquare, ShieldCheck, Users, Briefcase, UserPlus, UserCog, UserSquare2 } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const features = [
    {
      icon: <MessageSquare className="w-10 h-10 text-primary mb-4" />,
      title: "Effortless Ticket Raising",
      description: "Employees can quickly raise support tickets for any issue, ensuring swift attention.",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-primary mb-4" />,
      title: "Secure Authentication",
      description: "Robust PSN-based authentication with password management for secure access.",
    },
    {
      icon: <Users className="w-10 h-10 text-primary mb-4" />,
      title: "Hierarchical Support",
      description: "Dedicated interfaces for Employees and Supervisors (IS, NS, DH, IC Head) with tailored functionalities.",
    },
    {
      icon: <Briefcase className="w-10 h-10 text-primary mb-4" />,
      title: "AI-Powered Suggestions",
      description: "Supervisors receive AI-driven resolution suggestions to expedite ticket handling.",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 lg:py-32 bg-gradient-to-br from-background to-primary/10 dark:from-background dark:to-primary/5">
        <div className="container mx-auto text-center px-4">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Welcome to <span className="text-primary">L&T Helpdesk</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Streamlining internal support for L&T employees. Get quick resolutions and manage your queries efficiently with hierarchical supervisor support.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg shadow-lg transition-transform hover:scale-105">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-3 rounded-lg shadow-lg transition-transform hover:scale-105">
              <Link href="/auth/signup">First Time User?</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 w-full">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose L&T Helpdesk?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                <CardHeader>
                  <div className="flex justify-center">{feature.icon}</div>
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About L&T Section */}
      <section className="py-16 lg:py-24 bg-secondary/30 w-full">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">
              About <span className="text-primary">Larsen & Toubro</span>
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Larsen & Toubro is a major Indian multinational conglomerate, with business interests in engineering, construction, manufacturing, technology, and financial services. Headquartered in Mumbai, the company is counted among the world's largest construction companies.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This Helpdesk system is designed to enhance internal support processes, ensuring that every L&T employee receives timely assistance for their work-related queries and issues.
            </p>
             <Button asChild variant="link" className="text-primary p-0 mt-4 hover:underline">
              <a href="https://www.larsentoubro.com/" target="_blank" rel="noopener noreferrer">
                Learn more about L&T &rarr;
              </a>
            </Button>
          </div>
          <div className="rounded-lg overflow-hidden shadow-2xl">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="L&T Corporate Image" 
              width={600} 
              height={400} 
              className="object-cover w-full h-full"
              data-ai-hint="corporate building" 
            />
          </div>
        </div>
      </section>
      
      {/* Admin/Supervisor Actions Section */}
      <section className="py-16 lg:py-24 w-full">
        <div className="container mx-auto text-center px-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">
                Administrative & Supervisor Actions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                Supervisors and Administrative staff can manage employee records and helpdesk operations. Access requires authentication.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                 <Button asChild size="lg" variant="outline" className="w-full sm:w-auto px-8 py-3 rounded-lg shadow-lg">
                    <Link href="/auth/signin?role=supervisor"><UserCog className="mr-2"/> Supervisor Portal Login</Link>
                </Button>
                 <Button asChild size="lg" variant="outline" className="w-full sm:w-auto px-8 py-3 rounded-lg shadow-lg">
                    <Link href="/admin/add-employee"><UserPlus className="mr-2"/> Add New Employee</Link>
                </Button>
                 <Button asChild size="lg" variant="outline" className="w-full sm:w-auto px-8 py-3 rounded-lg shadow-lg">
                    <Link href="/admin/add-supervisor"><UserSquare2 className="mr-2"/> Add New Supervisor</Link>
                </Button>
            </div>
        </div>
      </section>

    </div>
  );
}
