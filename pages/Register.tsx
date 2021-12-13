import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import * as yup from 'yup'

// styles
import sheet from '@styles/pages/Register.module.scss'
import axios from 'axios'
import { CHECK_IF_UNIQUE_RESPONSE, REGISTRATION_FORM_SCHEMA } from '@controllers/AuthController'
import { NextPage } from 'next'
import { toast } from 'react-toastify'
import router from 'next/router'

const validationSchema = yup.object({
  username: yup.string().required('This field is requried'),
  password: yup.string().required('This field is required').min(5, 'Minimum is 5 characters.')
})

const Register: NextPage = () => {
  const [FormIsSubmitting, setFormIsSubmitting] = useState<boolean>(false)
  const { register, formState: { isSubmitting, errors }, setError, handleSubmit } = useForm<REGISTRATION_FORM_SCHEMA>({ resolver: yupResolver(validationSchema) })

  useEffect(() => {
    if ( isSubmitting !== FormIsSubmitting ) setFormIsSubmitting(isSubmitting)
  }, [ isSubmitting, FormIsSubmitting ])

  const usernameIsUnqiue = async ( value: string | undefined) =>
  !((await axios.get(`api/user/check-if-unique/${value}`)).data as CHECK_IF_UNIQUE_RESPONSE).exists

  const handleFormSubmit = async (values: REGISTRATION_FORM_SCHEMA) => {
    try {
      if (!(await usernameIsUnqiue(values.username))) {
        setError('username', { message: 'A user with this name already exists.' })
        return;
      }
      await axios.post('/api/user/register', values)
      toast.success('SUCCESS: Registerd Account, logging in...')
      router.push('/chat')
    } catch (err) {
      toast.error('ERROR: An unxepected error occured, please try again.')
    }
  }
  return (
    <div className={sheet.background}>
      <div className={sheet.form_container}>
        <h2 className={sheet.title}>Register</h2>
        <form className={sheet.form} onSubmit={handleSubmit(handleFormSubmit)} >
          <label>
            <input type="text" placeholder=' ' {...register('username')} />
            <span>User Name</span>
          </label>
          { errors.username && <div className={sheet.error}><span>!</span><span>{ errors.username.message }</span></div> }
          <label>
            <input type="password" placeholder=' ' {...register('password')} />
            <span>Password</span>
          </label>
          { errors.password && <div className={sheet.error}><span>!</span><span>{ errors.password.message }</span></div> }
          <button type='submit' disabled={FormIsSubmitting}>{ FormIsSubmitting? 'Registering...' : 'Register' }</button>
        </form>
      </div>
    </div>
  )
}

export default Register
