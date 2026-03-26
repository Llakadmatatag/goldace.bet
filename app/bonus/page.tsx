'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@insforge/sdk';
import { Copy } from 'lucide-react';

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!
});

interface BonusItem {
  id: string;
  partner_logo: string;
  affiliate_code: string;
  bonus_list: string[];
  registration_link: string;
  category: 'Case Opening' | 'Casino';
  created_at: string;
}

export default function BonusPage() {
  const [bonuses, setBonuses] = useState<BonusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Case Opening' | 'Casino'>('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  useEffect(() => {
    fetchBonuses();
  }, []);

  const fetchBonuses = async () => {
    try {
      const { data, error } = await insforge.database
        .from('bonus_list')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBonuses(data || []);
    } catch (error) {
      console.error('Error fetching bonuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setShowCopiedMessage(true);
      setTimeout(() => {
        setShowCopiedMessage(false);
        setCopiedCode(null);
      }, 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const filteredBonuses = selectedCategory === 'All' 
    ? bonuses 
    : bonuses.filter(bonus => bonus.category === selectedCategory);

  const categories: Array<'All' | 'Case Opening' | 'Casino'> = ['All', 'Case Opening', 'Casino'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 font-audiowide">
            Partner <span className="text-orange-500">Bonus</span>
          </h1>
          <p className="text-xl text-gray-400">Unlock exclusive bonuses and rewards from our trusted partners. Use our codes to maximize your gambling experience!</p>
        </div>

        {/* Category Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg border border-gray-700/50 bg-gray-900/50 backdrop-blur-sm p-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-6 py-2 rounded-md font-medium text-sm transition-all duration-200 cursor-pointer
                  ${selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-black shadow-lg shadow-orange-500/25'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="text-gray-400 mt-4">Loading bonus offers...</p>
          </div>
        )}

        {/* Bonus Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBonuses.map((bonus) => (
              <div
                key={bonus.id}
                className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10"
              >
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`
                    inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                    ${bonus.category === 'Case Opening'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }
                  `}>
                    {bonus.category}
                  </span>
                </div>

                {/* Partner Logo */}
                <div className="flex justify-center mb-6">
                  <div className="w-60 rounded-xl bg-gray-800/50 border border-gray-600/30 p-3 flex items-center justify-center">
                    <img
                      src={bonus.partner_logo}
                      alt="Partner Logo"
                      className="h-15 w-auto object-contain"
                    />
                  </div>
                </div>

                {/* Affiliate Code */}
                <div className="text-center mb-4">
                  <p className="text-gray-400 text-sm mb-1">Affiliate Code</p>
                  <div className="inline-flex items-center bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-1.5">
                    <span className="text-orange-400 font-mono font-bold">{bonus.affiliate_code}</span>
                    <button
                      onClick={() => copyToClipboard(bonus.affiliate_code)}
                      className="ml-2 p-1 text-gray-400 hover:text-orange-400 transition-colors duration-200 cursor-pointer"
                      title="Copy code"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                {/* Bonus List */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3 text-center">Available Bonuses</h3>
                  <ul className="space-y-2">
                    {bonus.bonus_list.map((item, index) => (
                      <li key={index} className="flex items-center text-gray-300 text-sm">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-3 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Claim Button */}
                <a
                  href={bonus.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-bold py-3 px-6 rounded-lg text-center hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  Claim Bonus
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBonuses.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 border border-gray-600/30 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No bonuses available</h3>
            <p className="text-gray-400">Check back later for new bonus offers from our partners.</p>
          </div>
        )}

        {/* How to Claim Bonuses Section */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-white mb-8 text-center font-audiowide">
            How to <span className="text-orange-500">Claim Bonuses</span>
          </h2>
          
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
                    <h3 className="text-white font-semibold text-lg mb-1">Explore</h3>
                    <p className="text-gray-400">
                      Discover all bonuses provided by our trusted partners
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm z-10">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">Choose</h3>
                    <p className="text-gray-400">
                      Select the bonus offer that interests you most
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
                    <h3 className="text-white font-semibold text-lg mb-1">Claim</h3>
                    <p className="text-gray-400">
                      Click the 'Claim Bonus' button to register through our affiliate link
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm z-10">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">Create Account</h3>
                    <p className="text-gray-400">
                      Register on partner's website and your bonus will be ready to claim
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm z-10">
                      5
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">Important Note</h3>
                    <p className="text-gray-400">
                      If you already have an account with our partner, you can change the affiliate code you use to our affiliate code (only applicable to certain sites)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copied Message Toast */}
        {showCopiedMessage && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">Code has been copied to clipboard!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
