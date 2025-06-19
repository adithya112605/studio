
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, ShieldCheck, Users, Briefcase, UserPlus, UserCog, ArrowRight, Sparkles, Zap, TrendingUp, Clock, Smile, CheckCircle, HardHat, Handshake } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext'; 
import React from 'react';

export default function HomePage() {
  const { user } = useAuth(); 

  const features = [
    {
      icon: <MessageSquare className="w-10 h-10 text-primary mb-4" />,
      title: "Effortless Ticket Submission",
      description: "Employees can quickly raise support tickets for any issue, ensuring swift attention and resolution.",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-primary mb-4" />,
      title: "Secure & Role-Based Access",
      description: "Robust PSN-based authentication ensures secure access, tailored to employee and supervisor roles.",
    },
    {
      icon: <HardHat className="w-10 h-10 text-primary mb-4" />,
      title: "Hierarchical Support System",
      description: "Dedicated interfaces for Employees and Supervisors (IS, NS, DH, IC Head) with clear escalation paths.",
    },
    {
      icon: <Sparkles className="w-10 h-10 text-primary mb-4" />,
      title: "AI-Powered Insights",
      description: "Supervisors receive AI-driven resolution suggestions to expedite ticket handling and improve efficiency.",
    },
  ];

  const stats = [
    {
      value: "24/7",
      label: "Support Available",
      color: "text-primary",
      icon: <Clock className="w-10 h-10 mb-3" />
    },
    {
      value: "98%",
      label: "Resolution Rate",
      color: "text-accent",
      icon: <TrendingUp className="w-10 h-10 mb-3" />
    },
    {
      value: "<2Hrs",
      label: "Avg. Response",
      color: "text-primary",
      icon: <Zap className="w-10 h-10 mb-3" />
    },
    {
      value: "150K+",
      label: "Employees Served",
      color: "text-accent",
      icon: <Users className="w-10 h-10 mb-3" />
    }
  ];

  return (
    <div className="flex flex-col items-center bg-background text-foreground min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full py-24 lg:py-40 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
            <Image
                src="https://placehold.co/1920x1080.png" // Placeholder for abstract background
                alt="Abstract Background"
                layout="fill"
                objectFit="cover"
                className="animate-pulse"
                data-ai-hint="abstract tech background"
            />
        </div>
        <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight">
            L&amp;T Helpdesk
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Efficient. Reliable. Internal Support, Reimagined for Larsen & Toubro Employees.
          </p>
          <div className="space-x-0 space-y-4 sm:space-x-4 sm:space-y-0">
            {user ? (
                 <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 rounded-full text-lg font-semibold shadow-lg transition-transform hover:scale-105">
                    <Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-2 h-5 w-5"/></Link>
                </Button>
            ) : (
                <>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 rounded-full text-lg font-semibold shadow-lg transition-transform hover:scale-105 w-full sm:w-auto">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 px-10 py-6 rounded-full text-lg font-semibold shadow-lg transition-transform hover:scale-105 w-full sm:w-auto">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
                </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 w-full bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
            Key Features of L&T Helpdesk
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8 bg-background rounded-xl shadow-2xl hover:shadow-primary/20 transition-shadow duration-300 flex flex-col items-center">
                <div className="mb-6">{feature.icon}</div>
                <h3 className="font-headline text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
            System Performance at a Glance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center p-8 bg-card rounded-xl shadow-xl hover:shadow-accent/20 transition-shadow">
                <div className={`${stat.color} mb-4`}>{stat.icon}</div>
                <p className={`font-headline text-4xl md:text-5xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Image section like Vexo */}
      <section className="py-16 lg:py-24 w-full bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-background p-8 md:p-12 rounded-xl shadow-2xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div>
                        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-foreground">
                            Built for <span className="text-primary">Efficiency and Scale</span>
                        </h2>
                        <p className="text-muted-foreground mb-4 leading-relaxed text-lg">
                            Our helpdesk platform is engineered to handle the diverse needs of a large organization like Larsen & Toubro, ensuring smooth operations and quick resolutions.
                        </p>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0"/> Intuitive user interface for all employees.</li>
                            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0"/> Scalable infrastructure to support thousands of users.</li>
                            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0"/> Robust security and data privacy measures.</li>
                        </ul>
                        <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-md font-semibold shadow-lg transition-transform hover:scale-105">
                            <Link href={user ? "/dashboard" : "/auth/signup"}>
                                {user ? "Explore Dashboard" : "Get Started Now"} <ArrowRight className="ml-2 h-5 w-5"/>
                            </Link>
                        </Button>
                    </div>
                    <div className="rounded-lg overflow-hidden shadow-2xl aspect-video">
                        <Image
                        src="https://placehold.co/600x400.png"
                        alt="Modern Office or Tech Interface"
                        width={600}
                        height={400}
                        className="object-cover w-full h-full"
                        data-ai-hint="modern office tech interface"
                        />
                    </div>
                </div>
            </div>
        </div>
      </section>


      {/* Contact/CTA Section */}
      <section id="contact" className="py-20 lg:py-32 w-full">
        <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Handshake className="w-16 h-16 text-primary mx-auto mb-6"/>
          <h2 className="font-headline text-3xl md:text-5xl font-bold mb-6 text-foreground">
            Ready to Experience Streamlined Support?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands of L&T employees already benefiting from our efficient internal helpdesk system.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 rounded-full text-xl font-semibold shadow-xl transition-transform hover:scale-105">
            <Link href={user ? "/dashboard" : "/auth/signup"}>
                {user ? "Go to Dashboard" : "Create Your Account"}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
