
import Link from 'next/link'
import { FaReddit } from 'react-icons/fa'

export default function CommunityBar() {
  // This would typically come from an API call
  const communities = [
    { name: 'programming', members: 4200000 },
    { name: 'webdev', members: 1200000 },
    { name: 'reactjs', members: 350000 },
    { name: 'javascript', members: 2100000 },
    { name: 'nextjs', members: 180000 },
  ]

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <h2 className="text-base font-medium mb-4">Top Communities</h2>
      
      <div className="space-y-3">
        {communities.map((community, index) => (
          <Link 
            key={community.name} 
            href={`/r/${community.name}`}
            className="flex items-center hover:bg-gray-50 p-2 rounded-md transition-colors"
          >
            <span className="text-gray-500 font-medium mr-4">{index + 1}</span>
            <FaReddit className="text-reddit-orange text-2xl mr-2" />
            <div className="flex-1">
              <div className="font-medium">r/{community.name}</div>
              <div className="text-xs text-gray-500">
                {new Intl.NumberFormat().format(community.members)} members
              </div>
            </div>
            <button className="text-xs font-bold bg-reddit-blue hover:bg-blue-600 text-white py-1 px-4 rounded-full">
              Join
            </button>
          </Link>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 text-reddit-blue font-medium hover:bg-gray-50 rounded-md transition-colors">
        View All
      </button>
    </div>
  )
}
