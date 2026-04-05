"use client";

import { useState, useEffect } from "react";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CSGOWINLeaderboard() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set a future launch date (30 days from now as example)
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeRemaining({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        {/* Main Coming Soon Card */}
        <div className="relative opacity-0 animate-fade-in" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
          <div className="relative bg-gradient-to-br from-blue-900/20 to-blue-800/10 backdrop-blur-md border border-blue-800/30 rounded-3xl p-8 lg:p-16 hover:bg-blue-900/30 transition-all duration-300 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Icon */}
              <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full border border-blue-500/50 shadow-lg shadow-blue-500/20">
                  <span className="text-4xl">🎮</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl lg:text-6xl font-audiowide text-white leading-tight mb-4 opacity-0 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                CSGOWIN <span className="text-blue-400">LEADERBOARD</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl lg:text-2xl text-blue-200 mb-12 opacity-0 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                Will start soon
              </p>

              {/* Coming Soon Message */}
              <div className="mb-12 px-6 py-4 bg-blue-900/40 border border-blue-700/50 rounded-xl opacity-0 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                <p className="text-blue-100 text-lg">
                  Get ready for competition! The CSGOWIN leaderboard is launching soon with an exciting prize pool.
                </p>
              </div>

              {/* Countdown Section */}
              <div className="mb-12 opacity-0 animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
                <h2 className="text-xl lg:text-2xl font-audiowide text-blue-300 mb-6">Launch Countdown</h2>
                <div className="flex gap-4 sm:gap-6 justify-center flex-wrap">
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-blue-900/60 to-blue-800/40 border border-blue-700/50 rounded-xl px-4 py-3 min-w-[80px] sm:min-w-[100px] shadow-lg shadow-blue-500/10">
                      <div className="text-3xl sm:text-4xl font-bold text-blue-200">{String(timeRemaining.days).padStart(2, '0')}</div>
                    </div>
                    <div className="text-sm text-blue-300 mt-2 font-semibold">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-blue-900/60 to-blue-800/40 border border-blue-700/50 rounded-xl px-4 py-3 min-w-[80px] sm:min-w-[100px] shadow-lg shadow-blue-500/10">
                      <div className="text-3xl sm:text-4xl font-bold text-blue-200">{String(timeRemaining.hours).padStart(2, '0')}</div>
                    </div>
                    <div className="text-sm text-blue-300 mt-2 font-semibold">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-blue-900/60 to-blue-800/40 border border-blue-700/50 rounded-xl px-4 py-3 min-w-[80px] sm:min-w-[100px] shadow-lg shadow-blue-500/10">
                      <div className="text-3xl sm:text-4xl font-bold text-blue-200">{String(timeRemaining.minutes).padStart(2, '0')}</div>
                    </div>
                    <div className="text-sm text-blue-300 mt-2 font-semibold">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-blue-900/60 to-blue-800/40 border border-blue-700/50 rounded-xl px-4 py-3 min-w-[80px] sm:min-w-[100px] shadow-lg shadow-blue-500/10">
                      <div className="text-3xl sm:text-4xl font-bold text-blue-200">{String(timeRemaining.seconds).padStart(2, '0')}</div>
                    </div>
                    <div className="text-sm text-blue-300 mt-2 font-semibold">Seconds</div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
                <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30">
                  Notify Me When Live
                </button>
              </div>
            </div>

            {/* Top Border Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          </div>
        </div>

        {/* Info Grid Below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Feature 1 */}
          <div className="relative opacity-0 animate-fade-in" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 backdrop-blur-md border border-blue-700/30 rounded-2xl p-6 hover:border-blue-600/50 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-4 mx-auto">
                <span className="text-xl">🏆</span>
              </div>
              <h3 className="text-lg font-audiowide text-white text-center mb-2">Monthly Prizes</h3>
              <p className="text-blue-200 text-center text-sm">Compete for exciting prizes every month</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="relative opacity-0 animate-fade-in" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 backdrop-blur-md border border-blue-700/30 rounded-2xl p-6 hover:border-blue-600/50 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-4 mx-auto">
                <span className="text-xl">📊</span>
              </div>
              <h3 className="text-lg font-audiowide text-white text-center mb-2">Live Rankings</h3>
              <p className="text-blue-200 text-center text-sm">Track your position on the real-time leaderboard</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="relative opacity-0 animate-fade-in" style={{ animationDelay: '900ms', animationFillMode: 'both' }}>
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 backdrop-blur-md border border-blue-700/30 rounded-2xl p-6 hover:border-blue-600/50 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-4 mx-auto">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-audiowide text-white text-center mb-2">Real-Time Updates</h3>
              <p className="text-blue-200 text-center text-sm">Updates sync instantly as players compete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
