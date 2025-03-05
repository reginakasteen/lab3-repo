import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import moment from 'moment'
import { Link } from 'react-router-dom';

import useAxios, { baseURL } from '../utils/useAxios'

function DialoguesList() {

    const [messages, setMessages] = useState([]);
    const axios = useAxios();
    const token = localStorage.getItem('authTokens');
    const decoded = jwtDecode(token);
    const user_id = decoded.user_id;

    useEffect(() => {
        try {
            axios.get(baseURL + '/my-messages/' + user_id + '/').then((res) => {
                setMessages(res.data);
            });
        } catch (error) {
            console.log(error);
        }
    }, [])

    return (
      <div className="w-full xl:w-full p-4 h-full bg-emerald-300 shadow rounded-lg">
          {messages.map((message) => (
              <Link
                  to={'/inbox/' + (message.sender === user_id ? message.receiver : message.sender)}
                  className="list-group-item list-group-item-action border-b-2 border-dashed border-gray-400 py-4 px-2 rounded flex items-center justify-between hover:bg-emerald-200"
                  key={message.id}
              >
                  <div className="flex items-center space-x-3">
                      {message.sender.id !== user_id ? (
                          <img
                              src={message.receiver_profile.photo}
                              className="rounded-full w-10 h-10 object-cover"
                              alt="image"
                          />
                      ) : (
                          <img
                              src={message.sender_profile.photo}
                              className="rounded-full w-10 h-10 object-cover"
                              alt="image"
                          />
                      )}
                      <div className="flex-grow ml-3">
                          <div className="font-semibold text-sm">
                              {message.sender === user_id
                                  ? message.receiver_profile.name
                                  : message.sender_profile.name}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center space-x-1">
                              <span className="fas fa-circle text-green-500" />
                              <span>{message.message}</span>
                          </div>
                      </div>
                  </div>
                  <div className="text-xs text-gray-500 flex-shrink-0">
                      <span className="badge bg-success">
                          {moment.utc(message.date).local().startOf('seconds').fromNow()}
                      </span>
                  </div>
              </Link>
          ))}
      </div>
  );
  
}

export default DialoguesList
