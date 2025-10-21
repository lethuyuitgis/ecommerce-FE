import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
