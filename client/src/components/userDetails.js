import { HelperContext } from '@/helpers/HelperContext'
import React, { useContext } from 'react'
import { TrashIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';

export default function UserDetails() {
    const { focusedUser, setFocusedUser, setEditMode } = useContext(HelperContext)
    const initialValues = {
        firstName: focusedUser.firstName,
        lastName: focusedUser.lastName,
        age: focusedUser.age,
        gender: focusedUser.gender,
        username: focusedUser.username,
        password: focusedUser.password,
        birthDate: focusedUser.birthDate,
        bloodGroup: focusedUser.bloodGroup,
        height: focusedUser.height,
        weight: focusedUser.weight,
        eyeColor: focusedUser.eyeColor,
        hairColor: focusedUser.hair.color,
        hairType: focusedUser.hair.type,
        university: focusedUser.university,
        address: focusedUser.address.address,
        addressCity: focusedUser.address.city,
        addressState: focusedUser.address.state,
        addressStateCode: focusedUser.address.stateCode,
        addressPostalCode: focusedUser.address.postalCode,
        addressCountry: focusedUser.address.country,
        email: focusedUser.email,
        phone: focusedUser.phone,
        cryptoCoin: focusedUser.crypto&&focusedUser.crypto.coin,
        cryptoWallet: focusedUser.crypto&&focusedUser.crypto.wallet,
        cryptoNetwork: focusedUser.crypto&&focusedUser.crypto.network,
        companyDepartment: focusedUser.company.department,
        companyName: focusedUser.company.name,
        companyTitle: focusedUser.company.title,
    }
    const UserDetailSchema = Yup.object().shape({
        firstName: Yup.string().required(null).min(2),
        lastName: Yup.string().required(null).min(2),
        age: Yup.number().required(null).min(2),
        gender: Yup.string().required(null).min(2),
        username: Yup.string().required(null).min(2),
        password: Yup.string().required(null).min(2),
        birthDate: Yup.string().required(null).min(2),
        bloodGroup: Yup.string().required(null).min(2),
        height: Yup.string().required(null).min(2),
        weight: Yup.string().required(null).min(2),
        eyeColor: Yup.string().required(null).min(2),
        hairColor: Yup.string().required(null).min(2),
        hairType: Yup.string().required(null).min(2),
        university: Yup.string().required(null).min(2),
        address: Yup.string().required(null).min(2),
        addressCity: Yup.string().required(null).min(2),
        addressState: Yup.string().required(null).min(2),
        addressStateCode: Yup.string().required(null).min(2),
        addressPostalCode: Yup.string().required(null).min(2),
        addressCountry: Yup.string().required(null).min(2),
        email: Yup.string().email().required(null).min(2),
        phone: Yup.string().required(null).min(2),
        cryptoCoin: Yup.string().required(null).min(2),
        cryptoWallet: Yup.string().required(null).min(2),
        cryptoNetwork: Yup.string().required(null).min(2),
        companyDepartment: Yup.string().required(null).min(2),
        companyName: Yup.string().required(null).min(2),
        companyTitle: Yup.string().required(null).min(2),
    });
    return (<>
        <div>
            <h1 className='text-xl'>{focusedUser.firstName}</h1>
            <hr className=' mb-4 mt-1' />
            <Formik
                initialValues={initialValues}
                validationSchema={UserDetailSchema}
                onSubmit={(values) => {
                    values.id = focusedUser.id
                    values.hair = {
                        color: values.eyeColor,
                        type: values.hairType
                    }
                    values.address = {
                        address: values.address,
                        city: values.addressCity,
                        state: values.addressState,
                        state: values.addressState,
                        stateCode: values.addressStateCode,
                        postalCode: values.addressPostalCode,
                        country: values.addressCountry,
                    }
                    values.crypto = {
                        coin: values.cryptoCoin,
                        wallet: values.cryptoWallet,
                        network: values.cryptoNetwork,
                    }
                    values.company = {
                        department: values.companyDepartment,
                        name: values.companyName,
                        title: values.companyTitle,
                    }
                    axios.patch('https://dummyjson.com/users/2', values, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => {
                            console.log(response.data)
                            setFocusedUser(response.data);
                            setEditMode(false)
                        })
                        .catch(error => {
                            console.error('There was an error!', error);
                        });
                }}>
                <Form>
                    <h4 className='text-xl'>Personal</h4>
                    <hr className='mb-4 mt-1' />
                    <div className=" grid grid-cols-7 max-lg:grid-cols-5 max-md:grid-cols-3 max-sm:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className=' block text-sm text-gray-500 mb-1'>First Name <span className=" text-red-500">*</span></label>
                            <Field name="firstName" type="text" className="formInput" />
                        </div>
                        <div className='form-group'>
                            <label className='block text-sm text-gray-500 mb-1'>Last Name<span className='text-red-500'>*</span></label>
                            <Field name="lastName" type="text" className="formInput" />
                        </div>
                        <div className='form-group'>
                            <label className='block text-sm text-gray-500 mb-1'>Age <span className='text-red-500'>*</span></label>
                            <Field name="age" type="text" className="formInput" />
                        </div>
                        <div className='form-group'>
                            <label className='block text-sm text-gray-500 mb-1'>Gender</label>
                            <Field name="gender" type="text" className="formInput" />
                        </div>
                        <div className='form-group'>
                            <label className='block text-sm text-gray-500 mb-1'>Username <span className='text-red-500'>*</span></label>
                            <Field name="username" type="text" className="formInput" />
                        </div>
                        <div className='form-group'>
                            <label className='block text-sm text-gray-500 mb-1'>Password <span className='text-red-500'>*</span></label>
                            <Field name="password" type="text" className="formInput" />
                        </div>
                        <div className='form-group'>
                            <label className='block text-sm text-gray-500 mb-1'>Birth Date</label>
                            <Field name="birthDate" type="text" className="formInput" />
                        </div>
                        <div className='form-group'>
                            <label className='block text-sm text-gray-500 mb-1'>Blood Group</label>
                            <Field name="bloodGroup" type="text" className="formInput" />
                        </div>
                        <div className='form-group'>
                            <label className='block text-sm text-gray-500 mb-1'>Height</label>
                            <Field name="height" type="text" className="formInput" />
                        </div>
                        <div className='form-group'>
                            <label className='block text-sm text-gray-500 mb-1'>Weight</label>
                            <Field name="weight" type="text" className="formInput" />
                        </div>
                        <div className='form-group'>
                            <label className='block text-sm text-gray-500 mb-1'>Eye Color</label>
                            <Field name="eyeColor" type="text" className="formInput" />
                        </div>
                        <div className='form-group'>
                            <label className='block text-sm text-gray-500 mb-1'>Hair Color</label>
                            <Field name="hairColor" type="text" className="formInput" />
                        </div>
                        <div className='form-group'>
                            <label className='block text-sm text-gray-500 mb-1'>Hair Type</label>
                            <Field name="hairType" type="text" className="formInput" />
                        </div>
                        <div className='form-group'>
                            <label className='block text-sm text-gray-500 mb-1'>University</label>
                            <Field name="university" type="text" className="formInput" />
                        </div>
                    </div>
                    <div className='grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6 my-4'>
                        <div>
                            <h4 className='text-xl'>Adress</h4>
                            <hr className=' mb-4 mt-1' />
                            <div className="grid grid-rows-subgrid gap-4">
                                <div className='form-group'>
                                    <label className='block text-sm text-gray-500 mb-1'>Address </label>
                                    <Field name="address" type="text" className="formInput" />
                                </div>
                                <div className='form-group'>
                                    <label className='block text-sm text-gray-500 mb-1'>Address City </label>
                                    <Field name="addressCity" type="text" className="formInput" />
                                </div>
                                <div className='form-group'>
                                    <label className='block text-sm text-gray-500 mb-1'>Address State </label>
                                    <Field name="addressState" type="text" className="formInput" />
                                </div>
                                <div className='form-group'>
                                    <label className='block text-sm text-gray-500 mb-1'>Address State Code </label>
                                    <Field name="addressStateCode" type="text" className="formInput" />
                                </div>
                                <div className='form-group'>
                                    <label className='block text-sm text-gray-500 mb-1'>Address Postal Code </label>
                                    <Field name="addressPostalCode" type="text" className="formInput" />
                                </div>
                                <div className='form-group'>
                                    <label className='block text-sm text-gray-500 mb-1'>Address Country </label>
                                    <Field name="addressCountry" type="text" className="formInput" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className='text-xl'>Contact Information</h4>
                            <hr className=' mb-4 mt-1' />
                            <div className="grid grid-rows-subgrid gap-4">
                                <div className='form-group'>
                                    <label className='block text-sm text-gray-500 mb-1'>Email <span className='text-red-500'>*</span></label>
                                    <Field name="email" type="text" className="formInput" />
                                </div>
                                <div className='form-group'>
                                    <label className='block text-sm text-gray-500 mb-1'>Phone <span className='text-red-500'>*</span></label>
                                    <Field name="phone" type="text" className="formInput" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className='text-xl'>Crypto</h4>
                            <hr className=' mb-4 mt-1' />
                            <div className="grid grid-rows-subgrid gap-4">
                                <div className='form-group'>
                                    <label className='block text-sm text-gray-500 mb-1'>Crypto Coin</label>
                                    <Field name="cryptoCoin" type="text" className="formInput" />
                                </div>
                                <div className='form-group'>
                                    <label className='block text-sm text-gray-500 mb-1'>Crypto Wallet</label>
                                    <Field name="cryptoWallet" type="text" className="formInput" />
                                </div>
                                <div className='form-group'>
                                    <label className='block text-sm text-gray-500 mb-1'>Crypto Network</label>
                                    <Field name="cryptoNetwork" type="text" className="formInput" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className='text-xl'>Company</h4>
                            <hr className=' mb-4 mt-1' />
                            <div className="grid grid-rows-subgrid gap-4">
                                <div className='form-group'>
                                    <label className='block text-sm text-gray-500 mb-1'>Company Department</label>
                                    <Field name="companyDepartment" type="text" className="formInput" />
                                </div>
                                <div className='form-group'>
                                    <label className='block text-sm text-gray-500 mb-1'>Company Name</label>
                                    <Field name="companyName" type="text" className="formInput" />
                                </div>
                                <div className='form-group'>
                                    <label className='block text-sm text-gray-500 mb-1'>Company Title</label>
                                    <Field name="companyTitle" type="text" className="formInput" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" flex items-end justify-end gap-5">
                        <button className=" w-24 h-10 rounded-md text-white bg-red-500 flex justify-center items-center">
                            <TrashIcon className='size-6 mr-1'></TrashIcon>Delete</button>
                        <button className=" w-24 h-10 rounded-md text-white bg-blue-500 flex justify-center items-center" type='Submit'>
                            <PhotoIcon className='size-6 mr-1'>
                            </PhotoIcon>
                            Save</button>
                    </div>
                </Form>
            </Formik>
        </div>
    </>
    )
}
