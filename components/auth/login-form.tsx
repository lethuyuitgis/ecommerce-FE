"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

declare global {
  interface Window {
    google?: any
    FB?: any
    fbAsyncInit?: () => void
  }
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, loginWithGoogle, loginWithFacebook } = useAuth()

  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    script.onload = () => {
      // Initialize Google Sign-In when script loads
      if (window.google && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            try {
              await loginWithGoogle(response.credential)
              toast.success("Đăng nhập với Google thành công!")
            } catch (error: any) {
              toast.error(error.message || "Đăng nhập với Google thất bại.")
            }
          },
        })

        // Render Google Sign-In button
        setTimeout(() => {
          const buttonContainer = document.getElementById('google-signin-button')
          if (buttonContainer) {
            window.google.accounts.id.renderButton(buttonContainer, {
              theme: 'outline',
              size: 'large',
              width: '100%',
              type: 'standard',
            })
          }
        }, 100)
      }
    }

    // Load Facebook SDK
    const fbScript = document.createElement('script')
    fbScript.src = 'https://connect.facebook.net/en_US/sdk.js'
    fbScript.async = true
    fbScript.defer = true
    fbScript.id = 'facebook-jssdk'

    // Set up fbAsyncInit before loading script
    window.fbAsyncInit = function () {
      if (window.FB) {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        })
      }
    }

    document.head.appendChild(fbScript)

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script)
      }
      if (fbScript.parentNode) {
        document.head.removeChild(fbScript)
      }
    }
  }, [loginWithGoogle])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await login(email, password)
      toast.success("Đăng nhập thành công!")
    } catch (error: any) {
      toast.error(error.message || "Đăng nhập thất bại. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      console.log('Google login clicked')
      setLoading(true)

      if (!window.google) {
        toast.error("Google Sign-In chưa sẵn sàng. Vui lòng thử lại sau.")
        setLoading(false)
        return
      }

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      console.log('Google Client ID:', clientId ? 'Set' : 'Not set')

      if (!clientId) {
        toast.error("Google Client ID chưa được cấu hình. Vui lòng liên hệ quản trị viên.")
        setLoading(false)
        return
      }

      // Initialize Google Sign-In with callback
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          console.log('Google callback received')
          try {
            setLoading(true)
            await loginWithGoogle(response.credential)
            toast.success("Đăng nhập với Google thành công!")
          } catch (error: any) {
            console.error('Google login error:', error)
            toast.error(error.message || "Đăng nhập với Google thất bại.")
          } finally {
            setLoading(false)
          }
        },
      })

      const buttonContainer = document.getElementById('google-signin-button')
      if (buttonContainer) {
        buttonContainer.innerHTML = ''

        window.google.accounts.id.renderButton(buttonContainer, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          type: 'standard',
          text: 'signin_with',
        })

        setTimeout(() => {
          const button = buttonContainer.querySelector('div[role="button"]') as HTMLElement
          if (button) {
            button.click()
          } else {
            window.google.accounts.id.prompt()
          }
        }, 200)
      } else {
        window.google.accounts.id.prompt()
      }
    } catch (error: any) {
      console.error('Google login error:', error)
      toast.error(error.message || "Đăng nhập với Google thất bại.")
      setLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    try {
      console.log('Facebook login clicked')
      setLoading(true)

      if (!window.FB) {
        console.log('Facebook SDK not loaded')
        toast.error("Facebook SDK chưa sẵn sàng. Vui lòng thử lại sau.")
        setLoading(false)
        return
      }

      const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
      console.log('Facebook App ID:', appId ? 'Set' : 'Not set')

      if (!appId) {
        toast.error("Facebook App ID chưa được cấu hình. Vui lòng liên hệ quản trị viên.")
        setLoading(false)
        return
      }

      // Check if SDK is ready and initialized
      window.FB.getLoginStatus((statusResponse: any) => {
        console.log('Facebook login status:', statusResponse)

        // Proceed with login
        window.FB.login((loginResponse: any) => {
          console.log('Facebook login response:', loginResponse)

          if (loginResponse.authResponse) {
            const accessToken = loginResponse.authResponse.accessToken
            console.log('Facebook access token received')

            loginWithFacebook(accessToken)
              .then(() => {
                toast.success("Đăng nhập với Facebook thành công!")
                setLoading(false)
              })
              .catch((error: any) => {
                console.error('Facebook login error:', error)
                toast.error(error.message || "Đăng nhập với Facebook thất bại.")
                setLoading(false)
              })
          } else {
            console.log('Facebook login cancelled or failed')
            if (loginResponse.error) {
              console.error('Facebook error:', loginResponse.error)
              toast.error(loginResponse.error.message || "Đăng nhập với Facebook thất bại.")
            } else {
              toast.error("Đăng nhập với Facebook bị hủy.")
            }
            setLoading(false)
          }
        }, { scope: 'public_profile', return_scopes: true })
      }, true) // Force roundtrip to refresh status
    } catch (error: any) {
      console.error('Facebook login error:', error)
      toast.error(error.message || "Đăng nhập với Facebook thất bại.")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-2xl font-bold text-foreground">Đăng Nhập</h1>
        <p className="text-sm text-muted-foreground">Chào mừng bạn quay trở lại!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email / Số điện thoại</Label>
          <Input
            id="email"
            type="text"
            placeholder="Nhập email hoặc số điện thoại"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-muted-foreground">Ghi nhớ đăng nhập</span>
          </label>
          <Link href="/forgot-password" className="text-primary hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-sm text-muted-foreground">HOẶC</span>
        <Separator className="flex-1" />
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full bg-transparent"
          size="lg"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Đăng nhập với Google
        </Button>

        <Button
          variant="outline"
          className="w-full bg-transparent"
          size="lg"
          onClick={handleFacebookLogin}
          disabled={loading}
        >
          <svg className="mr-2 h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Đăng nhập với Facebook
        </Button>
      </div>

      <div id="google-signin-button" className="sr-only" aria-hidden="true" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Bạn chưa có tài khoản?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  )
}
