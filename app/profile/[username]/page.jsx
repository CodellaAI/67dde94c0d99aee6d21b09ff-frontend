
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import PostsList from '@/components/PostsList'
import LoadingSpinner from '@/components/LoadingSpinner'
import { FaUserCircle, FaCalendarAlt } from 'react-icons/fa'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const params = useParams()
  const username = params.username

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const [userRes, postsRes, commentsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/user/${username}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comments/user/${username}`)
        ])
        setUser(userRes.data)
        setPosts(postsRes.data)
        setComments(commentsRes.data)
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError('Failed to load user profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchUserData()
    }
  }, [username])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          {error}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4">
          User not found.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center">
          <div className="flex-shrink-0 -mt-16 sm:-mt-14 mb-4 sm:mb-0 sm:mr-6">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white bg-white">
              {user.avatar ? (
                <Image 
                  src={user.avatar} 
                  alt={user.username} 
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <FaUserCircle className="text-gray-400 w-full h-full" />
                </div>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <FaCalendarAlt className="mr-1" />
              <span>Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
            </div>
            <div className="flex mt-3 space-x-4">
              <div>
                <span className="font-bold">{user.karma || 0}</span> karma
              </div>
              <div>
                <span className="font-bold">{posts.length}</span> posts
              </div>
              <div>
                <span className="font-bold">{comments.length}</span> comments
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'posts' ? 'text-reddit-blue border-b-2 border-reddit-blue' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('posts')}
            >
              Posts
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'comments' ? 'text-reddit-blue border-b-2 border-reddit-blue' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('comments')}
            >
              Comments
            </button>
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'posts' && (
            posts.length > 0 ? (
              <PostsList posts={posts} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No posts yet
              </div>
            )
          )}

          {activeTab === 'comments' && (
            comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment._id} className="border border-gray-200 rounded-md p-4">
                    <div className="text-xs text-gray-500 mb-1">
                      Commented on <a href={`/post/${comment.post._id}`} className="text-reddit-blue hover:underline">{comment.post.title}</a>
                    </div>
                    <div className="text-gray-800">{comment.content}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No comments yet
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
