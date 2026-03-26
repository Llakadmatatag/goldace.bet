'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const SignInButton: React.FC = () => {
  const { user, profile, signInWithDiscord, signOut, loading } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

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

  if (loading) {
    return (
      <div className="
        fixed top-4 right-4 z-50
        flex items-center gap-2
        px-4 py-2.5
        bg-gray-800/50
        text-gray-400 font-medium text-sm
        rounded-xl backdrop-blur-sm
        border border-gray-700/50
      ">
        <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (user && profile) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="
              flex items-center gap-2
              px-3 py-2
              bg-gray-800/80 backdrop-blur-sm
              text-white font-medium text-sm
              rounded-xl shadow-lg
              transition-all duration-200
              hover:bg-gray-700/80 hover:shadow-xl
              active:scale-95
              border border-gray-700/50
              cursor-pointer
            "
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 flex items-center justify-center">
                <span className="text-black text-xs font-bold">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="hidden sm:inline">{profile.username}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDropdown && (
            <div className="
              absolute right-0 mt-2 w-48
              bg-gray-800/95 backdrop-blur-sm
              rounded-xl shadow-xl border border-gray-700/50
              overflow-hidden
            ">
              <a
                href="/profile"
                className="
                  block px-4 py-2.5
                  text-gray-300 hover:text-white
                  hover:bg-gray-700/50
                  transition-colors duration-150
                  text-sm font-medium
                  cursor-pointer
                "
                onClick={() => setShowDropdown(false)}
              >
                Profile Settings
              </a>
              <button
                onClick={() => {
                  signOut();
                  setShowDropdown(false);
                }}
                className="
                  w-full px-4 py-2.5
                  text-red-400 hover:text-red-300
                  hover:bg-gray-700/50
                  transition-colors duration-150
                  text-sm font-medium
                  text-left
                  cursor-pointer
                "
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithDiscord}
      className="
        fixed top-4 right-4 z-50
        flex items-center gap-2
        px-4 py-2.5
        bg-gradient-to-r from-orange-500 to-yellow-400
        text-black font-bold text-sm
        rounded-xl shadow-lg shadow-orange-500/25
        transition-all duration-200
        hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105
        active:scale-95
        border border-orange-500/30
        backdrop-blur-sm
        font-audiowide tracking-wide
        cursor-pointer
      "
    >
      <DiscordIcon className="w-4 h-4" />
      <span>Sign In</span>
    </button>
  );
};

export default SignInButton;
