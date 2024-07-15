import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { MagnifyingGlassIcon, PencilIcon, UserIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { HelperContext } from '@/helpers/HelperContext';

export default function UserTable() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [displayCount, setDisplayCount] = useState(5);
    const [currentPage, setPage] = useState(0);
    const [currentSort, setCurrentSort] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { focusedUser, setFocusedUser, setEditMode, editMode } = useContext(HelperContext)
    useEffect(() => {
        axios.get('https://dummyjson.com/users')
            .then(response => {
                console.log(response.data.users)
                setUsers(response.data.users);
                setFilteredUsers(response.data.users);
                setTotalPages(Math.ceil(response.data.users.length / displayCount));
            })
            .catch(error => {
                console.error('API çağrısı hatası:', error);
            });
    }, []);
    useEffect(() => {
        if (!editMode && focusedUser) {
            setUsers(prevUsers => {
                const updatedUsers = [...prevUsers];
                const index = updatedUsers.findIndex(x => x.id === focusedUser.id);
                if (index !== -1) {
                    updatedUsers[index] = focusedUser;
                }
                return updatedUsers;
            });
            setFilteredUsers(prevFilteredUsers => {
                const updatedFilteredUsers = [...prevFilteredUsers];
                const index = updatedFilteredUsers.findIndex(x => x.id === focusedUser.id);
                if (index !== -1) {
                    updatedFilteredUsers[index] = focusedUser;
                }
                return updatedFilteredUsers;
            });
        }
    }, [editMode])

    const handleDisplayCountChange = (event) => {
        const newDisplayCount = parseInt(event.target.value);
        setDisplayCount(newDisplayCount);
        setTotalPages(Math.ceil(filteredUsers.length / newDisplayCount));
        setPage(0);
    };

    const sortBy = (field, listUser) => {
        let sortedUsers = listUser ? [...listUser] : [...filteredUsers];
        const sortDirection = Math.sign(currentSort) === -1 || Math.abs(currentSort) !== field ? 1 : -1;
        sortedUsers = sortedUsers.sort((a, b) => {
            const aField = field === 1 ? a.firstName + " " + a.lastName : field === 2 ? a.phone : a.email;
            const bField = field === 1 ? b.firstName + " " + b.lastName : field === 2 ? b.phone : b.email;
            return sortDirection * aField.localeCompare(bField);
        });
        setUsers(prev => prev.sort((a, b) => {
            const aField = field === 1 ? a.firstName + " " + a.lastName : field === 2 ? a.phone : a.email;
            const bField = field === 1 ? b.firstName + " " + b.lastName : field === 2 ? b.phone : b.email;
            return sortDirection * aField.localeCompare(bField);
        }))
        setFilteredUsers(sortedUsers);
        setCurrentSort(sortDirection * field);
    };
    const searchFilter = (field, filter) => {
        const tempUsers = users.filter(user => {
            const fieldValue = field === 1
                ? (user.firstName + " " + user.lastName).toLowerCase()
                : field === 2
                    ? user.phone.toLowerCase()
                    : user.email.toLowerCase();
            return fieldValue.includes(filter.toLowerCase());
        });
        setFilteredUsers(tempUsers)
        setTotalPages(Math.ceil(tempUsers.length / displayCount))
    };
    return (
        <>
            <div className={`${editMode && "hidden"} overflow-x-auto`}>
                <h4 className="flex items-center text-2xl font-bold mb-5">
                    <UserIcon className="size-6 mr-2" />
                    User List
                </h4>
                <div className="">
                    <table className="w-full min-w-[1050px] border border-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className={`border border-gray-300 px-6 py-3 text-md font-medium ${currentSort === 1 || currentSort === -1 ? "text-gray-800" : "text-gray-500"} hover:text-gray-900 uppercase tracking-wider`}>
                                    <button onClick={() => sortBy(1)}>
                                        User
                                    </button>
                                </th>
                                <th className={`border border-gray-300 px-6 py-3 text-md font-medium ${currentSort === 2 || currentSort === -2 ? "text-gray-800" : "text-gray-500"} hover:text-gray-900 uppercase tracking-wider`}>
                                    <button onClick={() => sortBy(2)}>
                                        Phone
                                    </button>
                                </th>
                                <th className={`border border-gray-300 px-6 py-3 text-md font-medium ${currentSort === 3 || currentSort === -3 ? "text-gray-800" : "text-gray-500"} hover:text-gray-900 uppercase tracking-wider`}>
                                    <button onClick={() => sortBy(3)}>
                                        Email
                                    </button>
                                </th>
                                <th className="border border-gray-300 px-6 py-3 text-md font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                            <tr>
                                <th className="border border-gray-300 relative">
                                    <MagnifyingGlassIcon className='absolute h-[calc(100%-4px)] top-[2px] right-0 text-gray-500'></MagnifyingGlassIcon>
                                    <input onChange={(x) => { searchFilter(1, x.target.value) }} className="w-full text-gray-500" type="text" />
                                </th>
                                <th className="border border-gray-300 relative">
                                    <MagnifyingGlassIcon className='absolute h-[calc(100%-4px)] top-[2px] right-0 text-gray-500'></MagnifyingGlassIcon>
                                    <input onChange={(x) => { searchFilter(2, x.target.value) }} className="w-full text-gray-500" type="text" />
                                </th>
                                <th className="border border-gray-300 relative">
                                    <MagnifyingGlassIcon className='absolute h-[calc(100%-4px)] top-[2px] right-0 text-gray-500'></MagnifyingGlassIcon>
                                    <input onChange={(x) => { searchFilter(3, x.target.value) }} className="w-full text-gray-500" type="text" />
                                </th>
                                <th className="border border-gray-300"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.slice(currentPage * displayCount, (currentPage + 1) * displayCount).map(user => (
                                <tr key={user.id} onClick={() => setFocusedUser(user)} className={` ${focusedUser && focusedUser.id === user.id && "bg-gray-200"} hover:bg-gray-200`}>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap relative">
                                        <img src={user.image} alt="" className='size-10 absolute left-0 -translate-y-1/2 top-1/2' />
                                        <p className='mx-5'>{user.firstName + " " + user.lastName}</p>
                                    </td>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-center">
                                        {user.phone}
                                    </td>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-center">
                                        {user.email}
                                    </td>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-center">
                                        <button onClick={() => {
                                            setEditMode(true)
                                            setFocusedUser(user)
                                        }} className="text-blue-600 hover:text-blue-800"><PencilIcon className='size-5'></PencilIcon></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between mt-4 min-w-[1050px]">
                        <div className='flex gap-1' id="displayCount">
                            <button className={`size-8 rounded hover:bg-gray-300 ${displayCount === 5 && "bg-gray-300 hover:bg-gray-500"} flex items-center justify-center text-center`} onClick={handleDisplayCountChange} value={5}>5</button>
                            <button className={`size-8 rounded hover:bg-gray-300 ${displayCount === 10 && "bg-gray-300"} flex items-center justify-center text-center`} onClick={handleDisplayCountChange} value={10}>10</button>
                            <button className={`size-8 rounded hover:bg-gray-300 ${displayCount === 20 && "bg-gray-300"} flex items-center justify-center text-center`} onClick={handleDisplayCountChange} value={20}>20</button>
                            <button className={`size-8 rounded hover:bg-gray-300 ${displayCount === 50 && "bg-gray-300"} flex items-center justify-center text-center`} onClick={handleDisplayCountChange} value={50}>50</button>
                            <button className={`size-8 rounded hover:bg-gray-300 ${displayCount === filteredUsers.length && "bg-gray-300"} flex items-center justify-center text-center`} onClick={handleDisplayCountChange} value={filteredUsers.length}>All</button>
                        </div>
                        <div className='flex items-center gap-1'>
                            <span>Page {currentPage + 1} of {totalPages}({filteredUsers.length} items)</span>
                            <button
                                className={`size-8 text-gray-500 hover:text-gray-800`}
                                disabled={currentPage <= 0}
                                onClick={() => setPage(currentPage - 1)}
                            >
                                <ChevronLeftIcon />
                            </button>
                            <button
                                className={`size-8 rounded ${currentPage == 0 && "bg-gray-300"} hover:bg-gray-300`}
                                disabled={currentPage <= 0}
                                onClick={() => setPage(currentPage === totalPages - 1 && totalPages > 2 ? currentPage - 2 : currentPage - 1)}
                            >
                                {currentPage === totalPages - 1 && totalPages > 2 ? currentPage - 1 : currentPage === 0 ? currentPage + 1 : currentPage + 0}
                            </button>
                            {totalPages > 1 && <button
                                className={`size-8 rounded ${(currentPage != 0 && (totalPages <= 2 || !(currentPage === totalPages - 1))) && "bg-gray-300"} hover:bg-gray-300`}
                                disabled={!(currentPage === totalPages - 1 || currentPage === 0)}
                                onClick={() => setPage(currentPage === totalPages - 1 ? currentPage - 1 : currentPage === 0 ? currentPage + 1 : currentPage)}
                            >
                                {currentPage === totalPages - 1 && totalPages > 2 ? currentPage : currentPage === 0 ? currentPage + 2 : currentPage + 1}
                            </button>}
                            {totalPages > 2 && <button
                                className={`size-8 rounded ${currentPage === totalPages - 1 && "bg-gray-300"} hover:bg-gray-300`}
                                disabled={currentPage === totalPages - 1}
                                onClick={() => setPage(currentPage === 0 ? currentPage + 2 : currentPage + 1)}
                            >
                                {currentPage === totalPages - 1 ? currentPage + 1 : currentPage === 0 ? currentPage + 3 : currentPage + 2}
                            </button>}
                            <button
                                className='size-8 text-gray-500 hover:text-gray-800'
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => setPage(currentPage + 1)}
                            >
                                <ChevronRightIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
