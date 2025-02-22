import React, { useEffect, useState } from 'react'
import useAxios from '../utils/useAxios'
import { jwtDecode } from 'jwt-decode';


function Dashboard() {

  const {res, setRes} = useState("");
  const api = useAxios();
  const token = localStorage.getItem("authTokens");

  if (token) {
    const decoded = jwtDecode(token);
    let user_id = decoded.user_id;
    let username = decoded.username;
    let name = decoded.name;
    let image = decoded.image;
    let bio = decoded.bio;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {

      } catch {
        
      }
    }
  })
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard