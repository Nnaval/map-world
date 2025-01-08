import React from 'react'
import { MdModeEdit } from "react-icons/md";
import Image from 'next/image'
// import profilePic from "../"

const EditProfile = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-6">
    
    <div className="relative w-full max-w-2xl">
      <h1 className="text-center text-2xl font-bold text-gray-800">My Profile</h1>
      <button className="absolute top-0 right-0 text-blue-500 hover:text-blue-600">
        
        <MdModeEdit />
      </button>
    </div>

    
    <div className="mt-6">
      <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto"></div>
      {/* <Image src="/assets/heart.svg" width="100" height="100" alt="Profile Picture" /> */}
      
    </div>

    
    <div className="mt-8 w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
      <form>
        
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name='fullName'
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>

        
        <div className="mb-4">
          <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
            Bio
          </label>
          <input
            type="text"
            id="bio"
            name='bio'
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a short bio"
          />
        </div>

        
        <div className="mb-4">
          <label htmlFor="gender" className="block text-gray-700 font-medium mb-2">
            Gender
          </label>
          <input
            type="text"
            id="gender"
            name='gender'
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your gender"
          />
        </div>

        
        <div className="mb-4">
          <label htmlFor="about" className="block text-gray-700 font-medium mb-2">
            About
          </label>
          <textarea
            id="about"
            rows="4"
            name='about'
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write about yourself"
          ></textarea>
        </div>

        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name='email'
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        
        <div className="mb-4">
          <label htmlFor="dob" className="block text-gray-700 font-medium mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            name='dob'
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        
        <div className="mb-6">
          <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name='location'
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your location"
          />
        </div>

        
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </form>
    </div>
  </div>
);
}
  

export default EditProfile