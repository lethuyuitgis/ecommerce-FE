import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { AddressesClient } from "./addresses-client"
import { serverUserApi } from "@/lib/api/server"
import { UserAddress } from "@/lib/api/user"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AddressesPage() {
    // Fetch addresses on server
    const response = await serverUserApi.getAddresses()

    // If not authenticated, redirect to login
    if (!response.success && response.message?.includes('401')) {
        redirect('/login')
    }

    const addresses: UserAddress[] = response.success && response.data
        ? (Array.isArray(response.data) ? response.data : [])
        : []

    return (
        <div className="min-h-screen">
            <Header />
            <main className="bg-muted/30">
                <div className="container mx-auto px-4 py-6">
                    {/* Breadcrumb */}
                    <div className="mb-4 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">
                            Trang chủ
                        </Link>
                        <span className="mx-2">/</span>
                        <Link href="/profile" className="hover:text-primary">
                            Tài khoản
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-foreground">Địa chỉ</span>
                    </div>

                    <AddressesClient initialAddresses={addresses} />
                </div>
            </main>
            <Footer />
        </div>
    )
}
