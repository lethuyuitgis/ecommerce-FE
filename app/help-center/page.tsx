import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { HelpCenterClient } from "./help-center-client"

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HelpCenterClient />
      </main>
      <Footer />
    </div>
  )
}
