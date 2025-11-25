import { NotificationsClient } from "./notifications-client"
import { notificationsApi } from "@/lib/api/notifications"
import { cookies } from "next/headers"

export default async function NotificationsPage() {
  // Nếu chưa đăng nhập thì trả về danh sách rỗng, NotificationsClient sẽ tự xử lý
  const cookieStore = cookies()
  const userId = cookieStore.get("userId")?.value || ""

  if (!userId) {
    return <NotificationsClient initialNotifications={[]} />
  }

  try {
    const response = await notificationsApi.getNotifications(userId, 0, 50)
    const notifications = response.success && response.data ? response.data.content : []
    return <NotificationsClient initialNotifications={notifications} />
  } catch {
    return <NotificationsClient initialNotifications={[]} />
  }
}
