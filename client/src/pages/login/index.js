import React, { useContext, useEffect } from 'react'
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { HelperContext } from '@/helpers/HelperContext';

export default function Login() {
  const {toggleAuth } = useContext(HelperContext)
  const navigate = useRouter()
  useEffect(() => {
    if(toggleAuth)axios.get("http://localhost:3001/users/auth", { headers: { accessToken: Cookies.get("accessToken"), }, }).then((response) => {
      if (!response.data.error) {
        navigate.replace("/")
      } else {
        Cookies.remove("accessToken")
      }
    })
  }, []);
  const SignInSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required(null),
    password: Yup.string()
      .min(6, "Too Short")
      .required(null),
  });
  return (
    <div className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-12 px-10 bg-gray-300 rounded-md w-[500px] max-sm:w-full shadow-lg'>
      <h1 className='text-center text-2xl font-semibold mb-10'>Login</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={SignInSchema}
        onSubmit={(values) => {
          axios.post("http://localhost:3001/users/login", values).then((response) => {
            if (!response.data.error) {
              Cookies.set("accessToken", response.data.token)
              navigate.replace("/")
            }
            else {
              setError(response.data.error)
            }

          })
        }}
      >
        <Form >
          <div className='flex flex-col justify-between h-48'>
            <div>
              <label className='block text-sm text-gray-500'>Email address</label>
              <Field className="w-full my-2 rounded-md bg-gray-100" name="email" type="email" />
              <ErrorMessage name='email' />
            </div>
            <div>
              <label className='block text-sm text-gray-500'>Password</label>
              <Field className="w-full my-2 rounded-md bg-gray-100" name="password" type="password" />
              <ErrorMessage name='password' />
            </div>
            <div className='text-end'>
              <a href='/register' className=' text-gray-700 align-end'>Register</a>
              <button className=' bg-gray-400 rounded-md py-3 w-full text-white mt-2' type='Submit'>Submit</button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  )
}
