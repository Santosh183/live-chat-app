import React, { useState } from 'react'

function UserSearch({ searchKey, setSearchKey }) {
    return (
        <div className='relative mt-5'>
            <i className="ri-search-line absolute top-3 left-4 text-gray-300"></i>
            <input
                placeholder='Search Users / Chats'
                className='rounded-2xl w-full border-gray-300 pl-10 text-gray-500'
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
            />
        </div>
    )
}

export default UserSearch