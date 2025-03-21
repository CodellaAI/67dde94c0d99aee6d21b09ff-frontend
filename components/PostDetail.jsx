
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { FaArrowUp, FaArrowDown, FaCommentAlt, FaShare, FaBookmark, FaEdit, FaTrash } from 'react-icons/fa'
import axios from 'axios'
import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

export default function PostDetail({ post }) {
  const { user } = useAuth()
  const router = useRouter()
  const [voteStatus, setVoteStatus] = useState(post.userVote || 0)
  const [voteCount, setVoteCount] = useState(post.voteCount || 0)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const isAuthor = user && post.author._id === user._id

  const handleVote = async (value) => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      // If user clicks the same vote button again, remove the vote
      const newVoteValue = voteStatus === value ? 0 : value

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post._id}/vote`, {
        vote: newVoteValue
      }, {
        withCredentials: true
      })

      // Update local state
      const voteChange = newVoteValue - voteStatus
      setVoteStatus(newVoteValue)
      setVoteCount(prevCount => prevCount + voteChange)
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post._id}`, {
        withCredentials: true
      })
      router.push('/')
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post. Please try again.')
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-md shadow-sm mb-4">
      <div className="flex">
        {/* Vote buttons */}
        <div className="bg-gray-50 rounded-l-md p-2 flex flex-col items-center">
          <button 
            className={`p-1 rounded-sm ${voteStatus === 1 ? 'text-reddit-orange' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => handleVote(1)}
          >
            <FaArrowUp className="text-lg" />
          </button>
          
          <span className={`text-xs font-bold my-1 ${
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
            <FaArrowDown className="text-lg" />
          </button>
        </div>
        
        {/* Post content */}
        <div className="p-4 flex-1">
          {/* Post metadata */}
          <div className="flex items-center text-xs text-gray-500 mb-2">
            {post.community && (
              <>
                <Link href={`/r/${post.community}`} className="font-bold hover:underline">
                  r/{post.community}
                </Link>
                <span className="mx-1">•</span>
              </>
            )}
            <span>Posted by </span>
            <Link href={`/profile/${post.author.username}`} className="ml-1 hover:underline">
              u/{post.author.username}
            </Link>
            <span className="mx-1">•</span>
            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
          </div>
          
          {/* Post title */}
          <h1 className="text-xl font-semibold text-gray-900 mb-3">
            {post.title}
          </h1>
          
          {/* Post content based on type */}
          {post.type === 'text' && post.content && (
            <div className="text-gray-800 mb-4 prose max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          )}
          
          {post.type === 'image' && post.imageUrl && (
            <div className="mb-4">
              <div className="relative max-h-[600px] w-full overflow-hidden rounded-md">
                <Image 
                  src={post.imageUrl} 
                  alt={post.title}
                  width={800}
                  height={600}
                  className="object-contain mx-auto"
                />
              </div>
            </div>
          )}
          
          {post.type === 'link' && post.url && (
            <div className="mb-4">
              <a 
                href={post.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {post.url}
              </a>
            </div>
          )}
          
          {/* Post actions */}
          <div className="flex items-center text-gray-500 text-sm border-t border-gray-100 pt-3 mt-3">
            <div className="flex items-center mr-4 hover:bg-gray-100 p-1 px-2 rounded">
              <FaCommentAlt className="mr-1" />
              <span>{post.commentCount || 0} Comments</span>
            </div>
            
            <button className="flex items-center mr-4 hover:bg-gray-100 p-1 px-2 rounded">
              <FaShare className="mr-1" />
              <span>Share</span>
            </button>
            
            <button className="flex items-center mr-4 hover:bg-gray-100 p-1 px-2 rounded">
              <FaBookmark className="mr-1" />
              <span>Save</span>
            </button>

            {isAuthor && (
              <>
                <Link 
                  href={`/post/${post._id}/edit`} 
                  className="flex items-center mr-4 hover:bg-gray-100 p-1 px-2 rounded"
                >
                  <FaEdit className="mr-1" />
                  <span>Edit</span>
                </Link>
                
                <button 
                  className="flex items-center hover:bg-gray-100 p-1 px-2 rounded text-red-500"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <FaTrash className="mr-1" />
                  <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
