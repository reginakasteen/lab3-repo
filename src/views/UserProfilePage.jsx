import React, {useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import useAxios, {baseURL} from '../utils/useAxios'



function UserProfilePage() {

  const axios = useAxios();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const id = useParams();
  const token = localStorage.getItem('authTokens');
  const decoded = jwtDecode(token);
  const user_id = decoded.user_id;


  useEffect(() => {

      
    const fetchUserData = async () => {
      try {
        const response = await axios.get(baseURL + '/profile/' + id.id + '/');
        setUserData(response.data);    
        console.log(response.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();

  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-emerald-500 to-violet-500 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Profile</h2>
          <div>
            <div className="mb-4 p-2 flex relative">
                <div className='relative justify-center m-auto'>
                  <img
                    src={userData.photo}
                    alt="Profile"
                    className="w-24 h-24 mx-auto relative border border-violet-700 object-cover rounded-full mt-2"
                  />
                  {userData.is_online && (
                    <div className="absolute bottom-0 w-5 right-0 h-5 bg-green-500 rounded-full border-5 border-white"></div>
                  )}  
                  <strong>{userData.bio}</strong>
                </div>
              </div>
                  
            
              <p className='p-2'><strong>Name:</strong> {userData.name}</p>
              <p className='p-2'><strong>Status:</strong> {userData.is_online ? "Online" : "Offline"}</p>
              <p className='p-2'><strong>Gender:</strong> {userData.gender}</p>
              <p className='p-2'><strong>Date of Birth:</strong> {userData.date_of_birth}</p>
            
            <button
              onClick={() => navigate(`/inbox/${userData.id}`)}
              className="w-full my-2 py-3 bg-violet-600 text-white font-semibold rounded-md hover:bg-violet-700 transition duration-200"
            >
              Write a message
            </button>
          </div>
      </div>
    </div>
);
}

export default UserProfilePage