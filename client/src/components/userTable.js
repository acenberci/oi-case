import axios from 'axios';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { PencilIcon, UserIcon } from '@heroicons/react/24/solid';
import { DataGrid, Column, Pager, Paging, FilterRow, Sorting, SearchPanel, ColumnChooser, HeaderFilter } from 'devextreme-react/data-grid';
import { HelperContext } from '@/helpers/HelperContext';

export default function UserTable() {
    const [focusedRowKey, setFocusedRowKey] = useState(null);
    const { focusedUser, setFocusedUser, setEditMode, editMode, users, setUsers } = useContext(HelperContext);

    useEffect(() => {
        axios.get('https://dummyjson.com/users')
            .then(response => {
                setUsers(response.data.users);
            })
            .catch(error => {
                console.error('API çağrısı hatası:', error);
            });
    }, []);

    useEffect(() => {
        if (!editMode && focusedUser) {
            setUsers(prevUsers => {
                const updatedUsers = prevUsers.map(user =>
                    user.id === focusedUser.id ? focusedUser : user
                );
                return updatedUsers;
            });
        }
    }, [editMode, focusedUser]);

    const EditButton = (props) => (
        <button
            onClick={() => {
                setEditMode(true);
                setFocusedUser(props.data);
            }}
            className="text-blue-600 hover:text-blue-800 self-center place-self-center justify-self-center"
        >
            <PencilIcon className='w-5 h-5' />
        </button>
    );

    const focusClick = (e) => {
        setFocusedUser(e.data);
        setFocusedRowKey(e.component.option('focusedRowKey'));
    };

    return (
        <div className={`${editMode ? "hidden" : ""} mt-5 overflow-x-auto`}>
            <h4 className="flex items-center text-2xl font-bold mb-5">
                <UserIcon className="w-6 h-6 mr-2" />
                User List
            </h4>
            <DataGrid
                dataSource={users}
                keyExpr="id"
                showBorders={true}
                allowColumnResizing={true}
                columnAutoWidth={true}
                focusedRowEnabled={true}
                focusedRowKey={focusedRowKey}
                onFocusedRowChanged={focusClick}
                onRowClick={focusClick}
            >
                <FilterRow visible={true} />
                <SearchPanel visible={true} highlightCaseSensitive={true} />
                <Sorting mode="multiple" />
                <ColumnChooser enabled={true} />
                <HeaderFilter visible={true} />
                <Column
                    caption="User"
                    dataField='firstName'
                    cellRender={(cellData) => {
                        const { firstName, lastName, image } = cellData.data;
                        const fullName = `${firstName} ${lastName}`;
                        return (
                            <div className="flex items-center">
                                {image && <img src={image} alt="User Thumbnail" className="w-6 h-6 mr-2" />}
                                {fullName}
                            </div>
                        );
                    }}
                />
                <Column dataField="phone" caption="Phone" />
                <Column dataField="email" caption="Email" />
                <Column
                    type="buttons"
                    caption="Action"
                    cellRender={EditButton}
                />
                <Pager allowedPageSizes={[5, 10, 20, 50]} showPageSizeSelector={true} />
                <Paging defaultPageSize={5} />
            </DataGrid>
        </div>
    );
}
