// import React from 'react';
// import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form'
import './App.css'
import './Cards.tsx'
import './mainScreen.tsx'

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string
};


export default function App() {
  // const [state, setState] = useState(initialValue);
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = data => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstName")} />
      <input {...register("lastName")} />
      <input type="email" {...register("email")} />

      <input type="submit" />
    </form>
  );
}