import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Axios from 'axios'
import router from 'next/router'

// form imports
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

// next imports
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'

// styles
import sheet from '@styles/pages/index.module.scss'
import _ from 'lodash'
import { getSession } from '@utils/Auth/simpleAuth'

const validationSchema = yup.object({
  username: yup.string().required("This field is required"),
  password: yup.string().required("This field is required").min(5, "Password must be at least 5 characters"),
}).required()

interface FormValues {
  username: string
  password: string
}

const Home: NextPage = () => {
  const {register, formState: { errors, isSubmitting }, handleSubmit} = useForm<FormValues>({ resolver: yupResolver(validationSchema) })
  const [IsFormSubmitting, setIsFormSubmitting] = useState<boolean>(false)
  useEffect(() => {
    if (isSubmitting !== IsFormSubmitting) setIsFormSubmitting(isSubmitting)
  }, [isSubmitting, IsFormSubmitting])
  
  const handleFormSubmit = async (values: FormValues) => {
    try {
      const res = await Axios.post('api/login', { ...values, redirectUrl: '/chat' })
      toast.success('SUCCESS: Redirecting...')
      if ( res.status === 200 ) router.push('/chat')
    } catch (e) {
      toast.error(`ERROR: Authentication failure, please try again` + (e as any))
    }
  }
  
  return (
    <main>
      <div className={sheet.background}>
        <div className={sheet.form_container}>
          <h2 className={sheet.title}>Log In</h2>
          <form className={sheet.form} onSubmit={handleSubmit(handleFormSubmit)}>
            <label>
              <input type="text" placeholder=" " {...register('username', { required: "This field is required" })} />
              <span>User Name</span>
            </label>
            { errors.username && <div className={sheet.error}><span>!</span><span>{ errors.username.message }</span></div> }
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

export const getServerSideProps: GetServerSideProps<{}> = async (ctx: GetServerSidePropsContext) => {
  const user = await getSession(ctx.req, ctx.res)
  if (!user) return { props: {} }
  else return { redirect: { destination: '/chat', permanent: false } }
}

export default Home
