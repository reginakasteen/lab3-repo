import React from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import useSearch from '../utils/useSearch';


function Search() {

  const { username } = useParams();
  const { results, loading } = useSearch(username);
  const navigate = useNavigate();
  const { searchUser } = useSearch();


  return (



            <div className=" h-screen bg-gradient-to-r from-emerald-100 to-violet-100">
              <div className="h-screen rounded bg-white   col-12 sm:col-2  sm:w-3/4 lg:w-1/3 xl:w-1/3">
                <div className="px-4 py-4 ">
                    <div className="flex items-center">
                      <SearchBar searchUser={searchUser} />
                    </div>
    
                  <div className="px-4 py-4">
                      <div className="w-full xl:w-full p-4 h-full bg-emerald-300 shadow rounded-lg">
                      {results.length === 0 ? (
                            <p>Loading...</p>
                        ) : (
                            results.map((user) => (

                                <Link to={'/inbox/' + user.user + '/'} className="list-group-item list-group-item-action border-b-2 border-dashed border-gray-400 py-4 px-2 rounded flex items-center justify-between hover:bg-emerald-200"
                                key={user.user}>
                                    <div className="d-flex align-items-start">    
                                    <div className="flex items-center space-x-3">
                                        <img src={'https://chat-back-production-1153.up.railway.app/static/default_image.jpg' || user.photo} className="rounded-full w-10 h-10 object-cover" style={{objectFit: "cover"}} alt="image" width={40} height={40}/>
                                        <div className="font-semibold text-sm">
                                          {user.name}
                                        </div>
                                      </div>                                
                                        
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                  </div>
    
              </div>
            </div>
          </div>

  )
}

export default Search