"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { ProfileInfo } from "@/components/profile/profile-info"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <ProfileSidebar />
            </div>
            <div className="lg:col-span-3">
              <ProfileInfo />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
