import React, { useContext, useEffect, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { HelperContext } from '@/helpers/HelperContext';

export default function Register() {
  const {toggleAuth } = useContext(HelperContext)
  const navigate = useRouter()
  const [error, setError] = useState(null)
  if(toggleAuth)useEffect(() => {
    axios.get("http://localhost:3001/users/auth", { headers: { accessToken: Cookies.get("accessToken"), }, }).then((response) => {
      if (!response.data.error) {
        navigate.replace("/")
      } else {
        Cookies.remove("accessToken")
      }
    })
  }, []);
  const initialValues = {
    name: "",
    surname: "",
    email: "",
    password: "",
    phoneNumber: "",
    birthDate: ""
  }
  const SignInSchema = Yup.object().shape({
    name: Yup.string().required(null).min(2),
    surname: Yup.string().required(null).min(2),
    email: Yup.string().required(null).email(),
    password: Yup.string().required(null).min(6),
    phoneNumber: Yup.string().required(null),
    birthDate: Yup.date().required(null)
  });
  return (
    <div className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-8 px-5 bg-white rounded-md min-w-[320px] w-[25%] max-sm:w-full shadow-lg border-[1px] border-solid border-gray-200'>
      <h1 className='text-center text-2xl font-semibold mb-10'>Sign Up</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={SignInSchema}
        onSubmit={(values) => {
          axios.post("http://localhost:3001/users/register", values).then((response) => {
            if (!response.data.error) {
              axios.post("http://localhost:3001/users/login", values).then((secondResponse) => {
                if (!secondResponse.data.error) {
                  Cookies.set("accessToken", secondResponse.data.token);
                  navigate.replace("/");
                } else {
                  setError(secondResponse.data.error);
                }
              });
            } else {
              setError(response.data.error);
            }
          });
        }}
      >
        <Form>
          <div className='flex flex-col justify-between min-h-48 gap-3'>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className='block text-sm text-gray-500'>Name</label>
                <Field className="w-full my-2 rounded-sm bg-gray-100 h-8 border-b-[2px] hover:bg-gray-200 border-solid border-gray-700 focus:outline-none focus:border-blue-500 transition-colors duration-500 ease-out " name="name" type="text" />
                <ErrorMessage name='name' />
              </div>
              <div>
                <label className='block text-sm text-gray-500'>Surname</label>
                <Field className="w-full my-2 rounded-sm bg-gray-100 h-8 border-b-[2px] hover:bg-gray-200 border-solid border-gray-700 focus:outline-none focus:border-blue-500 transition-colors duration-500 ease-out " name="surname" type="text" />
                <ErrorMessage name='surname' />
              </div>
            </div>
            <div>
              <label className='block text-sm text-gray-500'>Email</label>
              <Field className="w-full my-2 rounded-sm bg-gray-100 h-8 border-b-[2px] hover:bg-gray-200 border-solid border-gray-700 focus:outline-none focus:border-blue-500 transition-colors duration-500 ease-out " name="email" type="email" />
              <ErrorMessage name='email' />
            </div>
            <div>
              <label className='block text-sm text-gray-500'>Password</label>
              <Field className="w-full my-2 rounded-sm bg-gray-100 h-8 border-b-[2px] hover:bg-gray-200 border-solid border-gray-700 focus:outline-none focus:border-blue-500 transition-colors duration-500 ease-out " name="password" type="password" />
              <ErrorMessage name='password' />
            </div>
            <div>
              <label className='block text-sm text-gray-500'>Phone Number</label>
              <Field className="w-full my-2 rounded-sm bg-gray-100 h-8 border-b-[2px] hover:bg-gray-200 border-solid border-gray-700 focus:outline-none focus:border-blue-500 transition-colors duration-500 ease-out " name="phone" type="tel" />
              <ErrorMessage name='phone' />
            </div>
            <div>
              <label className='block text-sm text-gray-500'>Birth of Date</label>
              <Field className="w-full my-2 rounded-sm bg-gray-100 h-8 border-b-[2px] hover:bg-gray-200 border-solid border-gray-700 focus:outline-none focus:border-blue-500 transition-colors duration-500 ease-out " name="birthDate" type="date" />
              <ErrorMessage name='birthDate' />
            </div>
            <label className='block text-sm text-gray-500'>
              By creating an account, you agree to the <a href='#' className=' underline'>Terms of Service</a> and <a href='#' className=' underline'>Privacy Policy</a>
            </label>
            {error && <div id={error} className="">
              <div className="">* {error}</div>
            </div>}
            <div className=''>
              <button className='w-full rounded-sm bg-blue-500 hover:bg-blue-600 shadow-sm text-white h-8' type='Submit'>Sign Up</button>
            </div>
            <div className='text-blue-500 text-center'>
              <p>Have an account ? <a href='/login' className='underline'>Sign In</a></p>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  )
}
