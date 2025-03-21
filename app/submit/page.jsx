
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useForm } from 'react-hook-form'

export default function SubmitPost() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [postType, setPostType] = useState('text')
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        ...data,
        type: postType
      }, {
        withCredentials: true
      })

      router.push(`/post/${response.data._id}`)
    } catch (error) {
      console.error('Error submitting post:', error)
      alert('Failed to submit post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Create a post</h1>
      
      <div className="bg-white rounded-md shadow-sm p-4 mb-4">
        <div className="flex border-b pb-4 mb-4">
          <button 
            className={`mr-4 py-2 px-4 font-medium rounded-full ${postType === 'text' ? 'bg-reddit-blue text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setPostType('text')}
          >
            Post
          </button>
          <button 
            className={`mr-4 py-2 px-4 font-medium rounded-full ${postType === 'image' ? 'bg-reddit-blue text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setPostType('image')}
          >
            Image
          </button>
          <button 
            className={`py-2 px-4 font-medium rounded-full ${postType === 'link' ? 'bg-reddit-blue text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setPostType('link')}
          >
            Link
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Title"
              className="input-field"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>
          
          <div className="mb-4">
            <select 
              className="input-field"
              {...register("community", { required: "Community is required" })}
            >
              <option value="">Select a community</option>
              <option value="programming">r/programming</option>
              <option value="webdev">r/webdev</option>
              <option value="reactjs">r/reactjs</option>
              <option value="javascript">r/javascript</option>
              <option value="nextjs">r/nextjs</option>
            </select>
            {errors.community && <p className="text-red-500 text-sm mt-1">{errors.community.message}</p>}
          </div>
          
          {postType === 'text' && (
            <div className="mb-4">
              <textarea
                placeholder="Text (optional)"
                className="input-field min-h-[200px]"
                {...register("content")}
              />
            </div>
          )}
          
          {postType === 'image' && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Image URL"
                className="input-field"
                {...register("imageUrl", { required: postType === 'image' ? "Image URL is required" : false })}
              />
              {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
            </div>
          )}
          
          {postType === 'link' && (
            <div className="mb-4">
              <input
                type="url"
                placeholder="URL"
                className="input-field"
                {...register("url", { 
                  required: postType === 'link' ? "URL is required" : false,
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                    message: "Please enter a valid URL"
                  }
                })}
              />
              {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>}
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="button"
              className="btn-secondary mr-2"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
