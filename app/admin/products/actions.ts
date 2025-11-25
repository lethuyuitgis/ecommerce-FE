"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies, headers } from "next/headers"
import { serverAdminProductsApi } from "@/lib/api/server"

export async function setFeaturedAction(formData: FormData) {
  const productId = formData.get("productId")?.toString()
  const featured = formData.get("featured") === "on"
  const priorityValue = formData.get("priority")?.toString()
  const priority = priorityValue ? Number(priorityValue) : 0

  if (!productId) {
    redirect("/admin/products/manage?error=missing_product")
  }

  const response = await serverAdminProductsApi.setFeatured(productId, { featured, priority })
  if (!response.success) {
    const err = encodeURIComponent(response.message || "failed")
    redirect(`/admin/products/manage?error=${err}`)
  }

  revalidatePath("/admin/products/manage")
  redirect("/admin/products/manage?updated=featured")
}

export async function setFlashSaleAction(formData: FormData) {
  const productId = formData.get("productId")?.toString()
  const enabled = formData.get("flashEnabled") === "on"
  const flashPrice = formData.get("flashPrice")?.toString()
  const startTime = formData.get("flashStart")?.toString()
  const endTime = formData.get("flashEnd")?.toString()
  const stock = formData.get("flashStock")?.toString()

  if (!productId) {
    redirect("/admin/products/manage?error=missing_product")
  }

  const payload: any = { enabled }
  if (flashPrice) payload.flashPrice = Number(flashPrice)
  if (startTime) payload.startTime = startTime
  if (endTime) payload.endTime = endTime
  if (stock) payload.stock = Number(stock)

  const response = await serverAdminProductsApi.setFlashSale(productId!, payload)
  if (!response.success) {
    const err = encodeURIComponent(response.message || "failed")
    redirect(`/admin/products/manage?error=${err}`)
  }

  revalidatePath("/admin/products/manage")
  redirect("/admin/products/manage?updated=flash")
}

