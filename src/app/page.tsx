
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquare, ShieldCheck, HardHat, Sparkles, ArrowRight, Zap, TrendingUp, Clock, Users, CheckCircle, Handshake } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import ScrollReveal from '@/components/common/ScrollReveal';
import { motion, useScroll, useTransform } from 'framer-motion';

const features = [
  {
    id: 1,
    icon: <MessageSquare className="w-10 h-10 text-sky-700 dark:text-sky-300 mb-4" />,
    title: "Effortless Ticket Submission",
    description: "Employees can quickly raise support tickets for any issue, ensuring swift attention and resolution.",
    bgColor: "bg-sky-100 dark:bg-sky-900/40",
  },
  {
    id: 2,
    icon: <ShieldCheck className="w-10 h-10 text-teal-700 dark:text-teal-300 mb-4" />,
    title: "Secure & Role-Based Access",
    description: "Robust PSN-based authentication ensures secure access, tailored to employee and supervisor roles.",
    bgColor: "bg-teal-100 dark:bg-teal-900/40",
  },
  {
    id: 3,
    icon: <HardHat className="w-10 h-10 text-rose-700 dark:text-rose-300 mb-4" />,
    title: "Hierarchical Support System",
    description: "Dedicated interfaces for Employees and Supervisors (IS, NS, DH, IC Head) with clear escalation paths.",
    bgColor: "bg-rose-100 dark:bg-rose-900/40",
  },
  {
    id: 4,
    icon: <Sparkles className="w-10 h-10 text-amber-700 dark:text-amber-300 mb-4" />,
    title: "AI-Powered Insights",
    description: "Supervisors receive AI-driven resolution suggestions to expedite ticket handling and improve efficiency.",
    bgColor: "bg-amber-100 dark:bg-amber-900/40",
  },
];

const stats = [
  {
    id: 1,
    value: "24/7",
    label: "Support Available",
    icon: <Clock className="w-10 h-10 mb-3" />,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/40",
    color: "text-indigo-500 dark:text-indigo-300",
  },
  {
    id: 2,
    value: "98%",
    label: "Resolution Rate",
    icon: <TrendingUp className="w-10 h-10 mb-3" />,
    bgColor: "bg-emerald-100 dark:bg-emerald-900/40",
    color: "text-emerald-500 dark:text-emerald-300",
  },
  {
    id: 3,
    value: "<2Hrs",
    label: "Avg. Response",
    icon: <Zap className="w-10 h-10 mb-3" />,
    bgColor: "bg-orange-100 dark:bg-orange-900/40",
    color: "text-orange-500 dark:text-orange-300",
  },
  {
    id: 4,
    value: "150K+",
    label: "Employees Served",
    icon: <Users className="w-10 h-10 mb-3" />,
    bgColor: "bg-pink-100 dark:bg-pink-900/40",
    color: "text-pink-500 dark:text-pink-300",
  }
];

const DesktopFeaturesLayout = () => (
  <section id="features" className="py-16 lg:py-24 w-full bg-card">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
          Key Features of L&T Helpdesk
        </h2>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <ScrollReveal key={index} animationInClass="animate-fadeInUp" once={false} delayIn={100 * index}>
            <div className={cn("text-center p-8 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:-translate-y-1 flex flex-col items-center h-full", feature.bgColor)}>
              <div className="mb-6">{feature.icon}</div>
              <h3 className="font-headline text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

const DesktopStatsLayout = () => (
  <section className="py-16 lg:py-24 w-full">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
          System Performance at a Glance
        </h2>
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <ScrollReveal key={index} animationInClass="animate-fadeInUp" once={false} delayIn={100 * index}>
            <div className={cn("flex flex-col items-center p-8 rounded-xl shadow-md hover:shadow-xl transform transition-all duration-300 ease-in-out hover:-translate-y-1 h-full", stat.bgColor)}>
              <div className={`${stat.color} mb-4`}>{stat.icon}</div>
              <p className={`font-headline text-4xl md:text-5xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

const CardStack = ({ items, renderCard, offset = 15 }: { items: any[], renderCard: (item: any) => React.ReactNode, offset?: number }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={targetRef} className="relative" style={{ height: `${items.length * 100}vh` }}>
      <div className="sticky top-1/4 left-0 flex h-[50vh] items-center justify-center">
        {items.map((item, i) => {
          const start = i / items.length;
          const end = start + (1 / items.length);

          const scale = useTransform(scrollYProgress, [start, end], [1, 0.7]);
          const top = useTransform(scrollYProgress, [start, end], [i * offset, (i - 1) * offset]);

          return (
            <motion.div
              key={item.id}
              className="absolute flex h-full w-full items-center justify-center"
              style={{
                scale,
                top,
                zIndex: items.length - i,
              }}
            >
              {renderCard(item)}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};


const MobileStackedLayout = () => (
  <div className="md:hidden py-16 bg-background">
      <h2 className="font-headline text-3xl font-bold text-center px-4 mb-16 text-foreground">
        Key Features
      </h2>
    <CardStack
      items={features}
      renderCard={(feature) => (
        <div className={cn("flex h-full w-[90%] flex-col items-center justify-center rounded-2xl p-8 text-center shadow-lg", feature.bgColor)}>
          <div className="mb-6">{feature.icon}</div>
          <h3 className="font-headline text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
          <p className="text-muted-foreground text-sm">{feature.description}</p>
        </div>
      )}
    />
    
    <h2 className="font-headline text-3xl font-bold text-center px-4 mt-24 mb-16 text-foreground">
      System Performance
    </h2>
    <CardStack
      items={stats}
      renderCard={(stat) => (
         <div className={cn("flex h-full w-[90%] flex-col items-center justify-center rounded-2xl p-8 text-center shadow-md", stat.bgColor)}>
            <div className={`${stat.color} mb-4`}>{stat.icon}</div>
            <p className={`font-headline text-4xl md:text-5xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
          </div>
      )}
    />
  </div>
);


export default function HomePage() {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
      setIsClient(true);
  }, []);

  return (
    <div className="text-foreground overflow-x-hidden">
      {/* Hero Section - fixed to the viewport */}
      <section className="fixed top-0 left-0 h-screen w-full flex items-center justify-center">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Modern office building background"
          data-ai-hint="modern office building"
          fill
          priority
          className="object-cover -z-10"
        />
        <div className="absolute inset-0 bg-black/60 -z-10" />
        <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-white">
            {user ? (
              <>Welcome, <span className="text-highlight">{user.name}!</span></>
            ) : (
              <>Welcome to <span className="text-highlight">L&T Helpdesk</span></>
            )}
          </h1>
          {user ? (
            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto mb-10">
              Your personalized helpdesk dashboard awaits. Manage your tickets and access support efficiently.
            </p>
          ) : (
            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto mb-10">
              <span className="text-highlight">Efficient</span>. <span className="text-highlight">Reliable</span>. Internal Support, <span className="text-highlight">Reimagined</span> for Larsen & Toubro Employees.
            </p>
          )}
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
        </div>
      </section>

      {/* Spacer div to push the scrollable content down, making space for the fixed hero */}
      <div className="h-screen" />

      {/* Subsequent Content Wrapper - This will scroll over the fixed hero */}
      <div className="relative z-10 bg-background">
        
        {isClient && (
            <>
                {/* Mobile View */}
                <MobileStackedLayout />
                {/* Desktop View */}
                <div className="hidden md:block">
                    <DesktopFeaturesLayout />
                    <DesktopStatsLayout />
                </div>
            </>
        )}

        {/* Image section like Vexo */}
        <section className="py-16 lg:py-24 w-full bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
              <div className="bg-background p-8 md:p-12 rounded-xl shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-primary/30 hover:-translate-y-1 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                  <div>
                    <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-foreground">
                      Built for <span className="text-highlight">Efficiency and Scale</span>
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

    