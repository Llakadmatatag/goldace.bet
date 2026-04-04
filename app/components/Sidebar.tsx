'use client';

import React, { useState, useEffect } from 'react';
import {
  Home,
  Gift,
  PartyPopper,
  Ticket,
  ShoppingBag,
  Menu,
  X as CloseIcon,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { insforge } from '@/lib/insforge';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mainMenuItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Bonus', href: '/bonus', icon: Gift },
  { label: 'Giveaway', href: '/giveaway', icon: PartyPopper },
  { label: 'Raffle', href: '/raffle', icon: Ticket },
  { label: 'Merch Shop', href: '/shop', icon: ShoppingBag },
];

const leaderboardItems: NavItem[] = [
  { 
    label: 'CSGOROLL', 
    href: '/leaderboard/csgoroll', 
    icon: ({ className }: { className?: string }) => (
      <img 
        src="/images/partners/csgoroll-icon.webp" 
        alt="CSGOROLL" 
        className={`w-5 h-5 ${className || ''}`}
      />
    )
  },
  { 
    label: 'MONKEYTILT', 
    href: '/leaderboard/monkeytilt', 
    icon: ({ className }: { className?: string }) => (
      <img 
        src="/images/partners/monkeytilt-icon.png" 
        alt="MONKEYTILT" 
        className={`w-5 h-5 ${className || ''}`}
      />
    )
  },
  { 
    label: 'CSGOWIN', 
    href: '/leaderboard/csgowin', 
    icon: ({ className }: { className?: string }) => (
      <img 
        src="/images/partners/csgowin-icon.webp" 
        alt="CSGOWIN" 
        className={`w-5 h-5 ${className || ''}`}
      />
    )
  },
];

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
      d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
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
      d="M1.333 0h8v5.333H12V2.667h2.667V0h8v8H20v2.667h-2.667v2.666H20V16h2.667v8h-8v-2.667H12v-2.666H9.333V24h-8Z"/>
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
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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
      d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l-8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/>
  </svg>
);

const socialLinks: SocialLink[] = [
  { name: 'Discord', href: 'https://discord.gg/TNSFQXP5', icon: DiscordIcon },
  { name: 'Kick', href: 'https://kick.com/GoldAceCS', icon: KickIcon },
  { name: 'YouTube', href: 'https://www.youtube.com/@GoldAceCS', icon: YoutubeIcon },
  { name: 'X (Twitter)', href: 'https://x.com/GoldAceCS', icon: XIcon },
];

interface SidebarProps {
  className?: string;
  onToggle?: (expanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '', onToggle }) => {
  const { user, profile } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      if (!mobile) {
        if (isExpanded) {
          document.body.classList.add('sidebar-expanded');
        } else {
          document.body.classList.remove('sidebar-expanded');
        }
      } else {
        document.body.classList.remove('sidebar-expanded');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
    window.removeEventListener('resize', checkMobile);
    if (hoverTimeout) clearTimeout(hoverTimeout);
  };
  }, [isExpanded]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      const timeout = setTimeout(() => {
        setIsExpanded(true);
        onToggle?.(true);
      }, 100);
      setHoverTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      const timeout = setTimeout(() => {
        setIsExpanded(false);
        onToggle?.(false);
      }, 150);
      setHoverTimeout(timeout);
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileOpen && !target.closest('.sidebar') && !target.closest('.mobile-toggle')) {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileOpen]);

  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user || !profile) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await insforge.database
        .from('admin_users')
        .select('discord_id, role')
        .eq('discord_id', profile.discord_id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Sidebar admin check error:', error);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(!!data && data.role === 'admin');
    };

    checkAdminAccess();
  }, [user, profile]);

  const NavItemComponent: React.FC<{ item: NavItem; isExpanded: boolean }> = ({ item, isExpanded }) => {
    const isActive = currentPath === item.href;
    const Icon = item.icon;

    return (
      <a
        href={item.href}
        className={`
          group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer
          ${isActive 
            ? 'bg-orange-500/20 text-orange-300' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
          }
          ${isExpanded ? 'justify-start' : 'justify-center'}
        `}
        aria-label={item.label}
      >
        <Icon className={`
          h-5 w-5 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isActive ? 'text-orange-400' : 'text-gray-500 group-hover:text-orange-400'}
        `} />
        
        {isExpanded && (
          <span className="font-medium text-sm tracking-wide transition-opacity duration-150">
            {item.label}
          </span>
        )}
        
        {/* Tooltip for collapsed state */}
        {!isExpanded && (
          <div className="sidebar-tooltip">
            {item.label}
          </div>
        )}
      </a>
    );
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleMobileSidebar}
          className="mobile-toggle fixed top-4 left-4 z-50 p-2 bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-lg text-white hover:bg-gray-700 transition-all duration-200 cursor-pointer"
        >
          {isMobileOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          sidebar fixed left-0 top-0 h-full z-50
          bg-gradient-to-b from-black via-gray-900/95 to-black
          border-r border-gray-800/60
          shadow-2xl backdrop-blur-xl
          transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isMobile 
            ? `fixed w-64 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} shadow-xl` 
            : `w-16 ${isExpanded ? 'w-56' : 'w-16'}`
          }
          ${className}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Sidebar Content */}
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="px-2 py-6 border-b border-gray-800/50">
            <div className={`
              flex items-center gap-3 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${isMobile || isExpanded ? 'justify-start' : 'justify-center'}
            `}>
              {/* Logo */}
              <div className="w-8 h-auto rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25 overflow-hidden">
                <img 
                  src="/images/logo.webp" 
                  alt="GoldAce Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Brand Name (Expanded) */}
              {isMobile || isExpanded ? (
                <div>
                  <h1 className="text-white font-bold text-lg tracking-wider font-audiowide">GOLD<span className="text-orange-500">ACE</span></h1>
                  <p className="text-gray-400 text-xs">Next Level Community</p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar">
            <div className="space-y-1">
              {mainMenuItems.map((item) => (
                <NavItemComponent key={item.href} item={item} isExpanded={isMobile || isExpanded} />
              ))}
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-gray-800/50"></div>

            {/* Leaderboard Section */}
            <div className="space-y-1">
              {isMobile || isExpanded ? (
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 font-audiowide">
                  Leaderboard
                </h3>
              ) : null}
              
              {leaderboardItems.map((item) => (
                <NavItemComponent key={item.href} item={item} isExpanded={isMobile || isExpanded} />
              ))}
            </div>

            {/* Admin Section - Only show for admins */}
            {user && profile && isAdmin && (
              <>
                {/* Divider */}
                <div className="my-4 border-t border-gray-800/50"></div>
                
                <div className="space-y-1">
                  {isMobile || isExpanded ? (
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 font-audiowide">
                      Admin
                    </h3>
                  ) : null}
                  
                  <NavItemComponent 
                    item={{ 
                      label: 'Admin Panel', 
                      href: '/admin', 
                      icon: Shield 
                    }} 
                    isExpanded={isMobile || isExpanded} 
                  />
                </div>
              </>
            )}

            {/* Development Announcement */}
            {isMobile || isExpanded ? (
              <div className="mt-4 px-3 py-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <p className="text-xs text-orange-300 leading-relaxed">
                  This website is still under development. Some features may not be available at this time.
                </p>
              </div>
            ) : (
              <div className="mt-4 px-2 py-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="sidebar-tooltip">
                  This website is still under development. Some features may not be available at this time.
                </div>
                <div className="w-full h-2 bg-orange-500/20 rounded-full"></div>
              </div>
            )}
          </nav>

          {/* Footer - Social Links */}
          <div className="p-4 border-t border-gray-800/50">
            <div className={`
              ${isMobile || isExpanded ? 'flex items-center justify-between' : 'flex flex-col items-center space-y-3'}
            `}>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      group p-2 rounded-lg transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer
                      ${isMobile || isExpanded ? 'hover:bg-gray-800' : 'hover:bg-gray-800'}
                      hover:border hover:border-orange-500/30
                      ${isMobile || isExpanded ? 'w-auto' : 'w-full flex justify-center'}
                    `}
                    aria-label={social.name}
                  >
                    <Icon className={`
                      h-5 w-5 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${isMobile || isExpanded 
                        ? 'text-gray-400 group-hover:text-orange-400' 
                        : 'text-gray-400 group-hover:text-orange-400'
                      }
                    `} />
                    
                    {/* Tooltip for collapsed state */}
                    {!(isMobile || isExpanded) && (
                      <div className="sidebar-tooltip">
                        {social.name}
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile - rendered outside sidebar */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden cursor-pointer"
          style={{ zIndex: 40 }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;