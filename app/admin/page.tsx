"use client";

import { useState, useEffect } from "react";
import { insforge } from "@/lib/insforge";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Gift, Trophy, PartyPopper, Ticket, Shield, LogOut } from "lucide-react";
import {
  UserManagement,
  BonusManagement,
  LeaderboardManagement,
  GiveawayManagement,
  RaffleManagement
} from "../components/admin";

interface AdminUser {
  id: string;
  discord_id: string;
  username: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

const AdminPage: React.FC = () => {
  const { user, profile, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("users");
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const tabs = [
    { id: "users", name: "User Management", icon: Users },
    { id: "bonus", name: "Bonus Management", icon: Gift },
    { id: "leaderboard", name: "Leaderboard Management", icon: Trophy },
    { id: "giveaway", name: "Giveaway Management", icon: PartyPopper },
    { id: "raffle", name: "Raffle Management", icon: Ticket },
  ];

  useEffect(() => {
    checkAdminAccess();
  }, [user, profile]);

  const checkAdminAccess = async () => {
    if (!user || !profile) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: adminRecord, error } = await insforge.database
        .from('admin_users')
        .select('discord_id, role')
        .eq('discord_id', profile.discord_id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const hasAdminAccess = !!adminRecord && adminRecord.role === 'admin';
      setIsAdmin(hasAdminAccess);

      if (hasAdminAccess) {
        await fetchAdminUsers();
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const { data, error } = await insforge.database
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminUsers(data || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />;
      case "bonus":
        return <BonusManagement />;
      case "leaderboard":
        return <LeaderboardManagement />;
      case "giveaway":
        return <GiveawayManagement />;
      case "raffle":
        return <RaffleManagement />;
      default:
        return null;
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="text-gray-400 mt-4">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400">Please sign in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">You don't have permission to access the admin panel.</p>
          <button
            onClick={signOut}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Shield className="w-8 h-8 text-orange-500" />
                Admin Panel
              </h1>
              <p className="text-gray-400 mt-1">Manage your website from here</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-medium">{profile.username}</p>
                <p className="text-gray-400 text-sm">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 flex items-center justify-center">
                <span className="text-black font-bold">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 cursor-pointer
                      ${activeTab === tab.id
                        ? 'border-orange-500 text-orange-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
          {renderTabContent()}
        </div>

        {/* Admin Setup Info */}
        <div className="mt-8 bg-orange-900/20 border border-orange-700/30 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Admin Setup Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Your Discord ID:</span>
              <code className="bg-gray-800 px-3 py-1 rounded text-orange-400 font-mono">
                {profile.discord_id}
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Your Username:</span>
              <code className="bg-gray-800 px-3 py-1 rounded text-orange-400 font-mono">
                {profile.username}
              </code>
            </div>
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
              <p className="text-gray-300 text-xs mb-2">
                To properly secure admin access, run this SQL command:
              </p>
              <pre className="text-xs text-orange-400 font-mono overflow-x-auto">
{`INSERT INTO admin_users (discord_id, username, role) 
VALUES ('${profile.discord_id}', '${profile.username}', 'admin')
ON CONFLICT (discord_id) DO UPDATE SET username = '${profile.username}';`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
