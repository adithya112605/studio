
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, ShieldCheck, HardHat, Sparkles, ArrowRight, Zap, TrendingUp, Clock, Users, CheckCircle, Handshake } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import ScrollReveal from '@/components/common/ScrollReveal';
import ScrollTypewriter from '@/components/common/ScrollTypewriter';

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
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="h-screen w-full sticky top-0 flex items-center justify-center">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Modern office building background"
          data-ai-hint="modern office building"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="min-h-[8rem] md:min-h-[10rem]">
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-white">
              {user ? (
                <>
                  <ScrollTypewriter text="Welcome, " tag="span" speed={50} className="inline-block" once={true} delay={200}/>
                  <span className="text-highlight">
                    <ScrollTypewriter text={`${user.name}!`} tag="span" speed={50} delay={200 + (9 * 50)} className="inline-block" once={true}/>
                  </span>
                </>
              ) : (
                <>
                  <ScrollTypewriter text="Welcome to" tag="span" speed={50} className="inline-block" once={true} delay={200}/>
                  {' '}
                  <span className="text-highlight">
                    <ScrollTypewriter text="L&T Helpdesk" tag="span" speed={50} delay={200 + (10 * 50)} className="inline-block" once={true}/>
                  </span>
                </>
              )}
            </h1>
          </div>
          <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={300}>
            {user ? (
              <p className="text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto mb-10">
                Your personalized helpdesk dashboard awaits. Manage your tickets and access support efficiently.
              </p>
            ) : (
              <p className="text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto mb-10">
                <span className="text-highlight">Efficient</span>. <span className="text-highlight">Reliable</span>. Internal Support, <span className="text-highlight">Reimagined</span> for Larsen & Toubro Employees.
              </p>
            )}
          </ScrollReveal>
          <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={500}>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4">
              {user ? (
                   <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 rounded-full text-lg font-semibold shadow-lg transition-transform hover:scale-105 w-full sm:w-auto">
                      <Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-2 h-5 w-5"/></Link>
                  </Button>
              ) : (
                  <>
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 rounded-full text-lg font-semibold shadow-lg transition-transform hover:scale-105 w-full sm:w-auto">
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-10 py-6 rounded-full text-lg font-semibold shadow-lg transition-transform hover:scale-105 w-full sm:w-auto">
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                  </>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Subsequent Content Wrapper */}
      <div className="relative z-10 bg-background">
        {/* Features Section */}
        <section id="features" className="py-16 lg:py-24 w-full bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={200}>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
                Key Features of L&T Helpdesk
              </h2>
            </ScrollReveal>
            <div className="flex gap-8 overflow-x-auto pb-6 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <ScrollReveal key={index} className="w-4/5 flex-shrink-0 snap-center md:w-auto" animationInClass="animate-fadeInUp" once={false} delayIn={200 + index * 100}>
                  <div className="text-center p-8 bg-background rounded-xl shadow-lg hover:shadow-2xl hover:shadow-primary/30 dark:hover:shadow-primary/40 transform transition-all duration-300 ease-in-out hover:-translate-y-1 flex flex-col items-center h-full">
                    <div className="mb-6">{feature.icon}</div>
                    <h3 className="font-headline text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 lg:py-24 w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={200}>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
                System Performance at a Glance
              </h2>
            </ScrollReveal>
            <div className="flex gap-8 overflow-x-auto pb-6 snap-x snap-mandatory md:grid sm:grid-cols-2 lg:grid-cols-4 text-center">
              {stats.map((stat, index) => (
                <ScrollReveal key={index} className="w-4/5 flex-shrink-0 snap-center md:w-auto" animationInClass="animate-fadeInUp" once={false} delayIn={200 + index * 100}>
                  <div className="flex flex-col items-center p-8 bg-card rounded-xl shadow-md hover:shadow-xl hover:shadow-accent/30 dark:hover:shadow-accent/40 transform transition-all duration-300 ease-in-out hover:-translate-y-1 h-full">
                    <div className={`${stat.color} mb-4`}>{stat.icon}</div>
                    <p className={`font-headline text-4xl md:text-5xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
        
        {/* Image section like Vexo */}
        <section className="py-16 lg:py-24 w-full bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
              <div className="bg-background p-8 md:p-12 rounded-xl shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-primary/30 hover:-translate-y-1 overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                      <div>
                          <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={100}>
                            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-foreground">
                                Built for <span className="text-highlight">Efficiency and Scale</span>
                            </h2>
                          </ScrollReveal>
                          <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={200}>
                            <p className="text-muted-foreground mb-4 leading-relaxed text-lg">
                                Our helpdesk platform is engineered to handle the diverse needs of a large organization like Larsen & Toubro, ensuring smooth operations and quick resolutions.
                            </p>
                          </ScrollReveal>
                          <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={300}>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0"/> Intuitive user interface for all employees.</li>
                                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0"/> Scalable infrastructure to support thousands of users.</li>
                                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0"/> Robust security and data privacy measures.</li>
                            </ul>
                          </ScrollReveal>
                          <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={400}>
                            <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-md font-semibold shadow-lg transition-transform hover:scale-105">
                                <Link href={user ? "/dashboard" : "/auth/signup"}>
                                    {user ? "Explore Dashboard" : "Get Started Now"} <ArrowRight className="ml-2 h-5 w-5"/>
                                </Link>
                            </Button>
                          </ScrollReveal>
                      </div>
                      <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={200}>
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
                      </ScrollReveal>
                  </div>
              </div>
            </ScrollReveal>
          </div>
        </section>


        {/* Contact/CTA Section */}
        <section id="contact" className="py-20 lg:py-32 w-full">
          <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8">
            <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={100}>
              <Handshake className="w-16 h-16 text-primary mx-auto mb-6"/>
            </ScrollReveal>
            <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={200}>
              <h2 className="font-headline text-3xl md:text-5xl font-bold mb-6 text-foreground">
                Ready to Experience <span className="text-highlight">Streamlined Support</span>?
              </h2>
            </ScrollReveal>
            <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={300}>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Join thousands of L&T employees already benefiting from our efficient internal helpdesk system.
              </p>
            </ScrollReveal>
            <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={400}>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 rounded-full text-xl font-semibold shadow-xl transition-transform hover:scale-105">
                <Link href={user ? "/dashboard" : "/auth/signup"}>
                    {user ? "Go to Dashboard" : "Create Your Account"}
                </Link>
              </Button>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </div>
  );
}
