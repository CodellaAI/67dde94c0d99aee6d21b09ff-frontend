
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import PostCard from './PostCard'
import LoadingSpinner from './LoadingSpinner'

export default function PostsList({ posts: initialPosts, communityName }) {
  const [posts, setPosts] = useState(initialPosts || [])
  const [loading, setLoading] = useState(!initialPosts)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (initialPosts) {
      setPosts(initialPosts)
      return
    }

    const fetchPosts = async () => {
      try {
        setLoading(true)
        const url = communityName 
          ? `${process.env.NEXT_PUBLIC_API_URL}/posts/community/${communityName}`
          : `${process.env.NEXT_PUBLIC_API_URL}/posts`
        
        const response = await axios.get(url)
        setPosts(response.data)
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError('Failed to load posts. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [initialPosts, communityName])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        {error}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-md shadow-sm p-8 text-center">
        <h3 className="text-xl font-medium text-gray-700 mb-2">No posts found</h3>
        <p className="text-gray-500">Be the first to create a post!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  )
}
