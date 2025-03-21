
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FaReddit, FaSearch, FaPlus, FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from './AuthProvider'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <FaReddit className="text-reddit-orange text-3xl" />
          <span className="font-bold text-xl hidden sm:inline">reddit clone</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search Reddit"
              className="w-full bg-gray-100 border border-gray-200 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-1 focus:ring-reddit-blue focus:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </form>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <Link href="/submit" className="hidden sm:flex items-center space-x-1 p-2 text-gray-500 hover:bg-gray-100 rounded-md">
                <FaPlus className="text-gray-500" />
                <span className="font-medium">Create</span>
              </Link>
              
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <FaBell className="text-xl" />
              </button>
              
              <div className="relative">
                <button 
                  className="flex items-center space-x-1 p-1 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {user.avatar ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image 
                        src={user.avatar} 
                        alt={user.username} 
                        width={32} 
                        height={32} 
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <FaUserCircle className="text-3xl text-gray-500" />
                  )}
                  <span className="hidden md:inline font-medium">{user.username}</span>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link 
                      href={`/profile/${user.username}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <FaSignOutAlt className="mr-2" />
                        Log Out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login" className="btn-secondary py-1.5 px-4">
                Log In
              </Link>
              <Link href="/signup" className="btn-primary py-1.5 px-4">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
