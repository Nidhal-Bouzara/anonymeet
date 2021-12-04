import React from 'react'
import faker from 'faker'

// styles
import sheet from '@styles/pages/chat.module.scss'

type Messages = { id: number | string, user: string, message: string, index: number }[]

interface Props {
  messages: Messages
}

const chat = ({ messages }: Props) => {
  return (
    <div>
      <ul className={sheet.chat_container}>
        {
          messages.map( message => (
            <li key={message.id}>
              <span><strong>{ message.user } </strong></span><span>{ message.message } - { message.index }</span>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export async function getStaticProps () {
  const messages: Messages = Array(25).fill({}).map((item, index) => ({ id: faker.datatype.uuid(), user: faker.name.findName(), message: faker.hacker.phrase(), index}))
  return { props: { messages } }
}

export default chat
