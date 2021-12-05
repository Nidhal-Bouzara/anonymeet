import React, { useEffect, useState } from 'react'
import faker from 'faker'

// styles
import sheet from '@styles/pages/chat.module.scss'
import { useForm } from 'react-hook-form'
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next'
import Axios from 'axios'
import { User } from '.prisma/client'
import _ from 'lodash'
import { getMessages, getMessagesFromDB, POST_MESSAGE_RES } from '@controllers/MessageController'
import { DateTime } from 'luxon'
import { toast } from 'react-toastify'
import { Message } from '@prisma/client'

type MessageWithUser = Message & { user: Pick<User, 'username'> }
type FormValues = Partial<MessageWithUser>

interface Props {
  messages: MessageWithUser[],
  cursor?: number
}

const Chat: NextPage<Props> = ({ messages, cursor }) => {
  const { register, reset, setValue, formState: { isSubmitting }, handleSubmit } = useForm<FormValues>({ defaultValues:{ message: '' } })
  const [Messages, setMessages] = useState<MessageWithUser[]>([])

  useEffect(() => {
    setMessages(messages)
  }, [messages])

  const submitMessage = async (values: FormValues) => {
    if (values.message!.trim() === '') return
    const message = ((await Axios.post('/api/message/1', values)).data as POST_MESSAGE_RES).message
    setMessages([ ...Messages, message ])
    reset()
  }

  return (
    <main className={sheet.container}>
      <div className={sheet.chat_scroll_container}>
        <ul className={sheet.chat_container}>
          {
            Messages.map( message => (
              <li key={message.id}>
                <span><strong>{ message.user.username }: </strong></span><span>{ message.message } - { message.id }</span>
              </li>
            ))
          }
        </ul>
      </div>
      <div>
        <form className={sheet.chat_form} onSubmit={ handleSubmit(submitMessage) }>
          <textarea className={sheet.chat_box} onKeyPress={(e) => e.key === 'Enter' && handleSubmit(submitMessage)()} {...register('message')}/>
          <button className={sheet.submit_message} type="button" onClick={() => { setValue('message', faker.hacker.phrase()) }}>Generate Hacker Text</button>
          <button className={sheet.submit_message} type="submit">submit</button>
        </form>
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<Props | {}> = async (ctx: GetServerSidePropsContext) => {
  // !todo: Implement auth logic
  const session = {}
  if (session === null) return ({ redirect: { destination: '/', permanent: false } })
  const messages = (await getMessagesFromDB()).map(item => ({...item, created_at: DateTime.fromJSDate(item.created_at).toString(), updated_at: DateTime.fromJSDate(item.updated_at).toString()}))
  return { props: { messages, cursor: 1 } }
}

export default Chat
