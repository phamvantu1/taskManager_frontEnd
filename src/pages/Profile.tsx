import React, { useEffect, useState } from 'react';
import '../style/Profile.css';
import { getUserDetails, type UserInfo, updateUserInfo } from '../api/userApi'; // thêm hàm updateUserInfo

interface ProfileProps {
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserDetails();
      setUserInfo(user);
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userInfo) return;

    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSave = async () => {
    if (!userInfo) return;

    try {
      await updateUserInfo(userInfo);
      setIsEditing(false);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Cập nhật thất bại", error);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="content profile-content">
      <div className="profile-card">
        <h2 className="profile-title">Thông tin cá nhân</h2>
        <div className="profile-grid">
          <div className="profile-field">
            <label className="profile-label">Họ và tên</label>
            <input 
              type="text" 
              value={userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : ''} 
              readOnly 
              className="profile-input" 
            />
          </div>
          <div className="profile-field">
            <label className="profile-label">Email</label>
            <input 
              name="email"
              type="email" 
              value={userInfo?.email || ''} 
              onChange={handleChange}
              readOnly={!isEditing}
              className="profile-input" 
            />
          </div>
          <div className="profile-field">
            <label className="profile-label">Số điện thoại</label>
            <input 
              name="phone"
              type="tel" 
              value={userInfo?.phone || ''} 
              onChange={handleChange}
              readOnly={!isEditing}
              className="profile-input" 
            />
          </div>
          <div className="profile-field">
            <label className="profile-label">Phòng ban</label>
            <input 
              type="text" 
              value="Phòng Phát triển phần mềm 2"  // Nếu bind từ backend thì dùng userInfo.department
              readOnly 
              className="profile-input" 
            />
          </div>
          <div className="profile-field">
            <label className="profile-label">Giới tính</label>
            <input 
              name="gender"
              type="text" 
              value={userInfo?.gender || ''} 
              onChange={handleChange}
              readOnly={!isEditing}
              className="profile-input" 
            />
          </div>
          <div className="profile-field">
            <label className="profile-label">Ngày sinh</label>
            <input 
              name="dateOfBirth"
              type="date" 
              value={userInfo?.dateOfBirth?.toString().split('T')[0] || ''} 
              onChange={handleChange}
              readOnly={!isEditing}
              className="profile-input" 
            />
          </div>
        </div>

        <div className="profile-buttons">
          <button className="profile-back-btn" onClick={onBack}>
            Quay lại
          </button>

          {!isEditing ? (
            <button className="profile-update-btn" onClick={() => setIsEditing(true)}>
              Cập nhật
            </button>
          ) : (
            <button className="profile-save-btn" onClick={handleSave}>
              Lưu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
