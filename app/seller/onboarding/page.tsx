import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { OnboardingClient } from "./onboarding-client"

export default function SellerOnboardingPage() {
    return (
        <div className="flex min-h-screen bg-background">
            <SellerSidebar />
            <div className="flex-1 p-6 lg:p-8">
                <OnboardingClient />
            </div>
        </div>
    )
}
