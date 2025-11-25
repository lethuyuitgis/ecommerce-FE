"use server"

import "server-only"
import { cookies } from "next/headers"

export async function getAuthFromCookies() {
  const store = cookies()
  return {
    token: store.get("token")?.value ?? null,
    userId: store.get("userId")?.value ?? null,
  }
}

