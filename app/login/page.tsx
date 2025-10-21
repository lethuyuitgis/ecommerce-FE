import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
