import React, { useEffect, useState, useCallback } from 'react'
import faker from 'faker'

// styles
import sheet from '@styles/pages/chat.module.scss'
import { useForm } from 'react-hook-form'
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import Axios from 'axios'
import { User } from '.prisma/client'
import _ from 'lodash'
import { getMessagesFromDB, GET_MESSAGE_RES, MessageWithUser, POST_MESSAGE_RES } from '@controllers/MessageController'
import { DateTime } from 'luxon'
import { toast } from 'react-toastify'
import { Message } from '@prisma/client'
import { getSession, SessionUser } from '@utils/Auth/simpleAuth'
import { makeSerializable } from '@utils/common'

type FormValues = Partial<MessageWithUser>

interface Props {
  user: SessionUser
  messages: MessageWithUser[]
  cursor: number
}

const Chat: NextPage<Props> = ({ user, messages, cursor }) => {
  const { register, reset, setValue, formState: { isSubmitting }, handleSubmit } = useForm<FormValues>({ defaultValues:{ message: '' } })
  const [Messages, setMessages] = useState<MessageWithUser[]>([])
  const [GettingMessages, setGettingMessages] = useState<boolean>(false)
  const [Cursor, setCursor] = useState<number>(cursor)
  const [LoadedAllMessages, setLoadedAllMessages] = useState<boolean>(false)

  useEffect(() => {
    setMessages(messages)
  }, [messages])

  useEffect(() => {
    if (!GettingMessages) return
    if (Cursor <= 1) return
    const ScrollContainer = document.getElementById("messages_scroller") as HTMLDivElement
    const current_scroll = Number((ScrollContainer).scrollTop)
    Axios.get(`/api/message/${Cursor}`)
      .then(({ data }) => {
        const { messages: new_messages, new_cursor } = data as GET_MESSAGE_RES
        setMessages([...new_messages, ...Messages])
        setCursor(new_cursor)
        setGettingMessages(false)
        if (new_cursor <= 1) setLoadedAllMessages(true)
        ScrollContainer.scrollTo({ top: current_scroll, behavior: 'smooth' })
      })
      .catch(err => {
        toast.error('ERROR: Could not load messages.')
      })
  }, [ GettingMessages ]) // ignore the dependency array warning, it's intentional

  const submitMessage = async (values: FormValues) => {
    if (values.message!.trim() === '') return
    const message = ((await Axios.post('/api/message/1', values)).data as POST_MESSAGE_RES).message
    setMessages([ ...Messages, message ])
    reset()
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const scrollable_height = Number((e.target as any).scrollHeight) - Number((e.target as any).clientHeight)
    if (Number(scrollable_height) - Number(-(e.target as any).scrollTop) < 600 && !GettingMessages && !LoadedAllMessages) setGettingMessages(true)
  }

  return (
    <main className={sheet.container}>
      <div id="messages_scroller" onScroll={handleScroll} className={sheet.chat_scroll_container}>
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
  return { props: makeSerializable({ user, messages, cursor: messages[ 0 ].id }) }
}

export default Chat
