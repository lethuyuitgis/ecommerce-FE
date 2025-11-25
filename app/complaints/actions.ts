"use server"

import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { serverComplaintsApi } from "@/lib/api/server"

export async function submitComplaintAction(formData: FormData) {
  const payload = {
    orderId: formData.get("orderId")?.toString().trim() || undefined,
    productId: formData.get("productId")?.toString().trim() || undefined,
    sellerId: formData.get("sellerId")?.toString().trim() || undefined,
    category: formData.get("category")?.toString().trim() || "RETURN",
    title: formData.get("title")?.toString().trim() || "",
    description: formData.get("description")?.toString().trim() || "",
    desiredResolution: formData.get("desiredResolution")?.toString().trim() || "REFUND",
  }

  if (!payload.title || !payload.description) {
    redirect("/complaints?error=missing_fields")
  }

  const cookieStore = cookies()
  const headersList = headers()

  const response = await serverComplaintsApi.create(payload, cookieStore, headersList)
  if (!response.success) {
    const errMsg = encodeURIComponent(response.message || "failed")
    redirect(`/complaints?error=${errMsg}`)
  }

  revalidatePath("/complaints")
  redirect("/complaints?submitted=1")
}

