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
    <div className='h-screen'>
        <main className="content" style={{marginTop:"150px"}}>
          <div className="container p-0">
            <h1 className="h3 mb-3">Messages</h1>
            <div className="card">
              <div className="row g-0">
                <div className="col-12 col-lg-5 col-xl-3 border-right">
                  <div className="px-4 d-none d-md-block">
                    <div className="d-flex align-items-center">
                    <SearchBar searchUser={searchUser} />
                    </div>
                  </div>

                  <div>
                  {results.length === 0 ? (
                        <p>Loading...</p>
                    ) : (
                        results.map((user) => (
                            <Link to={'/inbox/' + user.user + '/'} className="list-group-item list-group-item-action border-0" key={user.user}>
                                <div className="d-flex align-items-start">                                    
                                    <img src={user.photo} className="rounded-circle mr-1" style={{objectFit: "cover"}} alt="image" width={40} height={40}/>
                                    <div className="flex-grow-1 ml-3">
                                        {user.name}
                                        <div className="small">
                                            <span className="fas fa-circle chat-online" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
                  <hr className="d-block d-lg-none mt-1 mb-0" />
                </div>
                <div className="col-12 col-lg-7 col-xl-9">
                  <div className="py-2 px-4 border-bottom d-none d-lg-block">
                    <div className="d-flex align-items-center py-1">
                      <div className="position-relative">
                        <img
                          src="https://bootdey.com/img/Content/avatar/avatar3.png"
                          className="rounded-circle mr-1"
                          alt="Sharon Lessman"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="flex-grow-1 pl-3">
                        <strong>Sharon Lessman</strong>
                        <div className="text-muted small">
                          <em>Online</em>
                        </div>
                      </div>
                      <div>
                        <button className="btn btn-primary btn-lg mr-1 px-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-phone feather-lg"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </button>
                        <button className="btn btn-info btn-lg mr-1 px-3 d-none d-md-inline-block">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-video feather-lg"
                          >
                            <polygon points="23 7 16 12 23 17 23 7" />
                            <rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
                          </svg>
                        </button>
                        <button className="btn btn-light border btn-lg px-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-more-horizontal feather-lg"
                          >
                            <circle cx={12} cy={12} r={1} />
                            <circle cx={19} cy={12} r={1} />
                            <circle cx={5} cy={12} r={1} />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
    </div>
  )
}

export default Search