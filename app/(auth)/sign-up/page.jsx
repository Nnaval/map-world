"use client"
import React from 'react'
import {useRouter} from "next/navigation"
import { AiOutlineEye } from "react-icons/ai";
import { createUser } from 'lib/actions/user.prisma';
import { signIn } from 'auth';

const SignUp = () => {
  const router = useRouter();

  const [form, setForm] = usestate({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({...form, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registering Value", form);
    const success = createUser(form);
    if (success) {
      router.push('/login'); 
  }
  }

  const handleGoogle = async () => {
    console.log("Google Sign-In Function was triggered");
    await signIn('google', {
      redirect: "/"
    })
    
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-4 text-center">Create an account</h1>
      <p className='font-semibold text-center'>Please fill your details</p>
      <form>
       
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name='fullName'
            value={form.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>

        
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name='username'
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />
        </div>

       
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name='email'
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name='password'
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
          <span className="absolute inset-y-0 right-4 flex items-center text-gray-500">
          <AiOutlineEye  className='font-extrabold text-2xl mt-6'/>
          </span>
        </div>

        
        <div className="mb-4 relative">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name='confirmPassword'
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm your password"
          />
          <span className="absolute inset-y-0 right-4 flex items-center text-gray-500">
          <AiOutlineEye  className='font-extrabold text-2xl mt-6'/>
          </span>
        </div>

        
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-700 text-white py-2 px-4 mt-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sign-Up
        </button>
      </form>
    </div>
  </div>
  )
}

export default SignUp