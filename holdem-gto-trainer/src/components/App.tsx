// This file is dedicated to be the user sign up form for holdem-gto-trainer web app

// users will be able to sign up with their first name, last name, email, and phone number so that they can create a free account

/* this "landing page" will lead them to the main screen of the application which will quiz them pre-flop strategy in RFI and
whether they should call, raise, or fold to another players pre-flop action */



import { createClient } from "@supabase/supabase-js";
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from "react";
import './App.css'
import './Cards.tsx'
import './mainScreen.tsx'


const supabase = createClient('https://cjzibmypbfgceswnaxhe.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqemlibXlwYmZnY2Vzd25heGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1ODgzMzgsImV4cCI6MjA1MDE2NDMzOH0.W1jgE910omAlBfgA36s3juHfHbr2ltlg0hel2HD960M')



type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string
}

export default function App() {
  var { register, handleSubmit } = useForm<FormValues>();
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    preferredStack: '',
    gameType: ''
  })

  useEffect(() => {
    // Initial fetch
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      setUserData(data)
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const loadUserPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('username, preferred_stack, game_type')
          .eq('user_id', user.id)
          .single()

        if (data && !error) {
          setFormData({
            username: data.username || '',
            preferredStack: data.preferred_stack || '',
            gameType: data.game_type || ''
          })
        }
      }
    }

    loadUserPreferences()
  }, [])

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { error } = await supabase
      .from('users')
      .insert([data]);
  }

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          username: formData.username,
          preferred_stack: formData.preferredStack,
          game_type: formData.gameType
        })

      if (error) console.error('Error updating preferences:', error)
    }
  }

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