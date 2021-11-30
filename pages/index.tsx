import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

// styles
import sheet from '../styles/index.module.scss'

const validationSchema = yup.object({
  name: yup.string().required("This field is required"),
  password: yup.string().required("This field is required").min(5, "Password must be at least 5 characters"),
}).required()

// type FormValues = yup.InferType<typeof validationSchema>
type FormValues= any

const Home: NextPage = () => {
  const {register, formState: { errors, isSubmitting }, handleSubmit} = useForm<FormValues>({ resolver: yupResolver(validationSchema) })
  const [IsFormSubmitting, setIsFormSubmitting] = useState<boolean>(false)
  useEffect(() => {
    if (isSubmitting !== IsFormSubmitting) setIsFormSubmitting(isSubmitting)
  }, [isSubmitting, IsFormSubmitting])
  const handleFormSubmit = async (values: FormValues) => {
    await new Promise((res, rej) => {
      setTimeout(() => {
        alert(JSON.stringify(values))
        res(null)
      }, 2000);
    })
  }
  
  return (
    <main>
      <div className={sheet.background}>
        <div className={sheet.form_container}>
          <h2 className={sheet.title}>Log In</h2>
          <form className={sheet.form} onSubmit={handleSubmit(handleFormSubmit)}>
            <label>
              <input type="text" placeholder=" " {...register('name', { required: "This field is required" })} />
              <span>User Name</span>
            </label>
            { errors.name && <div className={sheet.error}><span>!</span><span>{ errors.name.message }</span></div> }
            <label>
              <input type="password" placeholder=" " {...register('password', { required: "This field is required", minLength: { value: 5, message: "Minimum password length is 5" } })} />
              <span>Password</span>
            </label>
            { errors.password && <div className={sheet.error}><span>!</span><span>{errors.password.message}</span></div> }
            <button type="submit" disabled={IsFormSubmitting}>{ !IsFormSubmitting ? "Log In" : "Loading"}</button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Home
