
export default function Sidebar({ community }) {
  return (
    <div className="space-y-4">
      {community ? (
        <div className="bg-white rounded-md shadow-sm overflow-hidden">
          <div className="bg-reddit-blue h-12"></div>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-3">About r/{community.name}</h2>
            <p className="text-sm text-gray-700 mb-4">{community.description || 'Community description'}</p>
            
            <div className="flex items-center mb-3">
              <div className="text-sm">
                <div className="font-medium">{community.members || 0}</div>
                <div className="text-gray-500">Members</div>
              </div>
              <div className="ml-6 text-sm">
                <div className="font-medium">{community.online || 0}</div>
                <div className="text-gray-500">Online</div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="text-xs text-gray-500">
                Created {new Date(community.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <button className="w-full mt-4 bg-reddit-blue hover:bg-blue-600 text-white font-bold py-2 rounded-full transition duration-200">
              Join
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow-sm p-4">
          <h2 className="text-lg font-medium mb-4">About Reddit Clone</h2>
          <p className="text-sm text-gray-700 mb-4">
            Reddit Clone is a community of communities where people can dive into their interests, hobbies and passions.
          </p>
          <button className="w-full bg-reddit-blue hover:bg-blue-600 text-white font-bold py-2 rounded-full transition duration-200">
            Create Post
          </button>
          <button className="w-full mt-2 bg-white hover:bg-gray-100 text-reddit-blue font-bold py-2 rounded-full border border-reddit-blue transition duration-200">
            Create Community
          </button>
        </div>
      )}
      
      <div className="bg-white rounded-md shadow-sm p-4">
        <h3 className="text-base font-medium mb-3">Rules</h3>
        <ol className="list-decimal list-inside text-sm space-y-2">
          <li className="text-gray-700">Remember the human</li>
          <li className="text-gray-700">Behave like you would in real life</li>
          <li className="text-gray-700">Look for the original source of content</li>
          <li className="text-gray-700">Search for duplicates before posting</li>
          <li className="text-gray-700">Read the community's rules</li>
        </ol>
      </div>
      
      <div className="bg-white rounded-md shadow-sm p-4">
        <h3 className="text-base font-medium mb-3">Popular Communities</h3>
        <ul className="text-sm space-y-2">
          <li><a href="/r/programming" className="text-blue-600 hover:underline">r/programming</a></li>
          <li><a href="/r/webdev" className="text-blue-600 hover:underline">r/webdev</a></li>
          <li><a href="/r/reactjs" className="text-blue-600 hover:underline">r/reactjs</a></li>
          <li><a href="/r/javascript" className="text-blue-600 hover:underline">r/javascript</a></li>
          <li><a href="/r/nextjs" className="text-blue-600 hover:underline">r/nextjs</a></li>
        </ul>
      </div>
      
      <div className="text-xs text-gray-500 p-2">
        <div className="flex flex-wrap gap-x-2">
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
        <div className="mt-2">
          Reddit Clone © 2023. All rights reserved
        </div>
      </div>
    </div>
  )
}
