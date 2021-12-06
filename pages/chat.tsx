import React, { useEffect, useState } from 'react'
import faker from 'faker'

// styles
import sheet from '@styles/pages/chat.module.scss'
import { useForm } from 'react-hook-form'
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next'
import Axios from 'axios'
import { User } from '.prisma/client'
import _, { reverse } from 'lodash'
import { getMessages, getMessagesFromDB, POST_MESSAGE_RES } from '@controllers/MessageController'
import { DateTime } from 'luxon'
import { toast } from 'react-toastify'
import { Message } from '@prisma/client'
import { getSession, SessionUser } from '@utils/Auth/simpleAuth'
import { makeSerializable } from '@utils/common'

type MessageWithUser = Message & { user: Pick<User, 'username'> }
type FormValues = Partial<MessageWithUser>

interface Props {
  user: SessionUser
  messages: MessageWithUser[]
  cursor?: number
}

const Chat: NextPage<Props> = ({ user, messages, cursor }) => {
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
              <li className={sheet.message} key={message.id}>
                <div className={sheet.message_content}><span><strong>{ message.user.username }: </strong></span><span>{ message.message } - { message.id }</span></div><div className={sheet.message_info}>{ DateTime.fromISO(message.created_at as unknown as string).toFormat('yyyy LLL dd - HH:mm:ss') }</div>
              </li>
            ))
          }
        </ul>
      </div>
      <div>
        <form className={sheet.chat_form} onSubmit={ handleSubmit(submitMessage) }>
          <textarea className={sheet.chat_box} onKeyPress={(e) => e.key === 'Enter' && handleSubmit(submitMessage)()} {...register('message')}/>
          <button className={sheet.submit_message} type="button" onClick={() => { setValue('message', faker.hacker.phrase()) }}>Generate Hacker Text</button>
          <button className={sheet.submit_message} type="submit">Send</button>
        </form>
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<Props | {}> = async (ctx: GetServerSidePropsContext) => {
  const user = await getSession(ctx.req, ctx.res)
  if (!user) return { redirect: { destination: '/', permanent: false } }
  const messages = await getMessagesFromDB(0)
  return { props: makeSerializable({ user, messages, cursor: 0 }) }
}

export default Chat
