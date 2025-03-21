
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from './AuthProvider'
import CommentItem from './CommentItem'
import LoadingSpinner from './LoadingSpinner'

export default function CommentSection({ postId }) {
  const { user } = useAuth()
  const router = useRouter()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comments/post/${postId}`)
        setComments(response.data)
      } catch (err) {
        console.error('Error fetching comments:', err)
        setError('Failed to load comments. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchComments()
    }
  }, [postId])

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    
    if (!user) {
      router.push('/login')
      return
    }

    if (!newComment.trim()) return
    
    try {
      setIsSubmitting(true)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
        postId,
        content: newComment,
        parentId: null
      }, {
        withCredentials: true
      })
      
      setComments(prevComments => [response.data, ...prevComments])
      setNewComment('')
    } catch (err) {
      console.error('Error posting comment:', err)
      alert('Failed to post comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddReply = (newReply) => {
    setComments(prevComments => {
      // If it's a reply to a top-level comment, add it to the replies array
      if (newReply.parentId) {
        return prevComments.map(comment => {
          if (comment._id === newReply.parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            }
          }
          return comment
        })
      }
      // Otherwise it's a new top-level comment
      return [newReply, ...prevComments]
    })
  }

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <h3 className="text-lg font-medium mb-4">Comments</h3>
      
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-reddit-blue min-h-[100px]"
            placeholder="What are your thoughts?"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          ></textarea>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-md text-center">
          <p className="mb-2">Log in or sign up to leave a comment</p>
          <div className="flex justify-center space-x-2">
            <button 
              onClick={() => router.push('/login')}
              className="btn-secondary py-1.5 px-4"
            >
              Log In
            </button>
            <button 
              onClick={() => router.push('/signup')}
              className="btn-primary py-1.5 px-4"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          {error}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map(comment => (
            <CommentItem 
              key={comment._id} 
              comment={comment} 
              postId={postId}
              onAddReply={handleAddReply}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No comments yet. Be the first to share what you think!
        </div>
      )}
    </div>
  )
}
