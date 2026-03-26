import React, { useState, useEffect } from 'react';
import { Users, Calendar, Shield, ChevronDown, ChevronUp, Copy, Check, Mail, User, Edit, Trash2, Save, X } from 'lucide-react';
import { createClient } from '@insforge/sdk';

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!
});

interface Profile {
  id: string;
  discord_id: string;
  username: string;
  avatar_url: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
  role: string;
  csgoroll_id: string | null;
  monkeytilt_username: string | null;
}

interface UserAccordionProps {
  profile: Profile;
  onProfileUpdate?: () => void;
}

const UserAccordion: React.FC<UserAccordionProps> = ({ profile, onProfileUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<string>("");
  const [isEditing, setIsEditing] = useState<{ csgoroll: boolean; monkeytilt: boolean }>({
    csgoroll: false,
    monkeytilt: false
  });
  const [editValues, setEditValues] = useState<{ csgoroll_id: string; monkeytilt_username: string }>({
    csgoroll_id: '',
    monkeytilt_username: ''
  });
  const [isUpdating, setIsUpdating] = useState<{ csgoroll: boolean; monkeytilt: boolean }>({
    csgoroll: false,
    monkeytilt: false
  });
  const [updateError, setUpdateError] = useState<{ csgoroll: string; monkeytilt: string }>({
    csgoroll: '',
    monkeytilt: ''
  });
  const [currentProfile, setCurrentProfile] = useState<Profile>(profile);

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
        .neq('id', currentProfile.id);

      if (error) throw error;
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking duplicate:', error);
      return false;
    }
  };

  const updateProfileField = async (field: 'csgoroll_id' | 'monkeytilt_username', value: string | null) => {
    setIsUpdating(prev => ({ ...prev, [field === 'csgoroll_id' ? 'csgoroll' : 'monkeytilt']: true }));
    setUpdateError(prev => ({ ...prev, [field === 'csgoroll_id' ? 'csgoroll' : 'monkeytilt']: '' }));

    try {
      if (value && value.trim()) {
        const isDuplicate = await checkDuplicate(field, value.trim());
        if (isDuplicate) {
          setUpdateError(prev => ({ 
            ...prev, 
            [field === 'csgoroll_id' ? 'csgoroll' : 'monkeytilt']: `This ${field === 'csgoroll_id' ? 'CSGORoll ID' : 'MonkeyTilt username'} is already registered by another user` 
          }));
          return;
        }
      }

      // Update the profile
      const { data, error } = await insforge.database
        .from('profiles')
        .update({ [field]: value ? value.trim() : null })
        .eq('id', currentProfile.id)
        .select()
        .single();

      if (error) throw error;

      setCurrentProfile(data);
      setIsEditing(prev => ({ ...prev, [field === 'csgoroll_id' ? 'csgoroll' : 'monkeytilt']: false }));
      setEditValues(prev => ({ ...prev, [field]: '' }));
      
      if (onProfileUpdate) {
        onProfileUpdate();
      }
      
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
    if (field === 'csgoroll') {
      setEditValues(prev => ({ ...prev, csgoroll_id: currentProfile.csgoroll_id || '' }));
    } else {
      setEditValues(prev => ({ ...prev, monkeytilt_username: currentProfile.monkeytilt_username || '' }));
    }
  };

  const handleDelete = (field: 'csgoroll' | 'monkeytilt') => {
    const profileField = field === 'csgoroll' ? 'csgoroll_id' : 'monkeytilt_username';
    updateProfileField(profileField, null);
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

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
      {/* Header (always visible) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
      >
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 p-0.5 flex-shrink-0">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
              {currentProfile.avatar_url ? (
                <img
                  src={currentProfile.avatar_url}
                  alt={currentProfile.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-orange-400">
                  {currentProfile.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white">{currentProfile.username}</h3>
            <div className="flex items-center gap-3 text-sm">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                currentProfile.role === 'admin' 
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                <Shield className="w-3 h-3 mr-1" />
                {currentProfile.role}
              </span>
              <span className="text-gray-400">
                Member since {formatDate(currentProfile.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Chevron */}
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

      {/* Expanded Content (visible when open) */}
      {isOpen && (
        <div className="border-t border-gray-700/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-400" />
                Basic Information
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">User ID:</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-700 px-2 py-1 rounded text-orange-400 font-mono text-sm">
                      {profile.id.slice(0, 8)}...
                    </code>
                    <button
                      onClick={() => copyToClipboard(profile.id, 'id')}
                      className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
                    >
                      {copied === 'id' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Discord ID:</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-700 px-2 py-1 rounded text-orange-400 font-mono text-sm">
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

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Email:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">{profile.email || 'Not provided'}</span>
                    {profile.email && (
                      <button
                        onClick={() => copyToClipboard(profile.email!, 'email')}
                        className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
                      >
                        {copied === 'email' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Integrations */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Edit className="w-5 h-5 text-orange-400" />
                Platform Integrations
              </h4>
              
              <div className="space-y-4">
                {/* CSGORoll ID */}
                <div className="bg-gray-700/30 rounded-lg p-3">
                  {isEditing.csgoroll ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">CSGORoll ID:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditToggle('csgoroll')}
                            disabled={isUpdating.csgoroll}
                            className="text-gray-400 hover:text-gray-300 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={editValues.csgoroll_id}
                        onChange={(e) => setEditValues(prev => ({ ...prev, csgoroll_id: e.target.value }))}
                        placeholder="Enter CSGORoll ID"
                        className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:bg-gray-600/70 transition-colors"
                        disabled={isUpdating.csgoroll}
                      />
                      {updateError.csgoroll && (
                        <p className="text-red-400 text-sm">{updateError.csgoroll}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateProfileField('csgoroll_id', editValues.csgoroll_id)}
                          disabled={isUpdating.csgoroll}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                        >
                          {isUpdating.csgoroll ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Save
                            </>
                          )}
                        </button>
                        {!currentProfile.csgoroll_id ? (
                          <button
                            onClick={() => handleDelete('csgoroll')}
                            disabled={isUpdating.csgoroll}
                            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded transition-colors duration-200 cursor-pointer"
                          >
                            Cancel
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete('csgoroll')}
                            disabled={isUpdating.csgoroll}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400">CSGORoll ID:</span>
                        <span className="text-gray-300 font-medium">
                          {currentProfile.csgoroll_id || 'Not linked'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {currentProfile.csgoroll_id && (
                          <button
                            onClick={() => copyToClipboard(currentProfile.csgoroll_id!, 'csgoroll_id')}
                            className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
                          >
                            {copied === 'csgoroll_id' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                        <button
                          onClick={() => handleEditToggle('csgoroll')}
                          className="text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                          title="Edit CSGORoll ID"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* MonkeyTilt Username */}
                <div className="bg-gray-700/30 rounded-lg p-3">
                  {isEditing.monkeytilt ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">MonkeyTilt Username:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditToggle('monkeytilt')}
                            disabled={isUpdating.monkeytilt}
                            className="text-gray-400 hover:text-gray-300 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={editValues.monkeytilt_username}
                        onChange={(e) => setEditValues(prev => ({ ...prev, monkeytilt_username: e.target.value }))}
                        placeholder="Enter MonkeyTilt username"
                        className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:bg-gray-600/70 transition-colors"
                        disabled={isUpdating.monkeytilt}
                      />
                      {updateError.monkeytilt && (
                        <p className="text-red-400 text-sm">{updateError.monkeytilt}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateProfileField('monkeytilt_username', editValues.monkeytilt_username)}
                          disabled={isUpdating.monkeytilt}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                        >
                          {isUpdating.monkeytilt ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Save
                            </>
                          )}
                        </button>
                        {!currentProfile.monkeytilt_username ? (
                          <button
                            onClick={() => handleDelete('monkeytilt')}
                            disabled={isUpdating.monkeytilt}
                            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded transition-colors duration-200 cursor-pointer"
                          >
                            Cancel
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete('monkeytilt')}
                            disabled={isUpdating.monkeytilt}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400">MonkeyTilt Username:</span>
                        <span className="text-gray-300 font-medium">
                          {currentProfile.monkeytilt_username || 'Not linked'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {currentProfile.monkeytilt_username && (
                          <button
                            onClick={() => copyToClipboard(currentProfile.monkeytilt_username!, 'monkeytilt_username')}
                            className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
                          >
                            {copied === 'monkeytilt_username' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                        <button
                          onClick={() => handleEditToggle('monkeytilt')}
                          className="text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                          title="Edit MonkeyTilt username"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                <span className="text-gray-400">Created:</span>
                <span className="text-gray-300">{formatDate(profile.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-orange-400" />
                <span className="text-gray-400">Last Updated:</span>
                <span className="text-gray-300">{formatDate(profile.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UserManagement: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await insforge.database
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setError('Failed to load user profiles');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-gray-400 mt-4">Loading user profiles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Error Loading Profiles</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchProfiles}
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
          <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
          <p className="text-gray-400">
            Manage and view all user profiles ({profiles.length} total users)
          </p>
        </div>
        <button
          onClick={fetchProfiles}
          className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          Refresh
        </button>
      </div>

      {/* Users List */}
      {profiles.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Users Found</h3>
          <p className="text-gray-500">No user profiles have been created yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile) => (
            <UserAccordion key={profile.id} profile={profile} onProfileUpdate={fetchProfiles} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
