import React, { useContext, useEffect, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { HelperContext } from '@/helpers/HelperContext';

export default function Login() {
  const { toggleAuth } = useContext(HelperContext)
  const navigate = useRouter()
  const [error, setError] = useState(null)
  useEffect(() => {
    if (toggleAuth) axios.get("http://localhost:3001/users/auth", { headers: { accessToken: Cookies.get("accessToken"), }, }).then((response) => {
      if (!response.data.error) {
        navigate.replace("/")
      } else {
        Cookies.remove("accessToken")
      }
    })
    else navigate.replace("/")
  }, []);
  const SignInSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required(null),
    password: Yup.string()
      .min(6, "Too Short")
      .required(null),
    rememberMe: Yup.boolean()
  });
  return (
    <div className=' absolute  sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 py-8 px-5 bg-white rounded-md w-[25%] min-w-[320px] max-sm:w-full max-sm:top-1/2 max-sm:-translate-y-1/2 shadow-lg border-[1px] border-solid border-gray-200'>
      <h1 className='text-center text-2xl font-semibold mb-10'>Sign In</h1>
      <Formik
        initialValues={{ email: "", password: "", rememberMe: false }}
        validationSchema={SignInSchema}
        onSubmit={(values) => {
          axios.post("http://localhost:3001/users/login", values).then((response) => {
            if (!response.data.error) {
              if(values.rememberMe)Cookies.set('accessToken', response.data.token, { expires: 36500 });
              else Cookies.set("accessToken", response.data.token)
              navigate.replace("/")
            }
            else {
              setError(response.data.error)
            }

          })
        }}
      >
        <Form >
          <div className='flex flex-col justify-between min-h-48 gap-3'>
            <div>
              <label className='block text-sm text-gray-500'>Email address</label>
              <Field className="w-full my-2 rounded-sm bg-gray-100 h-8 border-b-[2px] hover:bg-gray-200 border-solid border-gray-700 focus:outline-none focus:border-blue-500 transition-colors duration-500 ease-out " name="email" type="email" />
              <ErrorMessage name='email' />
            </div>
            <div>
              <label className='block text-sm text-gray-500'>Password</label>
              <Field className="w-full my-2 rounded-sm bg-gray-100 h-8 border-b-[2px] hover:bg-gray-200 border-solid border-gray-700 focus:outline-none focus:border-blue-500 transition-colors duration-500 ease-out " name="password" type="password" />
              <ErrorMessage name='password' />
            </div>
            <label className='flex gap-1 items-center'>
              <Field className="my-2 bg-gray-100" name="rememberMe" type="checkbox" />
              <p>Remember me</p> 
            </label>
            <div className=''>
              <button className='w-full rounded-sm bg-blue-500 hover:bg-blue-600 shadow-sm text-white h-8' type='Submit'>Sign In</button>
            </div>
            <p className='text-center my-2'>or</p>
            <div>
              <button className='w-full my-2 rounded-sm bg-gray-200 hover:bg-gray-300 h-8 shadow-lg' onClick={()=>navigate.replace("/register")}>Create an Account</button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  )
}
