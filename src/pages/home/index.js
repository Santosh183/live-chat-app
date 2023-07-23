import React, { useState } from 'react';
import UserSearch from './components/UserSearch';
import ChatArea from './components/ChatArea';
import UserList from './components/UserList';
import { useSelector } from 'react-redux'

function Home() {
    const [searchKey, setSearchKey] = useState('');
    const { currentChat } = useSelector(state => state.userReducer);
    return (
        <div className='flex gap-5'>
            <div className='w-96'>
                <UserSearch
                    searchKey={searchKey}
                    setSearchKey={setSearchKey}
                />
                <UserList
                    searchKey={searchKey}
                />
            </div>
            {currentChat && <div className='w-full'>
                <ChatArea />
            </div>}
        </div>
    )
}

export default Home