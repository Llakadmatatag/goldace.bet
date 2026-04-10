import React, { useState, useEffect } from 'react';
import { Trophy, ChevronDown, ChevronUp, Users, Clock, DollarSign, Calendar } from 'lucide-react';
import { createClient } from '@insforge/sdk';

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!
});

interface CSGORollMeta {
  id: string;
  start_date: string;
  end_date: string;
  prize_pool: string;
  prize_distribution: string[];
  created_at: string;
  updated_at: string;
}

interface MonkeyTiltMeta {
  id: string;
  start_date: string;
  end_date: string;
  prize_pool: string;
  prize_distribution: string[];
  created_at: string;
  updated_at: string;
}

interface CSGORollActiveLB {
  referee_id: string;
  referee_display_name: string;
  deposited: number;
  wagered_total: number;
  created_at: string;
}

interface MonkeyTiltActiveLB {
  id: string;
  player_id: string;
  ggr_amount: number;
  affiliate_id: string;
  username: string;
  total_bet_amount: number;
  request_timestamp: string;
  last_updated: string;
  created_at: string;
}

interface LeaderboardAccordionProps {
  type: 'csgoroll' | 'monkeytilt';
  meta: CSGORollMeta | MonkeyTiltMeta | null;
  activeData: CSGORollActiveLB[] | MonkeyTiltActiveLB[] | null;
  onMetaUpdate: () => void;
}

const LeaderboardAccordion: React.FC<LeaderboardAccordionProps> = ({ type, meta, activeData, onMetaUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    start_date: '',
    end_date: '',
    prize_pool: '',
    prize_distribution: ['']
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string>('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCSGORollStats = () => {
    if (!activeData || activeData.length === 0) return null;
    
    const csgorollData = activeData as CSGORollActiveLB[];
    const totalDeposited = csgorollData.reduce((sum, item) => sum + item.deposited, 0);
    const totalWagered = csgorollData.reduce((sum, item) => sum + item.wagered_total, 0);
    
    return {
      totalDeposited,
      totalWagered,
      playerCount: activeData.length
    };
  };

  const getMonkeyTiltStats = () => {
    if (!activeData || activeData.length === 0) return null;
    
    const monkeytiltData = activeData as MonkeyTiltActiveLB[];
    const totalGGR = monkeytiltData.reduce((sum, item) => sum + item.ggr_amount, 0);
    const totalBet = monkeytiltData.reduce((sum, item) => sum + item.total_bet_amount, 0);
    
    return {
      totalGGR,
      totalBet,
      playerCount: activeData.length
    };
  };

  const handleEditToggle = () => {
    if (!isEditing && meta) {
      setEditForm({
        start_date: meta.start_date ? new Date(meta.start_date).toISOString().slice(0, 16) : '',
        end_date: meta.end_date ? new Date(meta.end_date).toISOString().slice(0, 16) : '',
        prize_pool: meta.prize_pool || '',
        prize_distribution: meta.prize_distribution || ['']
      });
    }
    setIsEditing(!isEditing);
    setUpdateError('');
  };

  const handlePrizeDistributionChange = (index: number, value: string) => {
    const newDistribution = [...editForm.prize_distribution];
    newDistribution[index] = value;
    setEditForm({ ...editForm, prize_distribution: newDistribution });
  };

  const addPrizeTier = () => {
    setEditForm({ ...editForm, prize_distribution: [...editForm.prize_distribution, ''] });
  };

  const removePrizeTier = (index: number) => {
    const newDistribution = editForm.prize_distribution.filter((_, i) => i !== index);
    setEditForm({ ...editForm, prize_distribution: newDistribution });
  };

  const handleSave = async () => {
    if (!meta) return;
    
    setIsUpdating(true);
    setUpdateError('');

    try {
      const tableName = type === 'csgoroll' ? 'csgoroll_lb_meta' : 'monkeytilt_lb_meta';
      
      console.log('Attempting to update:', { tableName, metaId: meta.id, editForm });

      const { error, data } = await insforge.database
        .from(tableName)
        .update({
          start_date: editForm.start_date,
          end_date: editForm.end_date,
          prize_pool: editForm.prize_pool,
          prize_distribution: editForm.prize_distribution.filter(prize => prize.trim() !== '')
        })
        .eq('id', meta.id);

      console.log('Update result:', { error, data });

      if (error) throw error;

      // Verify the update by fetching the updated record
      const { data: updatedData, error: fetchError } = await insforge.database
        .from(tableName)
        .select('*')
        .eq('id', meta.id)
        .single();

      console.log('Verification fetch after update:', { updatedData, fetchError });

      setIsEditing(false);
      onMetaUpdate();
    } catch (error) {
      console.error('Error updating leaderboard meta:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setUpdateError(`Failed to update leaderboard: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const stats = type === 'csgoroll' ? getCSGORollStats() : getMonkeyTiltStats();

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 p-3 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-6 h-6 text-black" />
          </div>
          
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white">
              {type === 'csgoroll' ? 'CSGOROLL' : 'MONKEYTILT'}
            </h3>
            <div className="flex items-center gap-3 text-sm">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                type === 'csgoroll' 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}>
                {type === 'csgoroll' ? 'Case Opening' : 'Casino'}
              </span>
              <span className="text-gray-400">
                {stats ? `${stats.playerCount} active players` : 'No active players'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">
            {isOpen ? 'Click to collapse' : 'Click to expand'}
          </span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="border-t border-gray-700/50 p-6">
          {/* Meta Information */}
          {meta && (
            <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-600/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Meta Information
                </h4>
                <button
                  onClick={handleEditToggle}
                  className="px-3 py-1 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>
              
              {updateError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{updateError}</p>
                </div>
              )}

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
                      <input
                        type="datetime-local"
                        value={editForm.start_date}
                        onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">End Date</label>
                      <input
                        type="datetime-local"
                        value={editForm.end_date}
                        onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-1">Prize Pool</label>
                      <input
                        type="text"
                        value={editForm.prize_pool}
                        onChange={(e) => setEditForm({ ...editForm, prize_pool: e.target.value })}
                        placeholder="e.g., $10,000 Prize Pool"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Prize Distribution</label>
                    <div className="space-y-2">
                      {editForm.prize_distribution.map((prize, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={prize}
                            onChange={(e) => handlePrizeDistributionChange(index, e.target.value)}
                            placeholder={`Prize for rank ${index + 1}`}
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          {editForm.prize_distribution.length > 1 && (
                            <button
                              onClick={() => removePrizeTier(index)}
                              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={addPrizeTier}
                        className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 cursor-pointer"
                      >
                        Add Prize Tier
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Leaderboard ID:</span>
                    <p className="text-white font-medium">{meta.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Start Date:</span>
                    <p className="text-white font-medium">{formatDate(meta.start_date)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">End Date:</span>
                    <p className="text-white font-medium">{formatDate(meta.end_date)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Prize Pool:</span>
                    <p className="text-green-400 font-medium">{meta.prize_pool}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-400">Prize Distribution:</span>
                    <p className="text-gray-300">{meta.prize_distribution?.join(', ') || 'None'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-400">Last Updated:</span>
                    <p className="text-gray-300">{formatDate(meta.updated_at)}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Leaderboard Data */}
          {activeData && activeData.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Active Leaderboard ({activeData.length} players)
              </h4>
              
              {/* Summary Stats */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/30">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                      <Users className="w-4 h-4" />
                      Total Players
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.playerCount}</p>
                  </div>
                  
                  {type === 'csgoroll' ? (
                    <>
                      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/30">
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <img src="/images/partners/csgoroll_coin.webp" alt="CSGORoll Coin" className="w-4 h-4" />
                          Total Deposited
                        </div>
                        <p className="text-2xl font-bold text-blue-400">
                          {formatCurrency((stats as any).totalDeposited).replace('$', '')}
                        </p>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/30">
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <img src="/images/partners/csgoroll_coin.webp" alt="CSGORoll Coin" className="w-4 h-4" />
                          Total Wagered
                        </div>
                        <p className="text-2xl font-bold text-orange-400">
                          {formatCurrency((stats as any).totalWagered).replace('$', '')}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/30">
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <DollarSign className="w-4 h-4" />
                          Total GGR
                        </div>
                        <p className="text-2xl font-bold text-green-400">
                          {formatCurrency((stats as any).totalGGR)}
                        </p>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/30">
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <DollarSign className="w-4 h-4" />
                          Total Bet
                        </div>
                        <p className="text-2xl font-bold text-orange-400">
                          {formatCurrency((stats as any).totalBet)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Player List */}
              <div className="bg-gray-900/50 rounded-lg border border-gray-600/30 overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50 border-b border-gray-600/30">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          {type === 'csgoroll' ? 'Referee ID' : 'Player ID'}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Display Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          {type === 'csgoroll' ? 'Deposited' : 'GGR'}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          {type === 'csgoroll' ? 'Wagered' : 'Total Bet'}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600/30">
                      {activeData.map((player, index) => (
                        <tr key={type === 'csgoroll' ? (player as CSGORollActiveLB).referee_id : (player as MonkeyTiltActiveLB).player_id} className="hover:bg-gray-700/30 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-300 font-mono">
                            {type === 'csgoroll' ? (player as CSGORollActiveLB).referee_id : (player as MonkeyTiltActiveLB).player_id}
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            {type === 'csgoroll' ? (player as CSGORollActiveLB).referee_display_name : (player as MonkeyTiltActiveLB).username}
                          </td>
                          <td className="px-4 py-3 text-sm text-blue-400 font-medium">
                            {type === 'csgoroll' ? (
                              <div className="flex items-center gap-1">
                                <img src="/images/partners/csgoroll_coin.webp" alt="CSGORoll Coin" className="w-3 h-3" />
                                <span>{formatCurrency((player as CSGORollActiveLB).deposited).replace('$', '')}</span>
                              </div>
                            ) : (
                              formatCurrency((player as MonkeyTiltActiveLB).ggr_amount)
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-orange-400 font-medium">
                            {type === 'csgoroll' ? (
                              <div className="flex items-center gap-1">
                                <img src="/images/partners/csgoroll_coin.webp" alt="CSGORoll Coin" className="w-3 h-3" />
                                <span>{formatCurrency((player as CSGORollActiveLB).wagered_total).replace('$', '')}</span>
                              </div>
                            ) : (
                              formatCurrency((player as MonkeyTiltActiveLB).total_bet_amount)
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400">
                            {formatDate(type === 'csgoroll' ? (player as CSGORollActiveLB).created_at : (player as MonkeyTiltActiveLB).created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const LeaderboardManagement: React.FC = () => {
  const [csgorollMeta, setCSGORollMeta] = useState<CSGORollMeta | null>(null);
  const [monkeytiltMeta, setMonkeyTiltMeta] = useState<MonkeyTiltMeta | null>(null);
  const [csgorollActive, setCSGORollActive] = useState<CSGORollActiveLB[] | null>(null);
  const [monkeytiltActive, setMonkeyTiltActive] = useState<MonkeyTiltActiveLB[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleMetaUpdate = () => {
    fetchLeaderboardData();
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      
      const [csgorollMetaResult, csgorollActiveResult] = await Promise.all([
        insforge.database
          .from('csgoroll_lb_meta')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single(),
        insforge.database
          .from('csgoroll_active_lb')
          .select('*')
          .order('wagered_total', { ascending: false })
          .limit(50)
      ]);

      const [monkeytiltMetaResult, monkeytiltActiveResult] = await Promise.all([
        insforge.database
          .from('monkeytilt_lb_meta')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single(),
        insforge.database
          .from('monkeytilt_active_lb')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)
      ]);

      console.log('CSGOROLL Meta Result:', csgorollMetaResult);
      console.log('CSGOROLL Active Result:', csgorollActiveResult);
      console.log('MonkeyTilt Meta Result:', monkeytiltMetaResult);
      console.log('MonkeyTilt Active Result:', monkeytiltActiveResult);

      if (csgorollMetaResult.error) {
        console.error('CSGOROLL Meta Error:', csgorollMetaResult.error);
        throw csgorollMetaResult.error;
      }
      if (csgorollActiveResult.error) {
        console.error('CSGOROLL Active Error:', csgorollActiveResult.error);
        throw csgorollActiveResult.error;
      }
      if (monkeytiltMetaResult.error) {
        console.error('MonkeyTilt Meta Error:', monkeytiltMetaResult.error);
        throw monkeytiltMetaResult.error;
      }
      if (monkeytiltActiveResult.error) {
        console.error('MonkeyTilt Active Error:', monkeytiltActiveResult.error);
        throw monkeytiltActiveResult.error;
      }

      setCSGORollMeta(csgorollMetaResult.data || null);
      setCSGORollActive(csgorollActiveResult.data || null);
      setMonkeyTiltMeta(monkeytiltMetaResult.data || null);
      setMonkeyTiltActive(monkeytiltActiveResult.data || null);
      
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-gray-400 mt-4">Loading leaderboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Error Loading Leaderboards</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchLeaderboardData}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Leaderboard Management</h2>
          <p className="text-gray-400">
            Monitor and manage active leaderboards for CSGOROLL and MONKEYTILT platforms
          </p>
        </div>
        <button
          onClick={fetchLeaderboardData}
          className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          Refresh
        </button>
      </div>

      {/* Leaderboard Accordions */}
      <div className="space-y-4">
        <LeaderboardAccordion
          type="csgoroll"
          meta={csgorollMeta}
          activeData={csgorollActive}
          onMetaUpdate={handleMetaUpdate}
        />
        
        <LeaderboardAccordion
          type="monkeytilt"
          meta={monkeytiltMeta}
          activeData={monkeytiltActive}
          onMetaUpdate={handleMetaUpdate}
        />
      </div>

      {/* Empty State */}
      {(!csgorollMeta && !monkeytiltMeta) && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Leaderboard Data</h3>
          <p className="text-gray-500">No leaderboard data is currently available.</p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardManagement;
