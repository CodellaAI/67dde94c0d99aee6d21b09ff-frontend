
import PostsList from '@/components/PostsList'
import Sidebar from '@/components/Sidebar'
import CommunityBar from '@/components/CommunityBar'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
      <div className="md:w-8/12">
        <div className="mb-4">
          <div className="bg-white rounded-md shadow p-3 flex">
            <div className="flex space-x-4 w-full">
              <button className="px-4 py-2 font-medium text-gray-500 hover:bg-gray-50 rounded-full">Best</button>
              <button className="px-4 py-2 font-medium text-gray-500 hover:bg-gray-50 rounded-full">Hot</button>
              <button className="px-4 py-2 font-medium text-gray-500 hover:bg-gray-50 rounded-full">New</button>
              <button className="px-4 py-2 font-medium text-gray-500 hover:bg-gray-50 rounded-full">Top</button>
              <button className="px-4 py-2 font-medium text-gray-500 hover:bg-gray-50 rounded-full">Rising</button>
            </div>
          </div>
        </div>
        <PostsList />
      </div>
      <div className="md:w-4/12 space-y-4">
        <CommunityBar />
        <Sidebar />
      </div>
    </div>
  )
}
