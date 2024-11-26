// This file is dedicated to be the user sign up form for holdem-gto-trainer web app

// users will be able to sign up with their first name, last name, email, and phone number so that they can create a free account

/* this "landing page" will lead them to the main screen of the application which will quiz them pre-flop strategy in RFI and
whether they should call, raise, or fold to another players pre-flop action */




import { SubmitHandler, useForm } from 'react-hook-form'
import './App.css'
import './Cards.tsx'
import './mainScreen.tsx'

import { SubmitHandler, useForm } from 'react-hook-form';
import './App.css';
import './Cards.tsx';
import './mainScreen.tsx';
type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string
  phoneNumber: string;
};

export default function App() {
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = data => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-8 space-y-6">
      <div className="space-y-2">
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          {...register("firstName")}
          id="firstName"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your first name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          {...register("lastName")}
          id="lastName"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your last name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          id="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your email"
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit
      </button>
      <div className="space-y-2">
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          {...register("phoneNumber")}
          id="phoneNumber"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your phone number"
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
  )};