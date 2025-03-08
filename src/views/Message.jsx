import React, { useEffect, useState } from 'react'

import DialoguesList from './DialoguesList';
import SearchBar from './SearchBar';
import useSearch from '../utils/useSearch';


function Message() {

    const { searchUser } = useSearch();
  
    return (
          <div className=" h-screen bg-gradient-to-r from-emerald-100 to-violet-100">
              <div className="h-screen rounded bg-white   col-12 sm:col-2  sm:w-3/4 lg:w-1/3 xl:w-1/3">
                <div className="px-4 py-4 ">
                    <div className="flex items-center">
                      <SearchBar searchUser={searchUser} />
                    </div>
    
                  <div className="px-4 py-4">
                    <DialoguesList />
                  </div>
    
              </div>
            </div>
          </div>
    );
    
    
}

export default Message