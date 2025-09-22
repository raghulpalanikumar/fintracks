import React, { useEffect, useState, useRef } from 'react';
import { User, MapPin, Mail, Edit3, Save, X, CalendarDays, Clock } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState({});
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('token'); // ✅ Add this line to get JWT token

  const fetchProfile = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/users/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // ✅ Send token in header
        },
      });
      if (!res.ok) {
        let msg = 'Failed to fetch profile';
        try {
          const errData = await res.json();
          if (errData && (errData.error || errData.message)) msg += `: ${errData.error || errData.message}`;
        } catch {}
        throw new Error(msg + ` (status ${res.status})`);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
        return {
          name: 'John Anderson',
          email: 'john.anderson@financetracker.com',
          occupation: 'Financial Analyst',
          location: 'New York, NY',
          bio: 'Experienced financial analyst specializing in portfolio management and risk assessment.',
          photo: 'https://randomuser.me/api/portraits/men/32.jpg',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-12-20T14:45:00Z',
          socials: []
        };
      } else {
        setError(err.message || 'Could not fetch profile.');
        throw err;
      }
    }
  };

  const [lastSaved, setLastSaved] = useState(null);
  const intervalRef = useRef();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchProfile().then((data) => {
      if (isMounted) {
        setProfile(data);
        setEditProfile(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      if (!editMode) {
        const data = await fetchProfile();
        if (data && data.updatedAt && data.createdAt) {
          setProfile((prev) => ({ ...prev, updatedAt: data.updatedAt, createdAt: data.createdAt }));
        }
      }
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [editMode]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProfile(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Fixed handleSave with token
  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // ✅ Send token in header
        },
        body: JSON.stringify(editProfile),
      });
      if (!res.ok) {
        let msg = 'Failed to update profile';
        try {
          const errData = await res.json();
          if (errData && (errData.error || errData.message)) msg += `: ${errData.error || errData.message}`;
        } catch {}
        throw new Error(msg + ` (status ${res.status})`);
      }
      const updated = await res.json();
      setProfile(updated);
      setEditProfile(updated);
      setEditMode(false);
      setLastSaved(updated.updatedAt);
    } catch (err) {
      setError(err.message || 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  const getProfileCompletion = (profileObj) => {
    if (!profileObj) return 0;
    const fields = ['name', 'email', 'occupation', 'location', 'bio', 'photo'];
    const filled = fields.filter(f => profileObj[f] && profileObj[f].trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d)) return '-';
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return `${Math.floor(diff)} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return d.toLocaleString();
  };

  const [, setNow] = useState(Date.now());
  useEffect(() => {
    if (!profile) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [profile]);

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ border: '5px solid #eee', borderTop: '5px solid #3b82f6', borderRadius: '50%', width: 60, height: 60, animation: 'spin 1s linear infinite' }} />
    </div>
  );

  const errorBanner = error ? (
    <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 20px', borderRadius: 8, marginBottom: 18, fontWeight: 500, textAlign: 'center', boxShadow: '0 2px 8px #fca5a533' }}>
      {error}
    </div>
  ) : null;

  return (
    <div style={{ background: '#fff', borderRadius: '1.25rem', padding: '3.5rem 2.5rem', width: '100%', maxWidth: 1200, minHeight: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', margin: '48px auto' }}>
      {errorBanner}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
        <div style={{ position: 'relative' }}>
          <img src={profile.photo} alt="Profile" style={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', border: '4px solid #e0eafc', boxShadow: '0 4px 16px #e0eafc' }} />
          {!editMode && (
            <button onClick={() => setEditMode(true)} style={{ position: 'absolute', bottom: 0, right: 0, background: '#2563eb', color: 'white', padding: 8, borderRadius: '50%', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px #2563eb33' }}>
              <Edit3 size={16} />
            </button>
          )}
        </div>
        <div style={{ flex: 1 }}>
          {editMode ? (
            <div>
              {['name', 'email', 'occupation', 'location', 'bio'].map((field, idx) => (
                <div key={idx} style={{ marginBottom: 12 }}>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  {field === 'bio' ? (
                    <textarea name={field} value={editProfile[field]} onChange={handleEditChange} style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 6, fontSize: 14 }} />
                  ) : (
                    <input type="text" name={field} value={editProfile[field]} onChange={handleEditChange} style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 6, fontSize: 14 }} />
                  )}
                </div>
              ))}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditProfile(prev => ({ ...prev, photo: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 6, fontSize: 14 }}
                />
                {editProfile.photo && (
                  <img src={editProfile.photo} alt="Preview" style={{ marginTop: 8, width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee' }} />
                )}
              </div>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: 26, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}><User size={18} /> {profile.name}</h2>
              <div style={{ color: '#555', fontSize: 15, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} /> {profile.location}</div>
              <div style={{ color: '#555', fontSize: 15, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} /> {profile.email}</div>
              <div style={{ color: '#555', fontSize: 15, marginBottom: 2 }}>{profile.occupation}</div>
              <div style={{ background: '#f3f4f6', padding: 12, borderRadius: 8, marginTop: 8, fontSize: 14 }}>{profile.bio}</div>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4f46e5', fontWeight: 500, fontSize: 14 }}><CalendarDays size={15} /> {formatDate(profile.createdAt)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#065f46', fontWeight: 500, fontSize: 14 }}><Clock size={15} /> {currentTime.toLocaleString()}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0284c7', fontWeight: 500, fontSize: 14 }}>Completion: {getProfileCompletion(profile)}%</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 12 }}>
        <div style={{ color: '#888', fontSize: 13 }}>Last updated: {formatDate(profile.updatedAt)}</div>
        {editMode && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleSave} disabled={saving} style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1.1rem', borderRadius: 6, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer', fontSize: 15 }}>
              <Save size={15} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditMode(false); setEditProfile(profile); }} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.5rem 1.1rem', borderRadius: 6, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer', fontSize: 15 }}>
              <X size={15} /> Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import Footer from './Footer';

const ProfileWithFooter = (props) => (
  <>
    <Profile {...props} />
    <Footer />
  </>
);

export default ProfileWithFooter;
