import React, { useState, useEffect } from 'react';
import useAxios, { baseURL } from '../utils/useAxios';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const axios = useAxios();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(baseURL + '/profile/');
        setUserData(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Fetching profile error:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name || '');
    formDataToSend.append('gender', formData.gender || '');
    formDataToSend.append('bio', formData.bio || '');
    formDataToSend.append('date_of_birth', formData.date_of_birth || '');

    if (photoFile) {
      formDataToSend.append('photo', photoFile);
    }

    try {
      const response = await axios.put(baseURL + '/profile/', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUserData(response.data);
      setFormData(response.data);
      setEditing(false);
      setPhotoFile(null);
    } catch (error) {
      console.error('Profile updating error:', error.response?.data || error.message);
    }
  };

  const getPhotoUrl = (photo) => {
    if (!photo) return `${baseURL}/static/default_image.jpg`;
    if (photo.startsWith('http') || photo.startsWith('https')) {
      return photo;
    }
    return `${baseURL}/static/${photo}`;
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-emerald-500 to-violet-500 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Profile</h2>

        {editing ? (
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
            {['name', 'gender', 'bio', 'date_of_birth'].map((field) => {
              const labelText = field.replace(/_/g, ' ') + ':';
              const inputId = field;

              return (
                <div key={field}>
                  <label htmlFor={inputId} className="block text-gray-700 capitalize">
                    {labelText}
                  </label>

                  {field === 'gender' ? (
                    <select
                      id={inputId}
                      name="gender"
                      value={formData.gender || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <input
                      id={inputId}
                      type={field === 'date_of_birth' ? 'date' : 'text'}
                      name={field}
                      value={formData[field] || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  )}
                </div>
              );
            })}

            <div>
              <label htmlFor="photo" className="block text-gray-700">
                Photo:
              </label>
              <input
                id="photo"
                type="file"
                name="photo"
                data-testid="photo-input"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-violet-700 text-white rounded-md"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div>
            <div className="flex justify-center mb-4">
              <img
                src={getPhotoUrl(userData.photo)}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Gender:</strong> {userData.gender}</p>
            <p><strong>Bio:</strong> {userData.bio}</p>
            <p><strong>Date of Birth:</strong> {userData.date_of_birth}</p>
            <button
              onClick={() => setEditing(true)}
              className="w-full mt-4 py-2 bg-violet-600 text-white rounded-md"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
