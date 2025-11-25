'use client'

import { useEffect, useRef } from 'react'
import { setCookie } from '@/lib/utils/cookies'

/**
 * Component to sync userId from localStorage to cookies
 * This allows server components to access userId via cookies
 */
export function SyncUserCookie() {
  const hasSynced = useRef(false)

  useEffect(() => {
    // Prevent double execution in development mode
    if (hasSynced.current) return
    hasSynced.current = true

    // Sync userId from localStorage to cookies on mount
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId')
      const token = localStorage.getItem('token')
      
      if (userId) {
        setCookie('userId', userId, 30)
      }
      if (token) {
        setCookie('token', token, 30)
      }
    }
  }, [])

  return null // This component doesn't render anything
}

