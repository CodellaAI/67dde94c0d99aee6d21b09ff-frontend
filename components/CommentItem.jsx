
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { FaArrowUp, FaArrowDown, FaReply, FaEdit, FaTrash, FaUserCircle } from 'react-icons/fa'
import axios from 'axios'
import { useAuth } from './AuthProvider'

export default function CommentItem({ comment, postId, onAddReply, depth = 0 }) {
  const { user } = useAuth()
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [editContent, setEditContent] = useState(comment.content)
  const [voteStatus, setVoteStatus] = useState(comment.userVote || 0)
  const [voteCount, setVoteCount] = useState(comment.voteCount || 0)
  const [isDeleted, setIsDeleted] = useState(comment.isDeleted || false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReplies, setShowReplies] = useState(depth < 3) // Auto-expand first 3 levels
  
  const isAuthor = user && comment.author._id === user._id
  const maxDepth = 5 // Maximum nesting level

  const handleVote = async (value) => {
    if (!user) return

    try {
      // If user clicks the same vote button again, remove the vote
      const newVoteValue = voteStatus === value ? 0 : value

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comments/${comment._id}/vote`, {
        vote: newVoteValue
      }, {
        withCredentials: true
      })

      // Update local state
      const voteChange = newVoteValue - voteStatus
      setVoteStatus(newVoteValue)
      setVoteCount(prevCount => prevCount + voteChange)
    } catch (error) {
      console.error('Error voting on comment:', error)
    }
  }

  const handleSubmitReply = async (e) => {
    e.preventDefault()
    if (!replyContent.trim()) return
    
    try {
      setIsSubmitting(true)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
        postId,
        content: replyContent,
        parentId: comment._id
      }, {
        withCredentials: true
      })
      
      onAddReply(response.data)
      setReplyContent('')
      setIsReplying(false)
      setShowReplies(true) // Show replies after adding a new one
    } catch (err) {
      console.error('Error posting reply:', err)
      alert('Failed to post reply. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    if (!editContent.trim()) return
    
    try {
      setIsSubmitting(true)
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/comments/${comment._id}`, {
        content: editContent
      }, {
        withCredentials: true
      })
      
      comment.content = editContent
      setIsEditing(false)
    } catch (err) {
      console.error('Error editing comment:', err)
      alert('Failed to edit comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/comments/${comment._id}`, {
        withCredentials: true
      })
      
      setIsDeleted(true)
    } catch (err) {
      console.error('Error deleting comment:', err)
      alert('Failed to delete comment. Please try again.')
    }
  }

  if (isDeleted) {
    return (
      <div className="pl-2 border-l-2 border-gray-200">
        <div className="p-3 text-gray-500 italic">
          [deleted]
        </div>
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 pl-6">
            {comment.replies.map(reply => (
              <CommentItem 
                key={reply._id} 
                comment={reply} 
                postId={postId}
                onAddReply={onAddReply}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`${depth > 0 ? 'pl-2 border-l-2 border-gray-200' : ''}`}>
      <div className="flex">
        {/* Vote buttons */}
        <div className="flex flex-col items-center mr-2">
          <button 
            className={`p-1 rounded-sm ${voteStatus === 1 ? 'text-reddit-orange' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => handleVote(1)}
          >
            <FaArrowUp className="text-sm" />
          </button>
          
          <span className={`text-xs font-bold my-0.5 ${
            voteStatus === 1 ? 'text-reddit-orange' : 
            voteStatus === -1 ? 'text-blue-600' : 
            'text-gray-600'
          }`}>
            {voteCount}
          </span>
          
          <button 
            className={`p-1 rounded-sm ${voteStatus === -1 ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => handleVote(-1)}
          >
            <FaArrowDown className="text-sm" />
          </button>
        </div>
        
        {/* Comment content */}
        <div className="flex-1">
          {/* Comment metadata */}
          <div className="flex items-center text-xs text-gray-500 mb-1">
            <div className="flex items-center">
              {comment.author.avatar ? (
                <div className="w-5 h-5 rounded-full overflow-hidden mr-1">
                  <Image 
                    src={comment.author.avatar} 
                    alt={comment.author.username}
                    width={20}
                    height={20}
                    className="object-cover"
                  />
                </div>
              ) : (
                <FaUserCircle className="w-5 h-5 mr-1 text-gray-400" />
              )}
              <Link href={`/profile/${comment.author.username}`} className="font-medium hover:underline">
                {comment.author.username}
              </Link>
            </div>
            <span className="mx-1">•</span>
            <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
            {comment.isEdited && (
              <>
                <span className="mx-1">•</span>
                <span className="italic">edited</span>
              </>
            )}
          </div>
          
          {/* Comment content */}
          {isEditing ? (
            <form onSubmit={handleSubmitEdit} className="mt-2">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-reddit-blue min-h-[80px]"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
              ></textarea>
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  type="button"
                  className="px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-sm text-white bg-reddit-blue hover:bg-blue-600 rounded-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-gray-800 mb-2">
              {comment.content}
            </div>
          )}
          
          {/* Comment actions */}
          {!isEditing && (
            <div className="flex items-center text-xs text-gray-500">
              <button 
                className="flex items-center mr-4 hover:bg-gray-100 p-1 px-2 rounded"
                onClick={() => setIsReplying(!isReplying)}
              >
                <FaReply className="mr-1" />
                <span>Reply</span>
              </button>
              
              {isAuthor && (
                <>
                  <button 
                    className="flex items-center mr-4 hover:bg-gray-100 p-1 px-2 rounded"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit className="mr-1" />
                    <span>Edit</span>
                  </button>
                  
                  <button 
                    className="flex items-center hover:bg-gray-100 p-1 px-2 rounded text-red-500"
                    onClick={handleDelete}
                  >
                    <FaTrash className="mr-1" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          )}
          
          {/* Reply form */}
          {isReplying && (
            <form onSubmit={handleSubmitReply} className="mt-3">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-reddit-blue min-h-[80px]"
                placeholder="What are your thoughts?"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                required
              ></textarea>
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  type="button"
                  className="px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-sm text-white bg-reddit-blue hover:bg-blue-600 rounded-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Replying...' : 'Reply'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {depth < maxDepth ? (
            <>
              {!showReplies && (
                <button
                  className="ml-8 text-xs text-reddit-blue hover:text-blue-700 font-medium"
                  onClick={() => setShowReplies(true)}
                >
                  Show {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </button>
              )}
              
              {showReplies && (
                <div className="pl-6 mt-2">
                  {comment.replies.map(reply => (
                    <CommentItem 
                      key={reply._id} 
                      comment={reply} 
                      postId={postId}
                      onAddReply={onAddReply}
                      depth={depth + 1}
                    />
                  ))}
                  
                  {showReplies && (
                    <button
                      className="text-xs text-gray-500 hover:text-gray-700 mt-1"
                      onClick={() => setShowReplies(false)}
                    >
                      Hide replies
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="ml-8 mt-2">
              <button
                className="text-xs text-reddit-blue hover:text-blue-700 font-medium"
                onClick={() => window.location.href = `/post/${postId}?comment=${comment._id}`}
              >
                Continue this thread
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
