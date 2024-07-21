import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { DataGrid, Column, Pager, Paging, Sorting, FilterRow, Editing } from 'devextreme-react/data-grid';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { HelperContext } from '@/helpers/HelperContext';

export default function ProductTable() {
    const [products, setProducts] = useState([]);
    const { focusedUser, editMode } = useContext(HelperContext);

    useEffect(() => {
        if (focusedUser) {
            axios.get('https://dummyjson.com/carts/' + focusedUser.id)
                .then(response => {
                    setProducts(response.data.products);
                })
                .catch(error => {
                    console.error('API çağrısı hatası:', error);
                });
        }
    }, [focusedUser]);

    const onRowUpdating = (e) => {
        const updatedProduct = {
            ...e.oldData,
            ...e.newData,
            total: e.newData.price * e.newData.quantity,
            discountedTotal: (e.newData.price * e.newData.quantity) * ((100 - e.newData.discountPercentage) / 100),
        };

        axios.put('https://dummyjson.com/carts/' + focusedUser.id, {
            merge: true,
            products: [updatedProduct],
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            const fixedVal = response.data.products.map((e) => {
                let a = e
                a = {
                    ...a,
                    discountedTotal: a.discountedPrice
                }
                return a
            })
            setProducts(fixedVal)
        }).catch(error => {
            console.error('Update API çağrısı hatası:', error);
        });
    };

    const onRowRemoving = (e) => {
        setProducts(prevProducts => prevProducts.filter(product => product.id !== e.data.id));
    };

    return (
        <div className='mt-5 overflow-x-auto'>
            <h4 className="flex items-center text-2xl font-bold mb-5">
                <ShoppingCartIcon className="w-6 h-6 mr-2" />
                User List
            </h4>
            <DataGrid
                dataSource={products}
                keyExpr="id"
                showBorders={true}
                onRowUpdating={onRowUpdating}
                onRowRemoving={onRowRemoving}
                allowColumnResizing={true}
                columnAutoWidth={true}
            >
                <FilterRow visible={true} />
                <Sorting mode="multiple" />
                {editMode && <Editing
                    mode="row"
                    allowUpdating={true}
                    allowDeleting={true}
                />}
                <Column dataField="title" caption="Title" cellRender={(data) => {
                    const { title, thumbnail } = data.data;
                    return (
                        <div className="flex items-center">
                            {thumbnail && <img src={thumbnail} alt="Product Thumbnail" className="w-6 h-6 mr-2" />} {/* Thumbnail'ı ekleyin */}
                            {title}
                        </div>
                    );
                }} />
                <Column dataField="price" caption="Price" dataType="number"
                    calculateCellValue={(e) => parseFloat(e.price)}
                    format={{ type: 'currency', precision: 2 }} />
                <Column dataField="quantity" caption="Quantity" dataType="number" />
                <Column dataField="total" caption="Total" dataType="number"
                    allowEditing={false}
                    calculateCellValue={(e) => parseFloat(e.total)}
                    format={{ type: 'currency', precision: 2 }} />
                <Column
                    dataField="discountPercentage"
                    caption="Discount"
                    dataType="number"
                    calculateCellValue={(e) => parseFloat(e.discountPercentage)}
                    customizeText={(data) => data.value + "%"}
                />
                <Column dataField="discountedTotal" caption="Discounted Total" allowEditing={false} dataType="number"
                    calculateCellValue={(e) => parseFloat(e.discountedTotal)}
                    format={{ type: 'currency', precision: 2 }} />
                <Pager allowedPageSizes={[5, 10, 20, 50]} showPageSizeSelector={true} />
                <Paging defaultPageSize={5} />
            </DataGrid>
        </div>
    );
}
