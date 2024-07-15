import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { MagnifyingGlassIcon, ShoppingCartIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { HelperContext } from '@/helpers/HelperContext';

export default function ProductTable() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [displayCount, setDisplayCount] = useState(5);
    const [currentPage, setPage] = useState(0);
    const [currentSort, setCurrentSort] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [editProduct, setEditProduct] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        quantity: '',
        discountPercentage: "",
    })
    const { focusedUser, editMode } = useContext(HelperContext)
    useEffect(() => {
        focusedUser &&
            axios.get('https://dummyjson.com/carts/' + focusedUser.id)
                .then(response => {
                    setProducts(response.data.products);
                    setFilteredProducts(response.data.products);
                    setTotalPages(Math.ceil(response.data.products.length / displayCount));
                    console.log(response.data.products)
                })
                .catch(error => {
                    console.error('API çağrısı hatası:', error);
                });
    }, [focusedUser]);

    const handleDisplayCountChange = (event) => {
        const newDisplayCount = parseInt(event.target.value);
        setDisplayCount(newDisplayCount);
        setTotalPages(Math.ceil(filteredProducts.length / newDisplayCount));
        setPage(0);
    };

    const sortBy = (field, listUser) => {
        let sortedProducts = listUser ? [...listUser] : [...filteredProducts];
        const sortDirection = Math.sign(currentSort) === -1 || Math.abs(currentSort) !== field ? 1 : -1;
        sortedProducts = sortedProducts.sort((a, b) => {
            let aField;
            let bField;
            switch (field) {
                case 1:
                    aField = a.title
                    bField = b.title
                    break;
                case 2:
                    aField = a.price
                    bField = b.price
                    break;
                case 3:
                    aField = a.quantity
                    bField = b.quantity
                    break;
                case 4:
                    aField = a.total
                    bField = b.total
                    break;
                case 5:
                    aField = a.discountPercentage
                    bField = b.discountPercentage
                    break;
                case 6:
                    aField = a.discountedTotal
                    bField = b.discountedTotal
                    break;
            }
            if (typeof aField === "number" && typeof bField === "number") {
                return sortDirection * (aField - bField);
            } else {
                return sortDirection * aField.localeCompare(bField);
            }
        });
        setProducts(prev => prev.sort((a, b) => {
            let aField;
            let bField;
            switch (field) {
                case 1:
                    aField = a.title
                    bField = b.title
                    break;
                case 2:
                    aField = a.price
                    bField = b.price
                    break;
                case 3:
                    aField = a.quantity
                    bField = b.quantity
                    break;
                case 4:
                    aField = a.total
                    bField = b.total
                    break;
                case 5:
                    aField = a.discountPercentage
                    bField = b.discountPercentage
                    break;
                case 6:
                    aField = a.discountedTotal
                    bField = b.discountedTotal
                    break;
            }
            if (typeof aField === "number" && typeof bField === "number") {
                return sortDirection * (aField - bField);
            } else {
                return sortDirection * aField.localeCompare(bField);
            }

        }))
        setFilteredProducts(sortedProducts);
        setCurrentSort(sortDirection * field);
    };
    const searchFilter = (field, filter) => {
        const tempUsers = products.filter(product => {
            let fieldValue;
            switch (field) {
                case 1:
                    fieldValue = product.title.toString().toLowerCase()
                    break
                case 2:
                    fieldValue = product.price.toString().toLowerCase()
                    break
                case 3:
                    fieldValue = product.quantity.toString().toLowerCase()
                    break
                case 4:
                    fieldValue = product.total.toString().toLowerCase()
                    break
                case 5:
                    fieldValue = product.discountPercentage.toString().toLowerCase()
                    break
                case 6:
                    fieldValue = product.discountTotal.toString().toLowerCase()
                    break
            }
            return fieldValue.includes(filter.toString().toLowerCase());
        });
        setFilteredProducts(tempUsers)
        setTotalPages(Math.ceil(tempUsers.length / displayCount))
    };
    const deleteProduct = (id) => {
        setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
        setFilteredProducts(prevFilteredProducts => prevFilteredProducts.filter(product => product.id !== id));
    }
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    const updateProduct = (id) => {
        const values = {
            id: editProduct,
            ...formData,
            total: formData.price * formData.quantity,
            discountedPrice: (formData.price * formData.quantity) * ((100 - formData.discountPercentage) / 100)
        }
        axios.put('https://dummyjson.com/carts/' + focusedUser.id, {
            merge: true,
            products: [values],
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log(response)
            setProducts(response.data.products)
            setFilteredProducts(response.data.products)
            setEditProduct(null)
        })
    };
    return (
        <div className='mt-5 overflow-x-auto'>
            <h4 className="flex items-center text-2xl font-bold mb-5">
                <ShoppingCartIcon className="size-6 mr-2" />
                Product List
            </h4>
            <table className="min-w-full border border-gray-300 w-full min-w-[1050px]">
                <thead className="bg-gray-50">
                    <tr>
                        <th className={`border border-gray-300 px-6 py-3 text-md font-medium ${currentSort === 1 || currentSort === -1 ? "text-gray-800" : "text-gray-500"} hover:text-gray-900 uppercase tracking-wider`}>
                            <button onClick={() => sortBy(1)}>
                                Title
                            </button>
                        </th>
                        <th className={`border border-gray-300 px-6 py-3 text-md font-medium ${currentSort === 2 || currentSort === -2 ? "text-gray-800" : "text-gray-500"} hover:text-gray-900 uppercase tracking-wider`}>
                            <button onClick={() => sortBy(2)}>
                                Price
                            </button>
                        </th>
                        <th className={`border border-gray-300 px-6 py-3 text-md font-medium ${currentSort === 3 || currentSort === -3 ? "text-gray-800" : "text-gray-500"} hover:text-gray-900 uppercase tracking-wider`}>
                            <button onClick={() => sortBy(3)}>
                                Quantity
                            </button>
                        </th>
                        <th className={`border border-gray-300 px-6 py-3 text-md font-medium ${currentSort === 4 || currentSort === -4 ? "text-gray-800" : "text-gray-500"} hover:text-gray-900 uppercase tracking-wider`}>
                            <button onClick={() => sortBy(4)}>
                                Total
                            </button>
                        </th>
                        <th className={`border border-gray-300 px-6 py-3 text-md font-medium ${currentSort === 5 || currentSort === -5 ? "text-gray-800" : "text-gray-500"} hover:text-gray-900 uppercase tracking-wider`}>
                            <button onClick={() => sortBy(5)}>
                                Discount
                            </button>
                        </th>
                        <th className={`border border-gray-300 px-6 py-3 text-md font-medium ${currentSort === 6 || currentSort === -6 ? "text-gray-800" : "text-gray-500"} hover:text-gray-900 uppercase tracking-wider`}>
                            <button onClick={() => sortBy(6)}>
                                Discounted Total
                            </button>
                        </th>
                        <th className={!editMode && "hidden"}></th>
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
                        <th className="border border-gray-300 relative">
                            <MagnifyingGlassIcon className='absolute h-[calc(100%-4px)] top-[2px] right-0 text-gray-500'></MagnifyingGlassIcon>
                            <input onChange={(x) => { searchFilter(4, x.target.value) }} className="w-full text-gray-500" type="text" />
                        </th><th className="border border-gray-300 relative">
                            <MagnifyingGlassIcon className='absolute h-[calc(100%-4px)] top-[2px] right-0 text-gray-500'></MagnifyingGlassIcon>
                            <input onChange={(x) => { searchFilter(5, x.target.value) }} className="w-full text-gray-500" type="text" />
                        </th><th className="border border-gray-300 relative">
                            <MagnifyingGlassIcon className='absolute h-[calc(100%-4px)] top-[2px] right-0 text-gray-500'></MagnifyingGlassIcon>
                            <input onChange={(x) => { searchFilter(6, x.target.value) }} className="w-full text-gray-500" type="text" />
                        </th>
                        <th className={!editMode && "hidden"}></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.slice(currentPage * displayCount, (currentPage + 1) * displayCount).map(product => (
                        <tr key={product.id} className={`hover:bg-gray-200`}>
                            {editProduct == product.id ?
                                <>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap relative">
                                        <img src={product.thumbnail} alt="" className='size-10 absolute left-0 -translate-y-1/2 top-1/2' />
                                        <input onChange={handleChange} className="mx-5" type="text" name="title" />
                                    </td>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-center">
                                        <input onChange={handleChange} className="mx-5" type="number" step="any" name="price" />
                                    </td>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-center">
                                        <input onChange={handleChange} className="mx-5" type="number" step="any" name="quantity" />
                                    </td>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-center">
                                        $ {product.total.toFixed(2)}
                                    </td>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-center">
                                        <input onChange={handleChange} className="mx-5" type="number" step="any" name="discountPercentage" />
                                    </td>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-center">
                                        $ {product.discountedTotal}
                                    </td>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-center">
                                        <div className=' size-full flex justify-between item-center'>
                                            <button className='text-blue-700 ' onClick={updateProduct} >Save</button>
                                        </div>
                                    </td>
                                </>

                                :
                                <>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap relative">
                                        <img src={product.thumbnail} alt="" className='size-10 absolute left-0 -translate-y-1/2 top-1/2' />
                                        <p className=' mx-5'>{product.title}</p>
                                    </td>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-center">
                                        $ {product.price}
                                    </td>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-center">
                                        {product.quantity}
                                    </td>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-center">
                                        $ {product.total.toFixed(2)}
                                    </td>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-center">
                                        <span className="inline-block bg-green-400 p-2 rounded-md">
                                            -%{product.discountPercentage}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-center">
                                        $ {product.discountedPrice || product.discountedTotal}
                                    </td>
                                    <td className={`border ${!editMode && "hidden"} border-gray-300 px-6 py-4 whitespace-nowrap text-center`}>
                                        <div className=' size-full flex justify-between'>
                                            <button className='text-blue-700' onClick={() => {
                                                setEditProduct(product.id)
                                            }}>Edit</button>
                                            <button className='text-blue-700' onClick={() => {
                                                deleteProduct(product.id)
                                            }}>Delete</button>
                                        </div>
                                    </td>
                                </>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={`flex justify-between mt-4 min-w-[1050px] ${filteredProducts.length <= 5 && "hidden"}`}>
                <div className='flex gap-1' id="displayCount">
                    <button className={`size-8 rounded hover:bg-gray-300 ${displayCount === 5 && "bg-gray-300 hover:bg-gray-500"} flex items-center justify-center text-center`} onClick={handleDisplayCountChange} value={5}>5</button>
                    <button className={`size-8 rounded hover:bg-gray-300 ${displayCount === 10 && "bg-gray-300"} flex items-center justify-center text-center`} onClick={handleDisplayCountChange} value={10}>10</button>
                    <button className={`size-8 rounded hover:bg-gray-300 ${displayCount === 20 && "bg-gray-300"} flex items-center justify-center text-center`} onClick={handleDisplayCountChange} value={20}>20</button>
                    <button className={`size-8 rounded hover:bg-gray-300 ${displayCount === 50 && "bg-gray-300"} flex items-center justify-center text-center`} onClick={handleDisplayCountChange} value={50}>50</button>
                    <button className={`size-8 rounded hover:bg-gray-300 ${displayCount === filteredProducts.length && "bg-gray-300"} flex items-center justify-center text-center`} onClick={handleDisplayCountChange} value={filteredProducts.length}>All</button>
                </div>
                <div className='flex items-center gap-1'>
                    <span>Page {currentPage + 1} of {totalPages}({filteredProducts.length} items)</span>
                    <button
                        className={` size-8 text-gray-500 hover:text-gray-800`}
                        disabled={currentPage <= 0}
                        onClick={() => setPage(currentPage - 1)}
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button
                        className={` size-8 rounded ${currentPage == 0 && "bg-gray-300"} hover:bg-gray-300`}
                        disabled={currentPage <= 0}
                        onClick={() => setPage(currentPage === totalPages - 1 && totalPages > 2 ? currentPage - 2 : currentPage - 1)}
                    >
                        {currentPage === totalPages - 1 && totalPages > 2 ? currentPage - 1 : currentPage === 0 ? currentPage + 1 : currentPage + 0}
                    </button>
                    {totalPages > 1 && <button
                        className={` size-8 rounded ${(currentPage != 0 && (totalPages <= 2 || !(currentPage === totalPages - 1))) && "bg-gray-300"} hover:bg-gray-300`}
                        disabled={!(currentPage === totalPages - 1 || currentPage === 0)}
                        onClick={() => setPage(currentPage === totalPages - 1 ? currentPage - 1 : currentPage === 0 ? currentPage + 1 : currentPage)}
                    >
                        {currentPage === totalPages - 1 && totalPages > 2 ? currentPage : currentPage === 0 ? currentPage + 2 : currentPage + 1}
                    </button>}
                    {totalPages > 2 && <button
                        className={` size-8 rounded ${currentPage === totalPages - 1 && "bg-gray-300"} hover:bg-gray-300`}
                        disabled={currentPage === totalPages - 1}
                        onClick={() => setPage(currentPage === 0 ? currentPage + 2 : currentPage + 1)}
                    >
                        {currentPage === totalPages - 1 ? currentPage + 1 : currentPage === 0 ? currentPage + 3 : currentPage + 2}
                    </button>}
                    <button
                        className=' size-8 text-gray-500 hover:text-gray-800'
                        disabled={currentPage >= totalPages - 1}
                        onClick={() => setPage(currentPage + 1)}
                    >
                        <ChevronRightIcon />
                    </button>
                </div>
            </div>
        </div >
    )
}
