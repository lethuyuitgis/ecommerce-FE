import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { HelpClient } from "./help-client"

export default function HelpPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HelpClient />
      </main>
      <Footer />
    </div>
  )
}
