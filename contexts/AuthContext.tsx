'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi, AuthResponse } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'
import { userApi } from '@/lib/api/user'

interface AuthContextType {
    user: AuthResponse | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, fullName: string, phone?: string) => Promise<void>
    loginWithGoogle: (idToken: string) => Promise<void>
    loginWithFacebook: (accessToken: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = authApi.getToken()
        const userId = authApi.getUserId()

        if (token && userId) {
            // Load fresh profile from backend
            userApi.getProfile()
                .then((resp) => {
                    if (resp.success && resp.data) {
                        const profile = resp.data
                        const userData: AuthResponse = {
                            token,
                            refreshToken: localStorage.getItem('refreshToken') || '',
                            userId,
                            email: profile.email,
                            fullName: profile.fullName,
                            userType: profile.userType,
                        }
                        // persist commonly used fields
                        localStorage.setItem('email', profile.email || '')
                        localStorage.setItem('fullName', profile.fullName || '')
                        localStorage.setItem('userType', profile.userType || 'CUSTOMER')
                        setUser(userData)
                    } else {
                        // fallback to local storage data
                        const fallback: AuthResponse = {
                            token,
                            refreshToken: localStorage.getItem('refreshToken') || '',
                            userId,
                            email: localStorage.getItem('email') || '',
                            fullName: localStorage.getItem('fullName') || '',
                            userType: localStorage.getItem('userType') || 'CUSTOMER',
                        }
                        setUser(fallback)
                    }
                })
                .catch(() => {
                    // fallback to local storage data on error
                    const fallback: AuthResponse = {
                        token,
                        refreshToken: localStorage.getItem('refreshToken') || '',
                        userId,
                        email: localStorage.getItem('email') || '',
                        fullName: localStorage.getItem('fullName') || '',
                        userType: localStorage.getItem('userType') || 'CUSTOMER',
                    }
                    setUser(fallback)
                })
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password })
            if (response.success && response.data) {
                // fetch profile to enrich user info
                const redirectByRole = (role?: string) => {
                    switch ((role || '').toUpperCase()) {
                        case 'ADMIN':
                            router.push('/admin')
                            break
                        case 'SELLER':
                            router.push('/seller')
                            break
                        case 'SHIPPER':
                        case 'SHIP':
                            router.push('/ship')
                            break
                        case 'CUSTOMER':
                        default:
                            router.push('/')
                            break
                    }
                }
                try {
                    const profileResp = await userApi.getProfile()
                    if (profileResp.success && profileResp.data) {
                        const profile = profileResp.data
                        localStorage.setItem('email', profile.email || '')
                        localStorage.setItem('fullName', profile.fullName || '')
                        localStorage.setItem('userType', profile.userType || 'CUSTOMER')
                        setUser({
                            token: response.data.token,
                            refreshToken: response.data.refreshToken,
                            userId: response.data.userId,
                            email: profile.email,
                            fullName: profile.fullName,
                            userType: profile.userType,
                        })
                        redirectByRole(profile.userType)
                    } else {
                        localStorage.setItem('email', response.data.email)
                        localStorage.setItem('fullName', response.data.fullName)
                        localStorage.setItem('userType', response.data.userType)
                        setUser(response.data)
                        redirectByRole(response.data.userType)
                    }
                } catch {
                    localStorage.setItem('email', response.data.email)
                    localStorage.setItem('fullName', response.data.fullName)
                    localStorage.setItem('userType', response.data.userType)
                    setUser(response.data)
                    redirectByRole(response.data.userType)
                }
            }
        } catch (error) {
            throw error
        }
    }

    const register = async (email: string, password: string, fullName: string, phone?: string) => {
        try {
            const response = await authApi.register({ email, password, fullName, phone })
            if (response.success && response.data) {
                const redirectByRole = (role?: string) => {
                    switch ((role || '').toUpperCase()) {
                        case 'ADMIN':
                            router.push('/admin')
                            break
                        case 'SELLER':
                            router.push('/seller')
                            break
                        case 'SHIPPER':
                        case 'SHIP':
                            router.push('/ship')
                            break
                        case 'CUSTOMER':
                        default:
                            router.push('/')
                            break
                    }
                }
                try {
                    const profileResp = await userApi.getProfile()
                    if (profileResp.success && profileResp.data) {
                        const profile = profileResp.data
                        localStorage.setItem('email', profile.email || '')
                        localStorage.setItem('fullName', profile.fullName || '')
                        localStorage.setItem('userType', profile.userType || 'CUSTOMER')
                        setUser({
                            token: response.data.token,
                            refreshToken: response.data.refreshToken,
                            userId: response.data.userId,
                            email: profile.email,
                            fullName: profile.fullName,
                            userType: profile.userType,
                        })
                        redirectByRole(profile.userType)
                    } else {
                        localStorage.setItem('email', response.data.email)
                        localStorage.setItem('fullName', response.data.fullName)
                        localStorage.setItem('userType', response.data.userType)
                        setUser(response.data)
                        redirectByRole(response.data.userType)
                    }
                } catch {
                    localStorage.setItem('email', response.data.email)
                    localStorage.setItem('fullName', response.data.fullName)
                    localStorage.setItem('userType', response.data.userType)
                    setUser(response.data)
                    redirectByRole(response.data.userType)
                }
            }
        } catch (error) {
            throw error
        }
    }

    const loginWithGoogle = async (idToken: string) => {
        try {
            const response = await authApi.loginWithGoogle(idToken)
            if (response.success && response.data) {
                const redirectByRole = (role?: string) => {
                    switch ((role || '').toUpperCase()) {
                        case 'ADMIN':
                            router.push('/admin')
                            break
                        case 'SELLER':
                            router.push('/seller')
                            break
                        case 'SHIPPER':
                        case 'SHIP':
                            router.push('/ship')
                            break
                        case 'CUSTOMER':
                        default:
                            router.push('/')
                            break
                    }
                }
                try {
                    const profileResp = await userApi.getProfile()
                    if (profileResp.success && profileResp.data) {
                        const profile = profileResp.data
                        localStorage.setItem('email', profile.email || '')
                        localStorage.setItem('fullName', profile.fullName || '')
                        localStorage.setItem('userType', profile.userType || 'CUSTOMER')
                        setUser({
                            token: response.data.token,
                            refreshToken: response.data.refreshToken,
                            userId: response.data.userId,
                            email: profile.email,
                            fullName: profile.fullName,
                            userType: profile.userType,
                        })
                        redirectByRole(profile.userType)
                    } else {
                        localStorage.setItem('email', response.data.email)
                        localStorage.setItem('fullName', response.data.fullName)
                        localStorage.setItem('userType', response.data.userType)
                        setUser(response.data)
                        redirectByRole(response.data.userType)
                    }
                } catch {
                    localStorage.setItem('email', response.data.email)
                    localStorage.setItem('fullName', response.data.fullName)
                    localStorage.setItem('userType', response.data.userType)
                    setUser(response.data)
                    redirectByRole(response.data.userType)
                }
            }
        } catch (error) {
            throw error
        }
    }

    const loginWithFacebook = async (accessToken: string) => {
        try {
            const response = await authApi.loginWithFacebook(accessToken)
            if (response.success && response.data) {
                const redirectByRole = (role?: string) => {
                    switch ((role || '').toUpperCase()) {
                        case 'ADMIN':
                            router.push('/admin')
                            break
                        case 'SELLER':
                            router.push('/seller')
                            break
                        case 'SHIPPER':
                        case 'SHIP':
                            router.push('/ship')
                            break
                        case 'CUSTOMER':
                        default:
                            router.push('/')
                            break
                    }
                }
                try {
                    const profileResp = await userApi.getProfile()
                    if (profileResp.success && profileResp.data) {
                        const profile = profileResp.data
                        localStorage.setItem('email', profile.email || '')
                        localStorage.setItem('fullName', profile.fullName || '')
                        localStorage.setItem('userType', profile.userType || 'CUSTOMER')
                        setUser({
                            token: response.data.token,
                            refreshToken: response.data.refreshToken,
                            userId: response.data.userId,
                            email: profile.email,
                            fullName: profile.fullName,
                            userType: profile.userType,
                        })
                        redirectByRole(profile.userType)
                    } else {
                        localStorage.setItem('email', response.data.email)
                        localStorage.setItem('fullName', response.data.fullName)
                        localStorage.setItem('userType', response.data.userType)
                        setUser(response.data)
                        redirectByRole(response.data.userType)
                    }
                } catch {
                    localStorage.setItem('email', response.data.email)
                    localStorage.setItem('fullName', response.data.fullName)
                    localStorage.setItem('userType', response.data.userType)
                    setUser(response.data)
                    redirectByRole(response.data.userType)
                }
            }
        } catch (error) {
            throw error
        }
    }

    const logout = () => {
        authApi.logout()
        setUser(null)
        router.push('/login')
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                loginWithGoogle,
                loginWithFacebook,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}


