"use client";

import { useState, useEffect } from "react";
import { createClient } from "@insforge/sdk";
import { useAuth } from "@/contexts/AuthContext";
import { User, Copy, Check } from "lucide-react";

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!
});

interface Profile {
  id: string;
  discord_id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  role: string;
  email: string | null;
  csgoroll_id: string | null;
  monkeytilt_username: string | null;
}

const ProfilePage: React.FC = () => {
  const { user, profile: authProfile, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<string>("");
  const [isEditing, setIsEditing] = useState<{ csgoroll: boolean; monkeytilt: boolean }>({
    csgoroll: false,
    monkeytilt: false
  });
  const [inputValues, setInputValues] = useState<{ csgoroll_id: string; monkeytilt_username: string }>({
    csgoroll_id: '',
    monkeytilt_username: ''
  });
  const [updateError, setUpdateError] = useState<{ csgoroll: string; monkeytilt: string }>({
    csgoroll: '',
    monkeytilt: ''
  });
  const [isUpdating, setIsUpdating] = useState<{ csgoroll: boolean; monkeytilt: boolean }>({
    csgoroll: false,
    monkeytilt: false
  });

  useEffect(() => {
    if (authProfile) {
      fetchProfile();
    }
  }, [authProfile]);

  const fetchProfile = async () => {
    if (!authProfile || !user) {
      setIsLoading(false);
      return;
    }
    
    const userId = user.id;
    
    try {
      console.log('Fetching profile for user ID:', userId);
      
      const { data, error } = await insforge.database
        .from('profiles')
        .select('*')
        .eq('id', userId);

      console.log('Profile query result:', { data, error });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('No profile found for user, creating new profile');
        await createProfile();
        return;
      }

      console.log('Profile found:', data[0]);
      setProfile(data[0]);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const createProfile = async () => {
    if (!authProfile || !user) return;
    
    const userId = user.id;
    const discordId = authProfile.discord_id;
    const username = authProfile.username;
    const avatarUrl = authProfile.avatar_url;
    
    try {
      console.log('Creating new profile for user ID:', userId);
      
      const { data, error } = await insforge.database
        .from('profiles')
        .insert({
          id: userId,
          discord_id: discordId,
          username: username,
          avatar_url: avatarUrl,
          role: 'user'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }

      console.log('Profile created successfully:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error creating profile:', error);
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(""), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const checkDuplicate = async (field: 'csgoroll_id' | 'monkeytilt_username', value: string): Promise<boolean> => {
    try {
      const { data, error } = await insforge.database
        .from('profiles')
        .select('id')
        .eq(field, value)
        .neq('id', profile?.id || '');

      if (error) throw error;
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking duplicate:', error);
      return false;
    }
  };

  const updateProfileField = async (field: 'csgoroll_id' | 'monkeytilt_username', value: string) => {
    if (!profile || !value.trim()) {
      setUpdateError(prev => ({ ...prev, [field === 'csgoroll_id' ? 'csgoroll' : 'monkeytilt']: 'This field is required' }));
      return;
    }

    setIsUpdating(prev => ({ ...prev, [field === 'csgoroll_id' ? 'csgoroll' : 'monkeytilt']: true }));
    setUpdateError(prev => ({ ...prev, [field === 'csgoroll_id' ? 'csgoroll' : 'monkeytilt']: '' }));

    try {
      const isDuplicate = await checkDuplicate(field, value.trim());
      if (isDuplicate) {
        setUpdateError(prev => ({ 
          ...prev, 
          [field === 'csgoroll_id' ? 'csgoroll' : 'monkeytilt']: `This ${field === 'csgoroll_id' ? 'CSGORoll ID' : 'MonkeyTilt username'} is already registered by another user` 
        }));
        return;
      }

      const { data, error } = await insforge.database
        .from('profiles')
        .update({ [field]: value.trim() })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      setIsEditing(prev => ({ ...prev, [field === 'csgoroll_id' ? 'csgoroll' : 'monkeytilt']: false }));
      setInputValues(prev => ({ ...prev, [field]: '' }));
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateError(prev => ({ 
        ...prev, 
        [field === 'csgoroll_id' ? 'csgoroll' : 'monkeytilt']: 'Failed to update. Please try again.' 
      }));
    } finally {
      setIsUpdating(prev => ({ ...prev, [field === 'csgoroll_id' ? 'csgoroll' : 'monkeytilt']: false }));
    }
  };

  const handleEditToggle = (field: 'csgoroll' | 'monkeytilt') => {
    setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
    setUpdateError(prev => ({ ...prev, [field]: '' }));
    setInputValues(prev => ({ ...prev, [field === 'csgoroll' ? 'csgoroll_id' : 'monkeytilt_username']: '' }));
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="text-gray-400 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !authProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto text-orange-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-400">Your profile could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 font-audiowide">
            My <span className="text-orange-500">Profile</span>
          </h1>
          <p className="text-xl text-gray-400">Manage your account settings and linked platforms</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 mb-8">
          {/* User Info Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 p-1">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-orange-400">
                      {profile.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">{profile.username}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <span className="text-gray-400 text-sm">User ID: {profile.id.slice(0, 8)}...</span>
              </div>
              
              {/* Discord Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-gray-400">Discord ID:</span>
                  <code className="bg-gray-800 px-2 py-1 rounded text-orange-400 font-mono text-sm">
                    {profile.discord_id}
                  </code>
                  <button
                    onClick={() => copyToClipboard(profile.discord_id, 'discord_id')}
                    className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    {copied === 'discord_id' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700/50 my-8"></div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CSGORoll ID */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src="/images/partners/csgoroll-icon.webp" 
                  alt="CSGORoll" 
                  className="w-5 h-5 rounded"
                />
                <h3 className="text-lg font-semibold text-white">CSGORoll ID</h3>
              </div>
              
              {isEditing.csgoroll ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={inputValues.csgoroll_id}
                    onChange={(e) => setInputValues(prev => ({ ...prev, csgoroll_id: e.target.value }))}
                    placeholder="Enter your CSGORoll ID"
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:bg-gray-700/70 transition-colors"
                    disabled={isUpdating.csgoroll}
                  />
                  {updateError.csgoroll && (
                    <p className="text-red-400 text-sm">{updateError.csgoroll}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateProfileField('csgoroll_id', inputValues.csgoroll_id)}
                      disabled={isUpdating.csgoroll || !inputValues.csgoroll_id.trim()}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      {isUpdating.csgoroll ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => handleEditToggle('csgoroll')}
                      disabled={isUpdating.csgoroll}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">
                      {profile.csgoroll_id || 'Not linked'}
                    </span>
                    {profile.csgoroll_id && (
                      <button
                        onClick={() => copyToClipboard(profile.csgoroll_id!, 'csgoroll_id')}
                        className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
                      >
                        {copied === 'csgoroll_id' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  {!profile.csgoroll_id && (
                    <button
                      onClick={() => handleEditToggle('csgoroll')}
                      className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors cursor-pointer"
                    >
                      Add ID
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* MonkeyTilt Username */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src="/images/partners/monkeytilt-icon.png" 
                  alt="MonkeyTilt" 
                  className="w-5 h-5 rounded"
                />
                <h3 className="text-lg font-semibold text-white">MonkeyTilt Username</h3>
              </div>
              
              {isEditing.monkeytilt ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={inputValues.monkeytilt_username}
                    onChange={(e) => setInputValues(prev => ({ ...prev, monkeytilt_username: e.target.value }))}
                    placeholder="Enter your MonkeyTilt username"
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:bg-gray-700/70 transition-colors"
                    disabled={isUpdating.monkeytilt}
                  />
                  {updateError.monkeytilt && (
                    <p className="text-red-400 text-sm">{updateError.monkeytilt}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateProfileField('monkeytilt_username', inputValues.monkeytilt_username)}
                      disabled={isUpdating.monkeytilt || !inputValues.monkeytilt_username.trim()}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      {isUpdating.monkeytilt ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => handleEditToggle('monkeytilt')}
                      disabled={isUpdating.monkeytilt}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">
                      {profile.monkeytilt_username || 'Not linked'}
                    </span>
                    {profile.monkeytilt_username && (
                      <button
                        onClick={() => copyToClipboard(profile.monkeytilt_username!, 'monkeytilt_username')}
                        className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
                      >
                        {copied === 'monkeytilt_username' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  {!profile.monkeytilt_username && (
                    <button
                      onClick={() => handleEditToggle('monkeytilt')}
                      className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors cursor-pointer"
                    >
                      Add Username
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Admin Note */}
        <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-6 mt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-orange-400 text-sm font-bold">!</span>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Need to make changes?</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Once you've added your CSGORoll ID or MonkeyTilt username, these fields cannot be edited directly. 
                If you need to update them due to errors or account changes, please contact an administrator for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
