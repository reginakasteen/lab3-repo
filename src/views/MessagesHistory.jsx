import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import moment from 'moment'
import { Link, useParams } from 'react-router-dom';

import useAxios, {baseURL} from '../utils/useAxios'
import SearchBar from './SearchBar';
import DialoguesList from './DialoguesList';
import useSearch from '../utils/useSearch';


function MessagesHistory() {

    const [history, setHistory] = useState([]);
    const [interlocutor, setInterlocutor] = useState({});
    let [newMessage, setNewMessage] = useState({message: '',});

    const id = useParams();
    const axios = useAxios();
    const { searchUser } = useSearch();

    const token = localStorage.getItem('authTokens');
    const decoded = jwtDecode(token);
    const user_id = decoded.user_id;

    useEffect(() => {
        let interval = setInterval(() => {
        try {
            axios.get(baseURL + '/get-messages/' + user_id + '/' + id.id + '/').then((res) => {
                setHistory(res.data);
              });
        } catch (error) {
            console.log(error);
        }
        }, 1000);
        return () => {
          clearInterval(interval);
        }
    }, []);

    useEffect(() => {
      axios.get(baseURL + `/profile/${id.id}/`)
          .then((res) => {
              setInterlocutor(res.data);                
          })
          .catch((error) => {
              console.log("Error fetching interlocutor profile:", error);
          });
          console.log(interlocutor);
          
  }, []);
  

    const handleMessageChange = (event) => {
      setNewMessage({
        ...newMessage,
        [event.target.name]: event.target.value,

      })
    }
    const sendMessage = () => {
      const formData = new FormData();
      formData.append('user', user_id);
      formData.append('sender', user_id);
      formData.append('receiver', id.id);
      formData.append('message', newMessage.message);
      formData.append('is_read', false);

      try {
        axios.post(baseURL + '/send-message/', formData).then((res) => {
          document.getElementById('message-input').value = '';
          setNewMessage(newMessage = ' ');
        });
      } catch (error) {  
        console.log(error);
      }
    }


    return (
          <div className="container p-0 ">
              <div className="row g-0 flex">
                <div className="col-12 sm:col-2 sm:w-1/4 lg:w-1/3 xl:w-1/3 p-4 flex flex-col h-screen">
                  <div className="space-y-4">
                    <div className="hidden lg:block">
                      <SearchBar searchUser={searchUser} />
                    </div>
                    <div className="hidden lg:block">
                      <DialoguesList className="hidden lg:block"/>
                    </div>
                  </div>
                </div>
    
                <div className="col-12 sm:w-full lg:w-full p-4 sm:p-2">
                  <div className="col-12 xl:w-full xl:px-6">
                    <div className=" border-b-2 border-dashed border-gray-400 py-2 px-4">
                    <div className="flex items-center py-1">
                      <div className="relative">
                        <img
                          src={interlocutor.photo || '127.0.0.1:8000/media/default_image.jpg'}
                          className="rounded-full mr-1"
                          alt="User"
                          width={40}
                          height={40}
                        />
                        {interlocutor.is_online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="pl-3 flex-grow">
                        <Link to={`/user/${id.id}/`}>{interlocutor?.name || "Unknown"}</Link>
                        <div className="text-sm text-muted">
                          <em>{interlocutor.is_online ? "Online" : "Offline"}</em>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2"></div>
                    </div>

                    </div>
                    <div className="p-4 space-y-4">
                      {history.length === 0 ? (
                        <h1 className="text-center text-gray-500 text-xl py-5">No messages yet</h1>
                      ) : (
                        history.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${
                              message.sender === user_id ? "justify-end" : "justify-start"
                            }`}
                          >
                            {message.sender !== user_id && (
                              <img
                                src={message.sender_profile.photo}
                                className="rounded-full w-8 h-8 mr-2"
                                alt="Sender"
                              />
                            )}
                            <div
                              className={`p-3 rounded-lg max-w-xs ${
                                message.sender === user_id ? "bg-violet-400 text-white" : "bg-gray-200"
                              }`}
                            >
                              <div className="font-semibold">
                                {message.sender === user_id ? "You" : message.sender_profile.name}
                              </div>
                              {message.message}
                              <div className="text-xs text-gray-500 text-right mt-1">
                                {moment.utc(message.date).local().fromNow()}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>


                    <div className="py-3 px-4 border-t-2 border-dashed border-gray-400 flex items-center">
                      <input
                        id="message-input"
                        type="text"
                        className="w-full p-2 rounded-lg sm:w-3/4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message"
                        name="message"
                        value={newMessage.message}
                        onChange={handleMessageChange}
                      />
                      <button
                        onClick={sendMessage}
                        className="bg-violet-700 ml-2 lg:w-1/4 md:w-1/4 sm:w-1/4 text-white p-2 rounded hover:bg-violet-600"
                      >
                        Send
                      </button>
                    </div>
                  </div>

                </div>
            </div>
          </div>
    );
    
}

export default MessagesHistory