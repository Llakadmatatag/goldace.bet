'use client';

import React from 'react';
import Link from 'next/link';

// Custom SVG Components for Social Media Icons
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg 
    role="img" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="Discord"
  >
    <title>Discord</title>
    <path 
      fill="#5865F2"
      d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
    />
  </svg>
);

const KickIcon = ({ className }: { className?: string }) => (
  <svg 
    role="img" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="Kick"
  >
    <title>Kick</title>
    <path 
      fill="#53FC19"
      d="M1.333 0h8v5.333H12V2.667h2.667V0h8v8H20v2.667h-2.667v2.666H20V16h2.667v8h-8v-2.667H12v-2.666H9.333V24h-8Z"
    />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg 
    role="img" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="YouTube"
  >
    <title>YouTube</title>
    <path 
      fill="#FF0000"
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
    />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg 
    role="img" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="X"
  >
    <title>X</title>
    <path 
      fill="#ffffff"
      d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l-8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"
    />
  </svg>
);

const Footer: React.FC = () => {
  const socialLinks = [
    {
      name: 'Discord',
      href: 'https://discord.gg/TNSFQXP5',
      icon: DiscordIcon,
    },
    {
      name: 'Kick',
      href: 'https://kick.com/GoldAceCS',
      icon: KickIcon,
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@GoldAceCS',
      icon: YoutubeIcon,
    },
    {
      name: 'X/Twitter',
      href: 'https://x.com/GoldAceCS',
      icon: XIcon,
    },
  ];

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Bonus', href: '/bonus' },
    { label: 'Giveaway', href: '/giveaway' },
    { label: 'Raffle', href: '/raffle' },
    { label: 'Merch Shop', href: '/shop' },
  ];

  const legalLinks = [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookies Policy', href: '/cookies' },
  ];

  return (
    <footer className="bg-gradient-to-b from-black via-gray-900/95 to-black border-t border-gray-800/60 backdrop-blur-xl mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Website Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25 overflow-hidden">
                <img 
                  src="/images/logo.webp" 
                  alt="GoldAce Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-heading text-white tracking-wider">
                GOLD<span className="text-orange-500">ACE</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your All-in-One Hub for Leaderboards, Streams & Rewards. Use code <span className="text-orange-400 font-semibold">GoldAce</span> and level up your perks!
            </p>
            
            {/* Social Media Icons */}
            <div className="flex gap-2 pt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-orange-400 bg-gray-800/60 hover:bg-gray-700/80 border border-gray-700/50 hover:border-orange-500/30 rounded-lg transition-all duration-300"
                    title={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4 font-heading tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Leaderboards */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4 font-heading tracking-wider">Leaderboards</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/leaderboard/csgoroll"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
                >
                  CSGOROLL
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard/monkeytilt"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
                >
                  MONKEYTILT
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4 font-heading tracking-wider">Legal</h3>
            <ul className="space-y-2 mb-6">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Responsible Gambling */}
            <div className="space-y-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-gradient-to-r from-orange-500 to-yellow-400 text-black px-3 py-1 rounded-full font-bold text-sm font-heading">18+</span>
                <span className="text-orange-400 font-semibold text-sm">Responsible Gambling</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                GoldAce is an independent community and affiliate platform. We do not operate any gambling services and are not responsible for any financial losses that may occur on third-party gambling sites we promote. Please gamble responsibly.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800/60 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} GoldAce. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Designed by: <a 
                href="https://discord.com/users/1261209928803287154" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-400 font-semibold hover:text-orange-300 transition-colors duration-200"
              >
                Llakadmatatag
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
