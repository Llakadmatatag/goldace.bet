"use client";

import { useState, useEffect } from "react";
import { insforge } from "@/lib/insforge";
import { Copy } from "lucide-react";

interface LeaderboardPlayer {
  rank: number;
  username: string;
  wager: number;
  prize: number;
}

interface MetaData {
  prize_pool: string;
  end_date: string;
  prize_distribution: number[];
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function MonkeyTiltLeaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardPlayer[]>([]);
  const [previousWinners, setPreviousWinners] = useState<LeaderboardPlayer[]>([]);
  const [metaData, setMetaData] = useState<MetaData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const { data: metaDataResponse, error: metaError } = await insforge.database
          .from('monkeytilt_lb_meta')
          .select('*')
          .single();
        
        if (metaError) {
          console.error('Error fetching metadata:', metaError);
          return;
        }
        
        const { data: leaderboardResponse, error: leaderboardError } = await insforge.database
          .from('monkeytilt_active_lb')
          .select('player_id, total_bet_amount')
          .order('total_bet_amount', { ascending: false });
        
        const { data: previousWinnersResponse, error: previousWinnersError } = await insforge.database
          .from('monkeytilt_previous_lb')
          .select('username, wager, prize')
          .order('wager', { ascending: false })
          .limit(3);
        
        if (leaderboardError) {
          console.error('Error fetching leaderboard:', leaderboardError);
          return;
        }
        
        if (previousWinnersError) {
          console.error('Error fetching previous winners:', previousWinnersError);
        }
        
        const prizeDistribution = metaDataResponse.prize_distribution as number[];
        const processedLeaderboard = leaderboardResponse.map((player: any, index: number) => ({
          rank: index + 1,
          username: player.player_id,
          wager: player.total_bet_amount,
          prize: prizeDistribution[index] || 0
        }));
        
        const processedPreviousWinners = (previousWinnersResponse || []).map((winner: any, index: number) => ({
          rank: index + 1,
          username: winner.username,
          wager: Number(winner.wager) || 0,
          prize: Number(winner.prize) || 0
        }));
        
        setMetaData(metaDataResponse);
        setLeaderboardData(processedLeaderboard);
        setPreviousWinners(processedPreviousWinners);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!metaData?.end_date) return;
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endDate = new Date(metaData.end_date).getTime();
      const distance = endDate - now;

      if (distance > 0) {
        setTimeRemaining({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [metaData]);

  const maskUsername = (username: string) => {
    if (!username) return "Anonymous";
    if (username.length <= 2) return username;
    return username.slice(0, 2) + "*".repeat(username.length - 2);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Banner Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative bg-gradient-to-br from-orange-900/20 to-orange-800/10 backdrop-blur-md border border-orange-800/30 rounded-2xl p-8 lg:p-12 hover:bg-orange-900/30 transition-all duration-300 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-20">
              <img 
                src="/images/backgrounds/monkeytilt-banner-bg.avif" 
                alt="MonkeyTilt Banner Background" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* LEFT SIDE */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <img src="/images/partners/monkeytilt-logo.avif" alt="MonkeyTilt" className="w-55 h-auto mb-4" />
                <h1 className="text-4xl lg:text-5xl font-audiowide text-white leading-tight mb-2">
                  Monthly <span className="text-orange-400">Leaderboard</span>
                </h1>
                <p className="text-xl text-orange-200 flex items-center gap-2">
                  Prize Pool: <span className="text-yellow-400 font-bold">${metaData?.prize_pool || '250'}</span>
                </p>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex flex-col items-center lg:items-end text-center lg:text-right">
                <h2 className="text-2xl font-audiowide text-white mb-4">Time Remaining</h2>
                <div className="flex gap-2 sm:gap-4">
                  <div className="text-center">
                    <div className="bg-orange-800/30 border border-orange-700/50 rounded-lg px-3 py-2 min-w-[60px]">
                      <div className="text-2xl font-bold text-white">{String(timeRemaining.days).padStart(2, '0')}</div>
                    </div>
                    <div className="text-xs text-orange-200 mt-1">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-800/30 border border-orange-700/50 rounded-lg px-3 py-2 min-w-[60px]">
                      <div className="text-2xl font-bold text-white">{String(timeRemaining.hours).padStart(2, '0')}</div>
                    </div>
                    <div className="text-xs text-orange-200 mt-1">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-800/30 border border-orange-700/50 rounded-lg px-3 py-2 min-w-[60px]">
                      <div className="text-2xl font-bold text-white">{String(timeRemaining.minutes).padStart(2, '0')}</div>
                    </div>
                    <div className="text-xs text-orange-200 mt-1">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-800/30 border border-orange-700/50 rounded-lg px-3 py-2 min-w-[60px]">
                      <div className="text-2xl font-bold text-white">{String(timeRemaining.seconds).padStart(2, '0')}</div>
                    </div>
                    <div className="text-xs text-orange-200 mt-1">Seconds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Podium Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rank 2 - Left */}
            <div className="relative opacity-0 animate-fade-in" style={{ animationDelay: '80ms', animationFillMode: 'both' }}>
              <div className="bg-gradient-to-br from-gray-900/90 to-slate-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:from-gray-800/90 hover:to-slate-700/90 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/20">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-gray-300">#2</div>
                  </div>
                  <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Prize</div>
                    <div className="text-xl font-bold text-gray-200">
                      ${leaderboardData[1]?.prize || '0'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-700/50 rounded-md flex items-center justify-center border-2 border-gray-600/50 overflow-hidden">
                    <img src="/images/partners/monkeytilt-icon.png" alt="MonkeyTilt" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white truncate max-w-[120px] sm:max-w-[150px]">
                      {maskUsername(leaderboardData[1]?.username)}
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-700/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total Wager</span>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-gray-200">
                        ${leaderboardData[1]?.wager?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rank 1 - Center */}
            <div className="relative opacity-0 animate-fade-in" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
              <div className="bg-gradient-to-br from-yellow-900/90 to-amber-800/90 backdrop-blur-xl border border-yellow-600/50 rounded-2xl p-6 hover:from-yellow-800/90 hover:to-amber-700/90 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold text-yellow-300">#1</div>
                    </div>
                    <div className="h-8 w-px bg-gradient-to-b from-transparent via-yellow-600 to-transparent"></div>
                    <div className="text-right">
                      <div className="text-xs text-yellow-400 uppercase tracking-wider">Prize</div>
                      <div className="text-2xl font-bold text-yellow-200">
                        ${leaderboardData[0]?.prize || '0'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-600/50 to-amber-600/50 rounded-md flex items-center justify-center border-2 border-yellow-500/50 shadow-lg shadow-yellow-500/30 overflow-hidden">
                      <img src="/images/partners/monkeytilt-icon.png" alt="MonkeyTilt" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white truncate max-w-[140px] sm:max-w-[180px]">
                        {maskUsername(leaderboardData[0]?.username)}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-yellow-700/50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-yellow-400">Total Wager</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-bold text-yellow-200">
                          ${leaderboardData[0]?.wager?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rank 3 - Right */}
            <div className="relative opacity-0 animate-fade-in" style={{ animationDelay: '160ms', animationFillMode: 'both' }}>
              <div className="bg-gradient-to-br from-orange-900/90 to-amber-900/90 backdrop-blur-xl border border-orange-700/50 rounded-2xl p-6 hover:from-orange-800/90 hover:to-amber-800/90 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-orange-300">#3</div>
                  </div>
                  <div className="h-8 w-px bg-gradient-to-b from-transparent via-orange-600 to-transparent"></div>
                  <div className="text-right">
                    <div className="text-xs text-orange-400 uppercase tracking-wider">Prize</div>
                    <div className="text-xl font-bold text-orange-200">
                      ${leaderboardData[2]?.prize || '0'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-orange-700/50 rounded-md flex items-center justify-center border-2 border-orange-600/50 overflow-hidden">
                    <img src="/images/partners/monkeytilt-icon.png" alt="MonkeyTilt" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white truncate max-w-[120px] sm:max-w-[150px]">
                      {maskUsername(leaderboardData[2]?.username)}
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-orange-700/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-orange-400">Total Wager</span>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-orange-200">
                        ${leaderboardData[2]?.wager?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Leaderboard Table */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-900/20 backdrop-blur-md border border-orange-800/30 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-orange-800/30">
                    <th className="px-4 py-4 text-left text-orange-400 font-semibold w-20">Rank</th>
                    <th className="px-6 py-4 text-left text-orange-400 font-semibold">Username</th>
                    <th className="px-6 py-4 text-right text-orange-400 font-semibold">Wager</th>
                    <th className="px-6 py-4 text-right text-orange-400 font-semibold">Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
                          <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse delay-75"></div>
                          <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse delay-150"></div>
                        </div>
                        <p className="text-orange-200 mt-4">Loading leaderboard data...</p>
                      </td>
                    </tr>
                  ) : leaderboardData.length > 3 ? (
                    (() => {
                      const ranksFrom4 = leaderboardData.slice(3);
                      const startIndex = (currentPage - 1) * itemsPerPage;
                      const endIndex = startIndex + itemsPerPage;
                      const currentData = ranksFrom4.slice(startIndex, endIndex);
                      
                      return currentData.map((player) => (
                        <tr key={player.rank} className="border-b border-orange-800/20 hover:bg-orange-900/20 transition-colors">
                          <td className="px-4 py-4">
                            <span className="text-white font-bold text-lg">#{player.rank}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-white font-medium">{maskUsername(player.username)}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-orange-300 font-semibold">
                                ${player.wager.toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-orange-400 font-semibold">
                                ${player.prize || '0'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="w-16 h-16 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📊</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Data Available</h3>
                        <p className="text-orange-200">
                          Leaderboard data will appear here once players start competing.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Pagination Controls */}
      {leaderboardData.length > 3 && (() => {
        const ranksFrom4 = leaderboardData.slice(3);
        const totalPages = Math.ceil(ranksFrom4.length / itemsPerPage);
        const isLastPage = currentPage === totalPages;
        const isFirstPage = currentPage === 1;
        
        if (totalPages <= 1) return null;

        return (
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-orange-200">
                  Showing {((currentPage - 1) * itemsPerPage) + 4} to {Math.min(currentPage * itemsPerPage + 3, leaderboardData.length)} of {leaderboardData.length} players
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={isFirstPage}
                    className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isFirstPage
                        ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                        : 'bg-orange-900/30 text-orange-200 hover:bg-orange-800/50 border border-orange-700/30'
                    }`}
                  >
                    ← Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {(() => {
                      const pages = [];
                      
                      for (let i = 1; i <= totalPages; i++) {
                        if (
                          i === 1 || 
                          i === totalPages || 
                          (i >= currentPage - 1 && i <= currentPage + 1)
                        ) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i)}
                              className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                                currentPage === i
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-orange-900/30 text-orange-200 hover:bg-orange-800/50 border border-orange-700/30'
                              }`}
                            >
                              {i}
                            </button>
                          );
                        } else if (i === currentPage - 2 || i === currentPage + 2) {
                          pages.push(
                            <span key={i} className="text-orange-400">...</span>
                          );
                        }
                      }
                      
                      return pages;
                    })()}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={isLastPage}
                    className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isLastPage
                        ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                        : 'bg-orange-900/30 text-orange-200 hover:bg-orange-800/50 border border-orange-700/30'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Previous Winners Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-audiowide text-white mb-4">
              Previous <span className="text-orange-400">Winners</span>
            </h2>
            <p className="text-xl text-orange-200 max-w-3xl mx-auto">
              Celebrating our past leaderboard champions and their achievements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previousWinners.length > 0 ? (
              previousWinners.map((winner) => (
                <div
                  key={winner.rank}
                  className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 backdrop-blur-md border border-orange-800/30 rounded-xl p-6 hover:bg-orange-900/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-black font-bold">
                        {winner.rank}
                      </div>
                      <span className="text-orange-400 font-semibold">
                        {winner.rank === 1 ? 'Previous Champion' : winner.rank === 2 ? 'Previous Runner-up' : 'Previous Winner'}
                      </span>
                    </div>
                    <div className="text-yellow-400 font-bold">
                      ${winner.prize?.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center border-2 border-gray-600/50">
                      <img src="/images/partners/monkeytilt-icon.png" alt="MonkeyTilt" className="w-8 h-8 object-cover" />
                    </div>
                    <div>
                      <div className="text-white font-semibold break-words max-w-[180px]">
                        {maskUsername(winner.username)}
                      </div>
                      <div className="text-gray-400 text-sm">Previous leaderboard runner</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-orange-800/30 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Total Wager</span>
                      <span className="text-orange-300 font-semibold">
                        ${winner.wager.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Prize</span>
                      <span className="text-yellow-400 font-semibold">
                        ${winner.prize?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 backdrop-blur-md border border-orange-800/30 rounded-xl p-6 hover:bg-orange-900/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index}
                      </div>
                      <span className="text-orange-400 font-semibold">
                        Previous Winner
                      </span>
                    </div>
                    <div className="text-yellow-400 font-bold">TBA</div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center border-2 border-gray-600/50">
                      <img src="/images/partners/monkeytilt-icon.png" alt="MonkeyTilt" className="w-8 h-8 object-cover" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Waiting for Winner</div>
                      <div className="text-gray-400 text-sm">Previous month leaderboard</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-orange-800/30">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Total Wager</span>
                      <span className="text-orange-300 font-semibold">TBA</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-400 italic">
              Join the competition and become our next champion!
            </p>
          </div>
        </div>
      </section>

      {/* How to Participate Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-audiowide text-white mb-4">
              How to <span className="text-orange-400">Participate</span> in the Leaderboard
            </h2>
            <p className="text-xl text-orange-200 max-w-3xl mx-auto">
              Follow these simple steps to climb the rankings and win prizes
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-orange-500/50 to-yellow-400/50"></div>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm z-10">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">Register on MonkeyTilt</h3>
                    <p className="text-gray-400 mb-3">
                      Use this link or enter the Affiliate code <span className="text-orange-400 font-bold">'GoldAce'</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href="https://monkeytilt.com/r/GOLDACE/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-bold py-2 px-6 rounded-lg text-center hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
                      >
                        Register via Link
                      </a>
                      <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-600/30 rounded-lg px-4 py-2">
                        <span className="text-orange-400 font-mono font-bold">GoldAce</span>
                        <button
                          onClick={() => copyToClipboard('GoldAce')}
                          className="p-1 text-gray-400 hover:text-orange-400 transition-colors duration-200"
                          title="Copy code"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                    {copiedCode === 'GoldAce' && (
                      <p className="text-green-400 text-sm mt-2 animate-pulse">Code copied!</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm z-10">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">Start Wagering</h3>
                    <p className="text-gray-400">
                      Begin playing and placing bets to start accumulating your wager total
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm z-10">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">Climb the Rankings</h3>
                    <p className="text-gray-400">
                      The more you wager, the higher your position will be in the leaderboard
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
