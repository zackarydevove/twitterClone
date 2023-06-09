import React from 'react'
import { RxCross1 } from 'react-icons/rx';
import { useState, useEffect } from 'react';
import SearchUserToDm from './SearchUserToDm';
import { getFollowedUsers } from '../../api/follow';

function AddDM({
    openSearch, 
    setOpenSearch, 
    onCreateChat, 
    user,
}) {
    const [followedUsers, setFollowedUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState([]); // Change to array for groups chat
    
    useEffect(() => {
        if (user._id) {
          getFollowedUsers(user._id)
            .then((users) => {
              setFollowedUsers(users);
              setFilteredUsers(users);
              setIsLoading(false);
            })
            .catch((err) => console.log('Error fetching followed users', err));
        }
      }, []);

     const handleSearch = e => {
        const trimmedQuery = e.target.value.trim().toLowerCase();
        if (trimmedQuery) {
          const filtered = followedUsers.filter(user =>
            user.username.toLowerCase().includes(trimmedQuery)
          );
          setFilteredUsers(filtered);
        } else {
          setFilteredUsers(followedUsers);
        }
    };

    const handleSelectUser = (user) => {
        // If user is already selected, remove them from the array
        if (selectedUser.some((selected) => selected._id === user._id)) {
          setSelectedUser((prevSelected) =>
            prevSelected.filter((selected) => selected._id !== user._id)
          );
        } else {
          // User is not selected, add them to the array
          setSelectedUser((prevSelected) => [...prevSelected, user]);
        }
      };

    const handleDeleteSelectedUser = (deletedUser) => {
        setSelectedUser((prevSelected) =>
            prevSelected.filter((selected) => selected._id !== deletedUser._id)
        );
    };

      
    if (isLoading) {
        return <div>Loading...</div>;
      }

    return (
        <div className='z-40 fixed left-0 top-0 md:w-screen md:h-screen bg-blue-300 bg-opacity-20'>
            <div className='w-screen h-screen md:w-[600px] md:h-[650px] md:fixed md:left-[50%] md:translate-x-[-50%] md:top-16 z-30 bg-black opacity- md:rounded-2xl'>
                <div className='md:w-full md:h-full p-3 z-40' >
                    {/* Up */}
                    <div className='flex pl-1'>
                        <div className='flex flex-grow items-center'>
                            <RxCross1 size={'1.3em'} className='text-white hover:cursor-pointer'
                                onClick={() => setOpenSearch(false)}/>
                            <p className='pl-5 text-xl'>New message</p>
                        </div>
                        <button className={`w-[85px] text-center p-2 rounded-3xl  ${selectedUser.length > 0 ? 'bg-blue-500' : 'bg-gray-500'} `} 
                        onClick={() => {
                            if (selectedUser.length > 0) {
                              onCreateChat(selectedUser);
                              setOpenSearch(false);
                            }
                        }}>Next</button>
                    </div>
                    {/* Mid: Search users to Dm */}
                    <div>
                        {/* SearchBar */}
                        <div className='mt-3'>
                            <SearchUserToDm handleSearch={handleSearch}/>
                        </div>
                    </div>
                    <div className='p-1 flex'>
                        {
                            selectedUser ?
                                selectedUser.map((user) => (
                                    <div className=' w-fit p-[0.15rem] flex items-center border border-[#2f3336] rounded-[20px] '>
                                        <div className='h-6 w-6 bg-pp bg-cover rounded-full'/>
                                        <p className='pl-2 pr-2'>{user.username}</p>
                                        <RxCross1 className='text-blue-500 hover:cursor-pointer'
                                            onClick={() =>  handleDeleteSelectedUser(user)}/>
                                    </div>
                                ))
                            : null
                        }
                        
                    </div>
                    {/* Bottom: Followed Users */}
                    <div className='flex-col overflow-y-scroll scrollbar-hide'>
                        {
                            filteredUsers.map((followedUser) => {
                                return (
                                    <div className='flex mt-3 p-3 hover:bg-gray-500 hover:bg-opacity-20 hover:cursor-pointer'
                                    key={followedUser._id}
                                    onClick={() => handleSelectUser(followedUser)}>
                                        <div className='w-12 h-12 bg-pp bg-cover rounded-full'/>
                                        <div className='px-3'>
                                            <p>{followedUser.twittername}</p>
                                            <p className='text-gray-500'>@{followedUser.username}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
      )
}

export default AddDM
