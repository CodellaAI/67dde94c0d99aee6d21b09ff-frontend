
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import PostsList from '@/components/PostsList'
import CommunityHeader from '@/components/CommunityHeader'
import Sidebar from '@/components/Sidebar'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function CommunityPage() {
  const [community, setCommunity] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const params = useParams()
  const communityName = params.community

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setLoading(true)
        const [communityRes, postsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/communities/${communityName}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/community/${communityName}`)
        ])
        setCommunity(communityRes.data)
        setPosts(postsRes.data)
      } catch (err) {
        console.error('Error fetching community data:', err)
        setError('Failed to load community. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (communityName) {
      fetchCommunityData()
    }
  }, [communityName])

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

  return (
    <div>
      {community && <CommunityHeader community={community} />}
      
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        <div className="md:w-8/12">
          <div className="mb-4">
            <div className="bg-white rounded-md shadow p-3 flex">
              <div className="flex space-x-4 w-full">
                <button className="px-4 py-2 font-medium text-gray-500 hover:bg-gray-50 rounded-full">Hot</button>
                <button className="px-4 py-2 font-medium text-gray-500 hover:bg-gray-50 rounded-full">New</button>
                <button className="px-4 py-2 font-medium text-gray-500 hover:bg-gray-50 rounded-full">Top</button>
              </div>
            </div>
          </div>
          
          {posts.length > 0 ? (
            <PostsList posts={posts} />
          ) : (
            <div className="bg-white rounded-md shadow-sm p-8 text-center">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No posts yet</h3>
              <p className="text-gray-500">Be the first to post in r/{communityName}</p>
            </div>
          )}
        </div>
        
        <div className="md:w-4/12">
          <Sidebar community={community} />
        </div>
      </div>
    </div>
  )
}
