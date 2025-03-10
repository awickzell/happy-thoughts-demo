import { useState, useEffect } from "react"
import { PostMessage } from "./components/PostMessage"
import { MessageList } from "./components/MessageList"

export const App = () => {
  const [loading, setLoading] = useState(false) 
  const [messageList, setMessageList] = useState([]) 


  const fetchPosts = () => {
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/thoughts`)
      .then((res) => res.json())
      .then((data) => setMessageList(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))
  }
  useEffect(() => {
    fetchPosts()
  }, [])

  const addNewPost = (newMessage) => {
    setMessageList([newMessage, ...messageList])
  }
  return (
    <>
      <PostMessage newMessage={addNewPost} fetchPosts={fetchPosts} />
      <MessageList
        loading={loading}
        messageList={messageList}
        setMessageList={setMessageList}
        fetchPosts={fetchPosts}
      />
    </>
  )
}
