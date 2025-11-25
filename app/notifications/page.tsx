import { NotificationsClient } from "./notifications-client"

// TODO: Fetch real notifications from API when backend is ready
const mockNotifications = [
  {
    id: "1",
    type: "order" as const,
    title: "Đơn hàng đã được giao",
    message: "Đơn hàng #DH123456 đã được giao thành công. Cảm ơn bạn đã mua hàng!",
    time: "14:30",
    date: "Hôm nay",
    read: false,
    link: "/orders/DH123456",
  },
  {
    id: "2",
    type: "promotion" as const,
    title: "Flash Sale 12.12 - Giảm đến 50%",
    message: "Hàng ngàn sản phẩm giảm giá sốc. Nhanh tay đặt hàng ngay!",
    time: "10:00",
    date: "Hôm nay",
    read: false,
    link: "/flash-sales",
  },
  {
    id: "3",
    type: "order" as const,
    title: "Đơn hàng đang được vận chuyển",
    message: "Đơn hàng #DH123455 đang trên đường giao đến bạn. Dự kiến giao hàng trong 1-2 ngày.",
    time: "09:15",
    date: "Hôm qua",
    read: true,
    link: "/orders/DH123455",
  },
  {
    id: "4",
    type: "system" as const,
    title: "Cập nhật chính sách đổi trả",
    message: "Chính sách đổi trả hàng đã được cập nhật. Xem chi tiết tại đây.",
    time: "16:45",
    date: "10/12/2024",
    read: true,
    link: "/return-policy",
  },
  {
    id: "5",
    type: "promotion" as const,
    title: "Mã giảm giá 100.000đ",
    message: "Bạn có 1 mã giảm giá trị giá 100.000đ cho đơn hàng từ 500.000đ. Sử dụng ngay!",
    time: "11:20",
    date: "09/12/2024",
    read: true,
    link: "/vouchers",
  },
  {
    id: "6",
    type: "order" as const,
    title: "Đơn hàng đã được xác nhận",
    message: "Đơn hàng #DH123454 đã được xác nhận và đang được chuẩn bị.",
    time: "08:30",
    date: "08/12/2024",
    read: true,
    link: "/orders/DH123454",
  },
]

export default function NotificationsPage() {
  return <NotificationsClient initialNotifications={mockNotifications} />
}
