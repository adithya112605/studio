
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FilePlus2, ShieldCheck, Network, BrainCircuit, ArrowRight, Gauge, CheckCircle2, Rocket, Building2, CheckCircle, Handshake } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import ScrollReveal from '@/components/common/ScrollReveal';

const features = [
  {
    id: 1,
    icon: <FilePlus2 />,
    title: "Streamlined Ticket Submission",
    description: "Raise support tickets in seconds through our intuitive, guided form. Captures all necessary details, ensuring your issue is routed to the right expert instantly. No more guesswork, just swift action and resolution.",
  },
  {
    id: 2,
    icon: <ShieldCheck />,
    title: "Role-Based Secure Access",
    description: "Security is paramount. With PSN-based authentication, the system provides tailored access levels, ensuring employees, supervisors, and department heads only see information and actions relevant to their roles.",
  },
  {
    id: 3,
    icon: <Network />,
    title: "Intelligent Support Hierarchy",
    description: "Tickets are automatically escalated through the proper L&T channels—from Immediate Supervisor (IS) to Department Head (DH)—ensuring accountability, oversight, and timely resolutions at every level.",
  },
  {
    id: 4,
    icon: <BrainCircuit />,
    title: "AI-Powered Resolution",
    description: "Empower supervisors with AI-driven suggestions and insights. Our system analyzes ticket content to identify the fastest path to resolution, suggest common solutions, and improve efficiency across the board.",
  },
];

const stats = [
  {
    id: 1,
    value: "99.8%",
    label: "System Uptime",
    icon: <Gauge />,
  },
  {
    id: 2,
    value: "98%",
    label: "First-Contact Resolution",
    icon: <CheckCircle2 />,
  },
  {
    id: 3,
    value: "<2Hrs",
    label: "Avg. Initial Response",
    icon: <Rocket />,
  },
  {
    id: 4,
    value: "150K+",
    label: "Employees Supported",
    icon: <Building2 />,
  }
];

const DesktopFeaturesLayout = () => {
  const featureColors = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4"];
  return (
    <section id="features" className="py-16 lg:py-24 w-full bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
            Key Features of L&amp;T Helpdesk
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={index} animationInClass="animate-fadeInUp" once={false} delayIn={100 * index}>
              <div className={cn("text-center p-8 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:-translate-y-1 flex flex-col items-center h-full text-primary-foreground", featureColors[index % featureColors.length])}>
                <div className="text-primary-foreground mb-6">{React.cloneElement(feature.icon, { className: 'w-16 h-16' })}</div>
                <h3 className="font-headline text-xl font-semibold mb-3 text-primary-foreground">{feature.title}</h3>
                <p className="text-primary-foreground/80 text-sm">{feature.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const DesktopStatsLayout = () => {
  const statColors = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4"];
  return (
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
              <div className={cn("flex flex-col items-center p-8 rounded-xl shadow-md hover:shadow-xl transform transition-all duration-300 ease-in-out hover:-translate-y-1 h-full text-primary-foreground", statColors[index % statColors.length])}>
                <div className="text-primary-foreground mb-4">{React.cloneElement(stat.icon, { className: 'w-16 h-16' })}</div>
                <p className="font-headline text-4xl md:text-5xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-sm text-primary-foreground/80 mt-2">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const CardScroller = ({ items, title }: { items: any[], title: string }) => {
  const [currentCard, setCurrentCard] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressDotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const totalCards = items.length;

  useEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, totalCards);
    progressDotsRef.current = progressDotsRef.current.slice(0, totalCards);
  }, [items, totalCards]);

  const updateCardClasses = (cardIndex: number) => {
    if (cardIndex === currentCard) return;

    setCurrentCard(cardIndex);

    cardsRef.current.forEach((card, index) => {
      card?.classList.remove('active', 'prev', 'next', 'hidden');
      if (index === cardIndex) {
        card?.classList.add('active');
      } else if (index === cardIndex - 1) {
        card?.classList.add('prev');
      } else if (index === cardIndex + 1) {
        card?.classList.add('next');
      } else {
        card?.classList.add('hidden');
      }
    });

    progressDotsRef.current.forEach((dot, index) => {
      dot?.classList.toggle('active', index === cardIndex);
    });
  };

  useEffect(() => {
    const cardsContainerNode = containerRef.current;
    if (!cardsContainerNode) return;

    const handleScroll = () => {
      const containerRect = cardsContainerNode.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      const viewportHeight = window.innerHeight;

      if (containerTop <= 0 && containerTop >= -containerHeight + viewportHeight) {
        const scrolled = Math.abs(containerTop);
        const scrollableHeight = containerHeight - viewportHeight;
        const scrollProgress = scrollableHeight > 0 ? Math.min(scrolled / scrollableHeight, 1) : 0;
        const cardIndex = Math.floor(scrollProgress * totalCards);
        const clampedIndex = Math.max(0, Math.min(cardIndex, totalCards - 1));
        updateCardClasses(clampedIndex);
      }
    };
    
    // Initial setup
    updateCardClasses(0);

    let ticking = false;
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);
    return () => window.removeEventListener('scroll', requestTick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCards]);

  return (
    <div className="relative">
      <div className="py-12">
        <h2 className="font-headline text-3xl font-bold text-center px-4 text-foreground">
          {title}
        </h2>
      </div>
      <div className="cards-container" ref={containerRef} style={{ height: `${totalCards * 100}vh` }}>
        <div className="sticky-wrapper">
          <div className="stacked-cards">
            {items.map((item, index) => {
              const isStatCard = !!item.value;
              return (
                <div key={item.id} className="card mobile-stack-card" ref={el => cardsRef.current[index] = el}>
                  {isStatCard ? (
                    <div className="card-content-stat">
                        <div className="card-floating-icon is-stat">
                          {React.cloneElement(item.icon, { className: 'w-32 h-32' })}
                        </div>
                        <p className="card-stat-value">{item.value}</p>
                        <p className="card-stat-label">{item.label}</p>
                    </div>
                  ) : (
                    <div className="card-content">
                      <div className="card-floating-icon">
                        {React.cloneElement(item.icon, { className: 'w-40 h-40' })}
                      </div>
                      <div className="relative z-10">
                        <h2 className="card-title">{item.title}</h2>
                        <p className="card-description">{item.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="progress-indicator">
        {items.map((_, index) => (
          <div key={`${title}-dot-${index}`} className="progress-dot" ref={el => progressDotsRef.current[index] = el}></div>
        ))}
      </div>
    </div>
  );
};


const MobileHomePage = () => {
  return (
    <div className="md:hidden bg-background">
        <CardScroller items={features} title="Key Features of L&T Helpdesk" />
        <CardScroller items={stats} title="System Performance at a Glance" />
    </div>
  );
};


export default function HomePage() {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
      setIsClient(true);
  }, []);

  return (
    <div className="text-foreground">
      <section className="h-screen w-full flex items-center justify-center sticky top-0">
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
              <>Welcome to <span className="text-highlight">L&amp;T Helpdesk</span></>
            )}
          </h1>
          {user ? (
            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto mb-10">
              Your personalized helpdesk dashboard awaits. Manage your tickets and access support efficiently.
            </p>
          ) : (
            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto mb-10">
              <span className="text-highlight">Efficient</span>. <span className="text-highlight">Reliable</span>. Internal Support, <span className="text-highlight">Reimagined</span> for Larsen &amp; Toubro Employees.
            </p>
          )}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4">
            {user ? (
              <Button asChild size="lg" variant="shiny" className="px-10 py-6 rounded-full text-lg font-semibold shadow-lg transition-transform hover:scale-105 w-full sm:w-auto">
                <Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-2 h-5 w-5"/></Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" variant="shiny" className="px-10 py-6 rounded-full text-lg font-semibold shadow-lg transition-transform hover:scale-105 w-full sm:w-auto">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild variant="shiny" size="lg" className="px-10 py-6 rounded-full text-lg font-semibold shadow-lg transition-transform hover:scale-105 w-full sm:w-auto">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-background">
        
        {isClient && (
            <>
                {/* Mobile View */}
                <MobileHomePage />
                {/* Desktop View */}
                <div className="hidden md:block">
                    <DesktopFeaturesLayout />
                    <DesktopStatsLayout />
                </div>
            </>
        )}

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
                    <Button asChild size="lg" variant="shiny" className="mt-8 px-8 py-4 rounded-full text-md font-semibold shadow-lg transition-transform hover:scale-105">
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
              <Button asChild size="lg" variant="shiny" className="px-12 py-6 rounded-full text-xl font-semibold shadow-xl transition-transform hover:scale-105">
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
