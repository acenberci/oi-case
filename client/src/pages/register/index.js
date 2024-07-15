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
    <div className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-12 px-10 bg-gray-300 rounded-md w-[500px] max-sm:w-full shadow-lg'>
      <h1 className='text-center text-2xl font-semibold mb-10'>Register</h1>
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
          <div className='flex flex-col justify-between'>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className='block text-sm text-gray-500'>Name</label>
                <Field className="w-full my-2 rounded-md bg-gray-100" name="name" type="text" />
                <ErrorMessage name='name' />
              </div>
              <div>
                <label className='block text-sm text-gray-500'>Surname</label>
                <Field className="w-full my-2 rounded-md bg-gray-100"  name="surname" type="text" />
                <ErrorMessage name='surname' />
              </div>
            </div>
            <div>
              <label className='block text-sm text-gray-500'>Email</label>
              <Field className="w-full my-2 rounded-md bg-gray-100"  name="email" type="email" />
              <ErrorMessage name='email' />
            </div>
            <div>
              <label className='block text-sm text-gray-500'>Password</label>
              <Field className="w-full my-2 rounded-md bg-gray-100"  name="password" type="password" />
              <ErrorMessage name='password' />
            </div>
            <div>
              <label className='block text-sm text-gray-500'>Phone Number</label>
              <Field className="w-full my-2 rounded-md bg-gray-100"  name="phoneNumber" type="tel" />
              <ErrorMessage name='phoneNumber' />
            </div>
            <div>
              <label className='block text-sm text-gray-500'>Birth of Date</label>
              <Field className="w-full my-2 rounded-md bg-gray-100" name="birthDate" type="date" />
              <ErrorMessage name='birthDate' />
            </div>
            {error && <div id={error} className="">
              <div className="">* {error}</div>
            </div>}
            <div className='text-end'>
              <a href='/login' className=' text-gray-700 align-end'>Login</a>
              <button className=' bg-gray-400 rounded-md py-3 w-full text-white mt-2' type='Submit'>Submit</button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  )
}
