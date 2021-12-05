import React, { useEffect } from 'react'
import faker from 'faker'

// styles
import sheet from '@styles/pages/chat.module.scss'
import { useForm } from 'react-hook-form'
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import Axios from 'axios'
import { User } from '.prisma/client'
import _ from 'lodash'
import { getMessages, getMessagesFromDB } from '@controllers/MessageController'

export type Message = { id: number, message: string, user_id: number, user: Omit<User, 'password'>, created_at: string, updated_at: string }
type FormValues = Partial<Message>
interface Props {
  messages: Message[]
}



const Chat: NextPage<Props> = ({ messages }) => {
  const { register, formState: { isSubmitting }, handleSubmit } = useForm<FormValues>({ defaultValues:{ message: '' } })
  useEffect(() => {
    Axios.post('api/message', { message: 'First message!' })
  }, [])

  const submitMessage = (values: FormValues) => {
    if (values.message!.trim() === '') return
  }

  return (
    <main>
      <ul className={sheet.chat_container}>
        {
          messages.map( message => (
            <li key={message.id}>
              <span><strong>{ message.user } </strong></span><span>{ message.message } - { message.index }</span>
            </li>
          ))
        }
      </ul>
      <div>
        <form ></form>
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<Props | {}> = async (ctx: GetServerSidePropsContext) => {
  // !todo: Implement auth logic
  const session = {}
  if (session === null) return ({ redirect: { destination: '/', permanent: false } })
  else return { props: { messages: await getMessagesFromDB() } }
}

export default Chat
