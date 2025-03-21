
import { FaReddit } from 'react-icons/fa'

export default function CommunityHeader({ community }) {
  return (
    <div className="bg-white shadow-sm mb-4">
      <div className="h-20 bg-reddit-blue"></div>
      <div className="container mx-auto px-4">
        <div className="flex items-center -mt-4 pb-4">
          <div className="mr-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-white">
              <FaReddit className="text-reddit-orange text-4xl" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">r/{community.name}</h1>
            <p className="text-sm text-gray-500">r/{community.name}</p>
          </div>
          <div>
            <button className="btn-primary">Join</button>
          </div>
        </div>
      </div>
    </div>
  )
}
