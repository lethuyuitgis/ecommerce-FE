"use client"

import { SellerDashboard } from "@/components/seller/seller-dashboard";
import { RequireSeller } from "@/components/seller/require-seller";

export default function SellerPage() {
  return (
    <RequireSeller>
      <SellerDashboard />
    </RequireSeller>
  )
}
