"use client";

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function AccessDeniedNotice() {
  const [accessWarning, setAccessWarning] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const access = searchParams.get('access');

  useEffect(() => {
    if (!code && !error && access !== 'denied') {
      return;
    }

    const timeoutIds: number[] = [];

    if (error) {
      console.error('OAuth error:', error);
    }

    if (access === 'denied') {
      const showNoticeTimeoutId = window.setTimeout(() => {
        setAccessWarning('You do not have access to this page. Please sign in with an admin account to view the admin area.');
      }, 0);

      timeoutIds.push(showNoticeTimeoutId);
    }

    const cleanUrlTimeoutId = window.setTimeout(() => {
      router.replace(pathname, { scroll: false });
    }, 0);

    timeoutIds.push(cleanUrlTimeoutId);

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [access, code, error, pathname, router]);

  if (!accessWarning) {
    return null;
  }

  return (
    <section className="pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-500/10 border border-amber-400/40 rounded-2xl p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">⚠️</span>
                <div>
                  <h2 className="text-xl font-heading text-white mb-1">Access restricted</h2>
                  <p className="text-orange-100 leading-relaxed">{accessWarning}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAccessWarning(null)}
                className="self-start inline-flex items-center justify-center px-4 py-2 rounded-lg border border-orange-400/40 text-orange-100 hover:bg-orange-900/30 transition-all duration-300"
              >
                Dismiss
              </button>
            </div>
          </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };
  const features = [
    {
      title: 'Bonuses',
      description: 'Unlock exclusive partner bonuses, deposit perks, and extra value with every offer.',
      href: '/bonus',
      label: 'Rewards',
      image: '/images/backgrounds/bonus.webp',
    },
    {
      title: 'Giveaways',
      description: 'Discover community prize drops, special campaigns, and upcoming reward events.',
      href: '/giveaway',
      label: 'Community',
      image: '/images/backgrounds/giveaway.webp',
    },
    {
      title: 'Raffle',
      description: 'Follow monthly raffle entries, winner announcements, and premium community rewards.',
      href: '/raffle',
      label: 'Featured Draw',
      image: '/images/backgrounds/raffle.webp',
    },
    {
      title: 'Merch',
      description: 'Shop upcoming GoldAce merchandise and branded drops built for the community.',
      href: '/shop',
      label: 'Storefront',
      image: '/images/backgrounds/merch.webp',
    },
  ];

  const videos = [
    {
      id: 'FpPe-DJ9qb8',
      title: 'Getting Absolutely RINSED…',
    },
    {
      id: 'tciai1UMkAY',
      title: 'I Need Some Luck in This Unboxing Sessions…', 
    },
    {
      id: '9sLbB9DUvMs',
      title: 'I Risk It All AGAIN to Win an EXPENSIVE Skin…',
    },
    {
      id: 'wei1tsSb-z0',
      title: 'I Sold My iPhone 16 to Deposit 1500 Gems',
    },
    {
      id: '-TTi9XyOKA4',
      title: 'FROM FREE DAILY CASES TO 3000 GEMS 🚀 CASE BATTLE RUN UP',
    },
    {
      id: 'vfy-1bVNCZk',
      title: '1500 GEMS START + NEW GIVEAWAYS & A LEAGUE OF LEGENDS ROUND?! 🤯🔥',
    }
  ];

  const faqs = [
    {
      question: 'What is GoldAce?',
      answer: 'GoldAce is your all-in-one hub for CS:GO gambling and casino leaderboards, streams, and exclusive bonuses. We help you maximize your gambling experience with the best affiliate codes and rewards.'
    },
    {
      question: 'How do I get bonuses?',
      answer: 'Simply use our affiliate codes like "GoldAce" on partner sites to unlock exclusive deposit bonuses, free spins, and other perks not available to regular users.'
    },
    {
      question: 'Are the leaderboards real-time?',
      answer: 'Our leaderboards updates every 10 minutes (to prevent rate limit) to show current rankings across different gambling platforms. Track your progress and compete with top players.'
    },
    {
      question: 'Is GoldAce free to use?',
      answer: 'Absolutely! GoldAce is completely free. We earn commissions from our partners, allowing us to offer our services at no cost to you.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Suspense fallback={null}>
        <AccessDeniedNotice />
      </Suspense>

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-orange-900/20 backdrop-blur-md border border-orange-800/30 rounded-2xl p-8 lg:p-12 hover:bg-orange-900/30 transition-all duration-300 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Left Side - Welcome Content */}
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-heading text-white leading-tight">
                  Welcome to <span className="text-orange-400">GoldAce</span>
                </h1>
                <p className="text-lg text-orange-100 leading-relaxed">
                  Your All-in-One Hub for Leaderboards, Streams & Rewards. Use code <span className="text-orange-400">GoldAce</span> and level up your perks!
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl border border-orange-400/30 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                    href="/bonus"
                  >
                    <span className="text-lg">Visit Bonuses</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <a
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-transparent to-orange-900/50 text-orange-200 font-bold rounded-xl border-2 border-orange-400/50 backdrop-blur-sm hover:bg-gradient-to-r hover:from-orange-900/30 hover:to-orange-800/30 hover:border-orange-400/70 hover:text-white transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                    href="https://discord.gg/TNSFQXP5" target="_blank" rel="noopener noreferrer"
                  >
                    <span className="text-lg">Join Community</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3783-.4447.8728-.6083 1.2581a18.27 18.27 0 00-5.487 0 12.864 12.864 0 00-.6177-1.2581.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0413-.319 13.5802.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057 13.107 13.107 0 01-1.8728-.8918.0773.0773 0 01-.0089-.1279c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.299 12.299 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5489-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.975 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Right Side - Logo */}
              <div className="flex items-center justify-center relative">
                <div className="relative w-48 h-60 lg:w-64 lg:h-64 overflow-visible">
                  <Image
                    src="/images/hero_image.webp"
                    alt="GoldAce Hero Image"
                    fill
                    sizes="(max-width: 768px) 192px, (max-width: 1024px) 256px, 256px"
                    className="object-scale-down filter drop-shadow-2xl scale-150"
                    loading="eager"
                    style={{
                      maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                    }}
                  />
                  
                  {/* Floating Images Around Hero Image */}
                  <div className="absolute -top-12 -left-8 w-32 h-32 opacity-40 animate-bounce" style={{ animationDuration: '6s', animationDelay: '0s' }}>
                    <Image
                      src="/images/decoration/floating-1.webp"
                      alt="Floating Element 1"
                      fill
                      sizes="128px"
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute -top-8 -right-20 w-32 h-32 opacity-40 animate-bounce" style={{ animationDuration: '5s', animationDelay: '0.5s' }}>
                    <Image
                      src="/images/decoration/floating-2.webp"
                      alt="Floating Element 2"
                      fill
                      sizes="128px"
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute -bottom-12 -left-12 w-30 h-30 opacity-40 animate-bounce" style={{ animationDuration: '7s', animationDelay: '1s' }}>
                    <Image
                      src="/images/decoration/floating-3.webp"
                      alt="Floating Element 3"
                      fill
                      sizes="120px"
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 opacity-40 animate-bounce" style={{ animationDuration: '5.5s', animationDelay: '1.5s' }}>
                    <Image
                      src="/images/decoration/floating-4.webp"
                      alt="Floating Element 4"
                      fill
                      sizes="96px"
                      loading="lazy"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Title */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-3xl font-heading text-white text-center mb-8">Explore <span className="text-orange-400">Our Features</span></div>
      </div>

      {/* Feature Cards Grid */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-7">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="h-full"
              >
                <a
                  href={feature.href}
                  className="group relative flex aspect-[2/3] h-full overflow-hidden rounded-[28px] border border-orange-800/30 bg-black shadow-[0_24px_80px_-40px_rgba(249,115,22,0.45)] transition-all duration-300 hover:-translate-y-2 hover:border-orange-700/40 hover:shadow-[0_28px_90px_-38px_rgba(249,115,22,0.55)]"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{ backgroundImage: `url(${feature.image})` }}
                    aria-hidden="true"
                  />

                  <div className="relative z-10 flex flex-1 flex-col justify-end p-6">
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-[2px]">
                      <span className="inline-flex items-center rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-200/90">
                        {feature.label}
                      </span>
                      <h3 className="mt-4 text-2xl font-heading text-white drop-shadow-sm">
                        {feature.title}
                      </h3>

                      <div className="mt-5 flex items-center justify-between text-sm font-semibold text-white">
                        <span>Explore</span>
                        <span className="rounded-full border border-orange-400/25 bg-orange-500/10 px-3 py-1 text-orange-100 transition-all duration-300 group-hover:bg-orange-500/20">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* Live Stream Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading text-white mb-4">Live <span className="text-orange-400">Stream</span></h2>
            <p className="text-xl text-orange-200 max-w-3xl mx-auto">
              Watch GoldAce live and feel the excitement
            </p>
          </div>
          
          <div className="aspect-video bg-black rounded-xl overflow-hidden border border-orange-800/30">
            <iframe
              src="https://player.kick.com/goldacecs"
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen"
              title="GoldAce Live Stream"
            />
          </div>
        </div>
      </section>

      {/* Content Section - YouTube Videos */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading text-white mb-4">Latest <span className="text-orange-400">Videos</span></h2>
            <p className="text-xl text-orange-200 max-w-3xl mx-auto">
              Check out our latest content and tutorials
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className="bg-orange-900/20 backdrop-blur-sm border border-orange-800/30 rounded-xl overflow-hidden hover:bg-orange-900/30 transition-all duration-300"
              >
                <div className="aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title={video.title}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-heading text-white">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading text-white mb-4">Frequently Asked <span className="text-orange-400">Questions</span></h2>
            <p className="text-xl text-orange-200 max-w-3xl mx-auto">
              Got questions? We&apos;ve got answers
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className="bg-orange-900/20 backdrop-blur-sm border border-orange-800/30 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-orange-900/30 transition-all duration-300"
                >
                  <h3 className="text-xl font-heading text-white">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 text-orange-400 transition-transform duration-300 ${openAccordion === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === index ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-6 pb-4">
                    <p className="text-orange-200 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
