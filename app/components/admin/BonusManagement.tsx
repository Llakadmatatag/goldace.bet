import React, { useState, useEffect, useRef } from 'react';
import { Gift, ChevronDown, ChevronUp, Edit, Save, X, Trash2, Plus, Upload, ExternalLink, Copy, Check, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@insforge/sdk';

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!
});

interface BonusItem {
  id: string;
  partner_name: string | null;
  partner_logo: string;
  affiliate_code: string;
  bonus_list: string[];
  registration_link: string;
  category: string;
  created_at: string;
  updated_at: string;
}

interface BonusAccordionProps {
  bonus: BonusItem;
  onUpdate: () => void;
}

const BonusAccordion: React.FC<BonusAccordionProps> = ({ bonus, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<BonusItem>(bonus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string>('');
  const [copied, setCopied] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(""), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUpdateError('Please upload an image file');
      return;
    }

    setIsUploading(true);
    setUpdateError('');

    try {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExtension = file.name.split('.').pop();
      const fileName = `bonus-${timestamp}-${randomString}.${fileExtension}`;

      const { data, error } = await insforge.storage
        .from('partner-logos')
        .upload(fileName, file);

      if (error) throw error;

      if (data) {
        setEditForm(prev => ({ 
          ...prev, 
          partner_logo: data.url 
        }));
      }

      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUpdateError('Failed to upload image. Please try again.');
      setIsUploading(false);
    }
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

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm(bonus);
      setUpdateError('');
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsUpdating(true);
    setUpdateError('');

    try {
      const { data, error } = await insforge.database
        .from('bonus_list')
        .update({
          partner_name: editForm.partner_name,
          partner_logo: editForm.partner_logo,
          affiliate_code: editForm.affiliate_code,
          bonus_list: editForm.bonus_list,
          registration_link: editForm.registration_link,
          category: editForm.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', bonus.id)
        .select()
        .single();

      if (error) throw error;

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating bonus:', error);
      setUpdateError('Failed to update bonus. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this bonus? This action cannot be undone.')) {
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await insforge.database
        .from('bonus_list')
        .delete()
        .eq('id', bonus.id);

      if (error) throw error;

      onUpdate();
    } catch (error) {
      console.error('Error deleting bonus:', error);
      setUpdateError('Failed to delete bonus. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBonusListChange = (index: number, value: string) => {
    const newBonusList = [...editForm.bonus_list];
    newBonusList[index] = value;
    setEditForm(prev => ({ ...prev, bonus_list: newBonusList }));
  };

  const addBonusListItem = () => {
    setEditForm(prev => ({ ...prev, bonus_list: [...prev.bonus_list, ''] }));
  };

  const removeBonusListItem = (index: number) => {
    const newBonusList = editForm.bonus_list.filter((_, i) => i !== index);
    setEditForm(prev => ({ ...prev, bonus_list: newBonusList }));
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
      >
        <div className="flex items-center gap-4">
          {/* Partner Logo */}
          <div className="w-12 h-12 rounded-lg bg-gray-700/50 border border-gray-600/30 p-2 flex items-center justify-center flex-shrink-0">
            <img
              src={editForm.partner_logo}
              alt={editForm.partner_name || 'Partner'}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Basic Info */}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white">
              {editForm.partner_name || 'Unknown Partner'}
            </h3>
            <div className="flex items-center gap-3 text-sm">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                editForm.category === 'Case Opening' 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}>
                {editForm.category}
              </span>
              <span className="text-gray-400">
                Code: {editForm.affiliate_code}
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

      {/* Expanded Content */}
      {isOpen && (
        <div className="border-t border-gray-700/50 p-6">
          {updateError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{updateError}</p>
            </div>
          )}

          {isEditing ? (
            <div className="space-y-6">
              {/* Edit Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Partner Name
                    </label>
                    <input
                      type="text"
                      value={editForm.partner_name || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, partner_name: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:bg-gray-700/70 transition-colors"
                      placeholder="Enter partner name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Partner Logo
                    </label>
                    <div className="space-y-3">
                      {/* File Upload */}
                      <div className="flex items-center gap-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file);
                            }
                          }}
                          className="hidden"
                          disabled={isUploading}
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 disabled:bg-gray-700/50 disabled:cursor-not-allowed border border-gray-600/30 rounded-lg px-4 py-2 text-white transition-colors duration-200 cursor-pointer"
                        >
                          {isUploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              Upload Image
                            </>
                          )}
                        </button>
                      </div>

                      {/* Current Logo Preview */}
                      {editForm.partner_logo && (
                        <div className="flex items-center gap-3">
                          <img
                            src={editForm.partner_logo}
                            alt="Current logo preview"
                            className="w-20 h-20 rounded-lg object-cover border border-gray-600/30"
                          />
                          <button
                            onClick={() => copyToClipboard(editForm.partner_logo, 'partner_logo')}
                            className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
                            title="Copy logo URL"
                          >
                            {copied === 'partner_logo' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      )}

                      {/* Logo URL Display (for reference) */}
                      {editForm.partner_logo && (
                        <div className="text-xs text-gray-400 break-all">
                          URL: {editForm.partner_logo}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Affiliate Code
                    </label>
                    <input
                      type="text"
                      value={editForm.affiliate_code}
                      onChange={(e) => setEditForm(prev => ({ ...prev, affiliate_code: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:bg-gray-700/70 transition-colors"
                      placeholder="Enter affiliate code"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Registration Link
                    </label>
                    <input
                      type="url"
                      value={editForm.registration_link}
                      onChange={(e) => setEditForm(prev => ({ ...prev, registration_link: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:bg-gray-700/70 transition-colors"
                      placeholder="Enter registration link"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:border-orange-500/50 focus:bg-gray-700/70 transition-colors"
                    >
                      <option value="Case Opening">Case Opening</option>
                      <option value="Casino">Casino</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bonus List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Bonus List
                  </label>
                  <button
                    onClick={addBonusListItem}
                    className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {editForm.bonus_list.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleBonusListChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:bg-gray-700/70 transition-colors"
                        placeholder="Enter bonus item"
                      />
                      {editForm.bonus_list.length > 1 && (
                        <button
                          onClick={() => removeBonusListItem(index)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
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
                <button
                  onClick={handleDelete}
                  disabled={isUpdating}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  onClick={handleEditToggle}
                  disabled={isUpdating}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* View Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-400 text-sm">Partner Name:</span>
                    <p className="text-white font-medium">{editForm.partner_name || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Affiliate Code:</span>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">{editForm.affiliate_code}</p>
                      <button
                        onClick={() => copyToClipboard(editForm.affiliate_code, 'affiliate_code')}
                        className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
                      >
                        {copied === 'affiliate_code' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Category:</span>
                    <p className="text-white font-medium">{editForm.category}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-gray-400 text-sm">Registration Link:</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={editForm.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        Visit Site
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => copyToClipboard(editForm.registration_link, 'registration_link')}
                        className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
                      >
                        {copied === 'registration_link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Partner Logo:</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={editForm.partner_logo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        View Logo
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => copyToClipboard(editForm.partner_logo, 'partner_logo')}
                        className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
                      >
                        {copied === 'partner_logo' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bonus List */}
              <div>
                <span className="text-gray-400 text-sm">Available Bonuses:</span>
                <ul className="mt-2 space-y-1">
                  {editForm.bonus_list.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-3 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Timestamps */}
              <div className="pt-4 border-t border-gray-700/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <p className="text-gray-300">{formatDate(editForm.created_at)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Last Updated:</span>
                    <p className="text-gray-300">{formatDate(editForm.updated_at)}</p>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="pt-4 border-t border-gray-700/50">
                <button
                  onClick={handleEditToggle}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Bonus
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const BonusManagement: React.FC = () => {
  const [bonuses, setBonuses] = useState<BonusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBonus, setNewBonus] = useState<Partial<BonusItem>>({
    partner_name: '',
    partner_logo: '',
    affiliate_code: '',
    bonus_list: [''],
    registration_link: '',
    category: 'Case Opening'
  });
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string>('');
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  const [copiedNew, setCopiedNew] = useState<string>('');
  const newFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBonuses();
  }, []);

  const fetchBonuses = async () => {
    try {
      setLoading(true);
      const { data, error } = await insforge.database
        .from('bonus_list')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setBonuses(data || []);
    } catch (error) {
      console.error('Error fetching bonuses:', error);
      setError('Failed to load bonuses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBonus = async () => {
    if (!newBonus.affiliate_code || !newBonus.registration_link || !newBonus.partner_logo) {
      setAddError('Please fill in all required fields and upload an image');
      return;
    }

    setIsAdding(true);
    setAddError('');

    try {
      const { data, error } = await insforge.database
        .from('bonus_list')
        .insert({
          partner_name: newBonus.partner_name || null,
          partner_logo: newBonus.partner_logo,
          affiliate_code: newBonus.affiliate_code,
          bonus_list: newBonus.bonus_list?.filter(item => item.trim()) || [''],
          registration_link: newBonus.registration_link,
          category: newBonus.category || 'Case Opening'
        })
        .select()
        .single();

      if (error) throw error;

      setNewBonus({
        partner_name: '',
        partner_logo: '',
        affiliate_code: '',
        bonus_list: [''],
        registration_link: '',
        category: 'Case Opening'
      });
      setShowAddForm(false);
      fetchBonuses();
    } catch (error) {
      console.error('Error adding bonus:', error);
      setAddError('Failed to add bonus. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleNewBonusListChange = (index: number, value: string) => {
    const newBonusList = [...(newBonus.bonus_list || [''])];
    newBonusList[index] = value;
    setNewBonus(prev => ({ ...prev, bonus_list: newBonusList }));
  };

  const addNewBonusListItem = () => {
    setNewBonus(prev => ({ ...prev, bonus_list: [...(prev.bonus_list || ['']), ''] }));
  };

  const removeNewBonusListItem = (index: number) => {
    const newBonusList = (newBonus.bonus_list || ['']).filter((_, i) => i !== index);
    setNewBonus(prev => ({ ...prev, bonus_list: newBonusList }));
  };

  const handleNewFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAddError('Please upload an image file');
      return;
    }

    setIsUploadingNew(true);
    setAddError('');

    try {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExtension = file.name.split('.').pop();
      const fileName = `bonus-${timestamp}-${randomString}.${fileExtension}`;

      const { data, error } = await insforge.storage
        .from('partner-logos')
        .upload(fileName, file);

      if (error) throw error;

      if (data) {
        setNewBonus(prev => ({ 
          ...prev, 
          partner_logo: data.url 
        }));
      }

      setIsUploadingNew(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setAddError('Failed to upload image. Please try again.');
      setIsUploadingNew(false);
    }
  };

  const copyToClipboardNew = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedNew(field);
      setTimeout(() => setCopiedNew(""), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-gray-400 mt-4">Loading bonuses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Gift className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Error Loading Bonuses</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchBonuses}
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
          <h2 className="text-2xl font-bold text-white mb-2">Bonus Management</h2>
          <p className="text-gray-400">
            Manage partner bonuses and promotions ({bonuses.length} total bonuses)
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchBonuses}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Bonus
          </button>
        </div>
      </div>

      {/* Add New Bonus Form */}
      {showAddForm && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Bonus</h3>
          
          {addError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{addError}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Partner Name
                  </label>
                  <input
                    type="text"
                    value={newBonus.partner_name || ''}
                    onChange={(e) => setNewBonus(prev => ({ ...prev, partner_name: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:bg-gray-700/70 transition-colors"
                    placeholder="Enter partner name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Partner Logo *
                  </label>
                  <div className="space-y-3">
                    {/* File Upload */}
                    <div className="flex items-center gap-3">
                      <input
                        ref={newFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleNewFileUpload(file);
                          }
                        }}
                        className="hidden"
                        disabled={isUploadingNew}
                      />
                      <button
                        onClick={() => newFileInputRef.current?.click()}
                        disabled={isUploadingNew}
                        className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 disabled:bg-gray-700/50 disabled:cursor-not-allowed border border-gray-600/30 rounded-lg px-4 py-2 text-white transition-colors duration-200 cursor-pointer"
                      >
                        {isUploadingNew ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Upload Image
                          </>
                        )}
                      </button>
                    </div>

                    {/* Current Logo Preview */}
                    {newBonus.partner_logo && (
                      <div className="flex items-center gap-3">
                        <img
                          src={newBonus.partner_logo}
                          alt="Logo preview"
                          className="w-20 h-20 rounded-lg object-cover border border-gray-600/30"
                        />
                        <button
                          onClick={() => copyToClipboardNew(newBonus.partner_logo || '', 'new_partner_logo')}
                          className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
                          title="Copy logo URL"
                        >
                          {copiedNew === 'new_partner_logo' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {/* Logo URL Display (for reference) */}
                    {newBonus.partner_logo && (
                      <div className="text-xs text-gray-400 break-all">
                        URL: {newBonus.partner_logo}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Affiliate Code *
                  </label>
                  <input
                    type="text"
                    value={newBonus.affiliate_code || ''}
                    onChange={(e) => setNewBonus(prev => ({ ...prev, affiliate_code: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:bg-gray-700/70 transition-colors"
                    placeholder="Enter affiliate code"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Registration Link *
                  </label>
                  <input
                    type="url"
                    value={newBonus.registration_link || ''}
                    onChange={(e) => setNewBonus(prev => ({ ...prev, registration_link: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:bg-gray-700/70 transition-colors"
                    placeholder="Enter registration link"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newBonus.category || 'Case Opening'}
                    onChange={(e) => setNewBonus(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:border-orange-500/50 focus:bg-gray-700/70 transition-colors"
                  >
                    <option value="Case Opening">Case Opening</option>
                    <option value="Casino">Casino</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bonus List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  Bonus List
                </label>
                <button
                  onClick={addNewBonusListItem}
                  className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
              <div className="space-y-2">
                {(newBonus.bonus_list || ['']).map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleNewBonusListChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:bg-gray-700/70 transition-colors"
                      placeholder="Enter bonus item"
                    />
                    {(newBonus.bonus_list || ['']).length > 1 && (
                      <button
                        onClick={() => removeNewBonusListItem(index)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-700/50">
              <button
                onClick={handleAddBonus}
                disabled={isAdding}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                {isAdding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Bonus
                  </>
                )}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                disabled={isAdding}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bonuses List */}
      {bonuses.length === 0 ? (
        <div className="text-center py-12">
          <Gift className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Bonuses Found</h3>
          <p className="text-gray-500">No bonuses have been added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bonuses.map((bonus) => (
            <BonusAccordion key={bonus.id} bonus={bonus} onUpdate={fetchBonuses} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BonusManagement;
