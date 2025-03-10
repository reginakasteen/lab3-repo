import { useState, useEffect } from 'react';
import useAxios, { baseURL } from '../utils/useAxios';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const axios = useAxios();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(baseURL + '/profile/');
        setUserData(response.data);
        setFormData(response.data);
        setCurrentPhoto(response.data.photo);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('date_of_birth', formData.date_of_birth);

    if (photoFile) {
      formDataToSend.append('photo', photoFile);
    }

    try {
      const response = await axios.put(baseURL + '/profile/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUserData(response.data);
      setFormData(response.data);
      setCurrentPhoto(response.data.photo);
      setEditing(false);
    } catch (error) {
      console.error('Profile updating error:', error.response ? error.response.data : error.message);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-emerald-500 to-violet-500 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Profile</h2>


        {editing ? (
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">

            <div className='flex flex-col'>
              <label className="block text-gray-700">Photo:</label>
              <input
                type="file"
                name="photo"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {currentPhoto && !photoFile && (
                <div className="mt-2">
                  <p className="text-gray-700">Current photo:</p>
                  <img
                    src={`https://chat-back-production-1153.up.railway.app/${currentPhoto}`}
                    alt="Current Profile"
                    className="w-24 h-24 object-cover rounded-full"
                  />
                </div>
              )}
            </div>


            <div>
              <label className="block text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700">Gender:</label>
              <select
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>


            <div>
              <label className="block text-gray-700">Bio:</label>
              <input
                type="text"
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700">Date of Birth:</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>


            <button
              type="submit"
              className="w-full py-2 bg-violet-700 text-white font-semibold rounded-md hover:bg-violet-800 transition duration-200"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div>
            <p className="mb-4 p-2 flex">
              <img
                src={`https://chat-back-production-1153.up.railway.app/${userData.photo}` || '../media/default_image.jpg'}
                alt="Profile"
                className="w-24 h-24 mx-auto border border-violet-700 object-cover rounded-full mt-2"
              />
            </p>
            <p className='p-2'><strong>Name:</strong> {userData.name}</p>
            <p className='p-2'><strong>Gender:</strong> {userData.gender}</p>
            <p className='p-2'><strong>Bio:</strong> {userData.bio}</p>
            <p className='p-2'><strong>Date of Birth:</strong> {userData.date_of_birth}</p>
            
            <button
              onClick={() => setEditing(true)}
              className="w-full my-2 py-3 bg-violet-600 text-white font-semibold rounded-md hover:bg-violet-700 transition duration-200"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
);

  
}
export default Profile