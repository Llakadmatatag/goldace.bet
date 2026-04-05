'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { insforge } from '@/lib/insforge'
import type { UserSchema } from '@insforge/sdk'

interface Profile {
  id: string
  discord_id: string
  username: string
  avatar_url: string | null
  role?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: UserSchema | null
  profile: Profile | null
  loading: boolean
  signInWithDiscord: () => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSchema | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const hasInitialized = useRef(false)
  const tokenRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  
  const persistSession = (userData: UserSchema | null, profileData: Profile | null) => {
    if (userData && profileData) {
      try {
        localStorage.setItem('auth_session', JSON.stringify({
          user: userData,
          profile: profileData,
          timestamp: Date.now()
        }))
      } catch (err) {
        console.warn('Failed to persist session to localStorage:', err)
      }
    }
  }

  
  const restoreSession = (): { user: UserSchema | null; profile: Profile | null } | null => {
    try {
      const stored = localStorage.getItem('auth_session')
      if (stored) {
        const { user: storedUser, profile: storedProfile } = JSON.parse(stored)
        return { user: storedUser, profile: storedProfile }
      }
    } catch (err) {
      console.warn('Failed to restore session from localStorage:', err)
    }
    return null
  }

  
  const clearSession = () => {
    try {
      localStorage.removeItem('auth_session')
    } catch (err) {
      console.warn('Failed to clear session from localStorage:', err)
    }
  }

  
  const startTokenRefreshPolling = () => {
    if (tokenRefreshIntervalRef.current) {
      clearInterval(tokenRefreshIntervalRef.current)
    }

    tokenRefreshIntervalRef.current = setInterval(async () => {
      try {
        const { data } = await insforge.auth.getCurrentUser()
        if (!data?.user) {
          
          console.warn('Token validation failed - user session expired')
          setUser(null)
          setProfile(null)
          clearSession()
        }
      } catch (err) {
        console.warn('Token refresh polling error:', err)
      }
    }, 15 * 60 * 1000)
  }


  const stopTokenRefreshPolling = () => {
    if (tokenRefreshIntervalRef.current) {
      clearInterval(tokenRefreshIntervalRef.current)
      tokenRefreshIntervalRef.current = null
    }
  }

  const upsertProfile = async (userData: UserSchema): Promise<Profile> => {
    const discordProfile = userData.profile as any
    
    let discordId = userData.id
    
    if (discordProfile?.avatar_url) {
      const avatarUrlMatch = discordProfile.avatar_url.match(/cdn\.discordapp\.com\/avatars\/(\d+)/)
      if (avatarUrlMatch && avatarUrlMatch[1]) {
        discordId = avatarUrlMatch[1]
      }
    }
    
    if (discordProfile?.discord_id) {
      discordId = discordProfile.discord_id
    } else if (discordProfile?.sub) {
      discordId = discordProfile.sub
    }
    
    const username = discordProfile?.name || userData.email?.split('@')[0] || 'Unknown'
    const avatarUrl = discordProfile?.avatar_url || null

    const { data, error } = await insforge.database
      .from('profiles')
      .upsert({
        id: userData.id,
        discord_id: discordId,
        username: username,
        avatar_url: avatarUrl,
        role: 'user',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id',
        ignoreDuplicates: true
      })
      .select()
      .single()

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('Profile upsert error:', error)
        throw error
      }


      const { data: existingProfile, error: fetchError } = await insforge.database
        .from('profiles')
        .select('*')
        .eq('id', userData.id)
        .single()

      if (fetchError) {
        console.error('Profile fetch after upsert ignore error:', fetchError)
        throw fetchError
      }

      return existingProfile as Profile
    }

    return data as Profile
  }

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null)
      clearSession()
      return
    }

    try {
      const { data, error } = await insforge.database
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error)
        throw error
      }

      if (data) {
        setProfile(data as Profile)
        persistSession(user, data as Profile)
      } else {
        const newProfile = await upsertProfile(user)
        setProfile(newProfile)
        persistSession(user, newProfile)
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err)
    }
  }

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const initAuth = async () => {
      try {

        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.has('insforge_code')) {

          window.history.replaceState({}, document.title, window.location.pathname)
        }


        const restoredSession = restoreSession()
        if (restoredSession?.user && restoredSession?.profile) {
          setUser(restoredSession.user)
          setProfile(restoredSession.profile)
          setLoading(false)
          startTokenRefreshPolling()
          return
        }


        let { data } = await insforge.auth.getCurrentUser()
        const currentUser = data?.user ?? null

        if (currentUser) {
          setUser(currentUser)


          const { data: profileData, error } = await insforge.database
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single()

          if (profileData) {
            const profile = profileData as Profile
            setProfile(profile)
            persistSession(currentUser, profile)
          } else {
            const newProfile = await upsertProfile(currentUser)
            setProfile(newProfile)
            persistSession(currentUser, newProfile)
          }

          startTokenRefreshPolling()
        } else {
          clearSession()
        }
      } catch (err) {
        console.error('Auth init error:', err)
        clearSession()
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    return () => {
      stopTokenRefreshPolling()
    }
  }, [])

  const signInWithDiscord = async () => {
    try {
      await insforge.auth.signInWithOAuth({
        provider: 'discord',
        redirectTo: window.location.origin
      })
    } catch (err) {
      console.error('OAuth sign-in error:', err)
    }
  }

  const signOut = async () => {
    try {
      stopTokenRefreshPolling()
      await insforge.auth.signOut()
      setUser(null)
      setProfile(null)
      clearSession()
    } catch (err) {
      console.error('Sign out error:', err)

      setUser(null)
      setProfile(null)
      clearSession()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithDiscord,
        signOut,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}