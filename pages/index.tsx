import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

// form imports
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

// next imports
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'

// styles
import sheet from '@styles/pages/index.module.scss'
import _ from 'lodash'

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
      // !todo: Implement auth logic
    } catch (e) {
      toast.error(`ERROR: Unexpected error occured, please try again.`)
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
  // !todo: Implement auth logic
  const session = {}
  if (session !== null) return { redirect: { destination: '/chat', permanent: false } }
  else return { props: {} }
}

export default Home
