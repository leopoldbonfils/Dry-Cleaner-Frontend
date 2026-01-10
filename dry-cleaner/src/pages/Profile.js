import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { authAPI } from '../components/services/api';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  // Profile form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: ''
  });

  // Password change form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      const storedImage = localStorage.getItem('profileImage');
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setFormData({
          fullName: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          businessName: userData.businessName || ''
        });
      
      }

      if (storedImage) {
        setProfileImage(storedImage);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Read and convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        localStorage.setItem('profileImage', base64String);
        toast.success('Profile image updated! ✅');
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleEditImage = () => {
    fileInputRef.current?.click();
  };

  // Remove profile image
  const handleRemoveImage = () => {
    setProfileImage(null);
    localStorage.removeItem('profileImage');
    toast.info('Profile image removed');
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^07[2-9]\d{7}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Invalid phone format (e.g., 078XXXXXXX)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) {
      toast.warning('Please fix the errors in the form');
      return;
    }

    setSaving(true);
    try {
      const response = await authAPI.updateProfile({
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        businessName: formData.businessName
      });
      
      // Update local storage
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success('Profile updated successfully! ✅');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      toast.warning('Please fix the errors in the form');
      return;
    }

    setSaving(true);
    try {
      await authAPI.changePassword({
        email: user.email,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      toast.success('Password changed successfully! 🔒');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setChangingPassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // ✅ FIXED: Added null check
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        businessName: user.businessName || ''
      });
    }
    setErrors({});
    setEditing(false);
  };

  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    setChangingPassword(false);
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }


  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-left">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-large">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="avatar-image" />
              ) : (
                <span className="avatar-initial">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="avatar-edit-controls">
              <button className="avatar-edit-btn" onClick={handleEditImage} title="Change photo">
                📷
              </button>
              {profileImage && (
                <button className="avatar-remove-btn" onClick={handleRemoveImage} title="Remove photo">
                  🗑️
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{user?.fullName || 'User'}</h1>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>
        
      </div>

      {/* Profile Information Card */}
      <Card title="Profile Information" icon="👤" className="profile-card">
        <div className="profile-form">
          <div className="form-row">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={!editing}
              error={errors.fullName}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!editing}
              error={errors.email}
              required
            />
          </div>

          <div className="form-row">
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="078XXXXXXX"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!editing}
              error={errors.phone}
            />
            <Input
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              disabled={!editing}
              placeholder="Your business name"
            />
          </div>

          <div className="profile-actions">
            {!editing ? (
              <Button
                variant="primary"
                icon="✏️"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="success"
                  icon="✅"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="secondary"
                  icon="✖"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Security Card */}
      <Card title="Security" icon="🔒" className="profile-card">
        {!changingPassword ? (
          <div className="security-info">
            <p className="security-description">
              Keep your account secure by using a strong password.
            </p>
            <Button
              variant="primary"
              icon="🔑"
              onClick={() => setChangingPassword(true)}
            >
              Change Password
            </Button>
          </div>
        ) : (
          <div className="password-form">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              error={errors.currentPassword}
              required
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              error={errors.newPassword}
              placeholder="At least 6 characters"
              required
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              error={errors.confirmPassword}
              required
            />

            <div className="profile-actions">
              <Button
                variant="success"
                icon="✅"
                onClick={handleChangePassword}
                disabled={saving}
              >
                {saving ? 'Changing...' : 'Change Password'}
              </Button>
              <Button
                variant="secondary"
                icon="✖"
                onClick={handleCancelPasswordChange}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Account Stats Card */}
      <Card title="Account Information" icon="📊" className="profile-card">
        <div className="account-stats">
          <div className="stat-item">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <div className="stat-label">Member Since</div>
              <div className="stat-value">
                {user?.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'N/A'}
              </div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-label">Account Status</div>
              <div className="stat-value">
                {user?.isVerified ? 'Verified ✓' : 'Not Verified'}
              </div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🆔</div>
            <div className="stat-info">
              <div className="stat-label">User ID</div>
              <div className="stat-value">#{user?.userId || user?.id || 'N/A'}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;