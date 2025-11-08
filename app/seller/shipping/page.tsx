"use client"

import { useState } from "react"
import { Truck, Package, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SellerShippingPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const shippingStats = [
    { label: "Cần giao", value: "12", icon: Package, color: "bg-orange-100 text-orange-600" },
    { label: "Đã giao", value: "245", icon: CheckCircle, color: "bg-green-100 text-green-600" },
    { label: "Lỗi giao", value: "3", icon: AlertCircle, color: "bg-red-100 text-red-600" },
    { label: "Đang giao", value: "28", icon: Truck, color: "bg-blue-100 text-blue-600" },
  ]

  const shipments = [
    {
      id: "GHN123456",
      product: "Điện thoại Samsung",
      customer: "Nguyễn Văn A",
      status: "Đang giao",
      date: "2024-01-10",
    },
    { id: "GHN123457", product: "Tai nghe Bluetooth", customer: "Trần Thị B", status: "Đã giao", date: "2024-01-09" },
    { id: "GHN123458", product: "Sạc nhanh", customer: "Lê Văn C", status: "Chuẩn bị giao", date: "2024-01-10" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Truck className="h-8 w-8 text-amber-600" />
            Quản lý vận chuyển
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {shippingStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-lg p-6 border-2 border-amber-200">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-amber-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 font-semibold ${
              activeTab === "overview" ? "border-b-2 border-amber-500 text-amber-600" : "text-gray-600"
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab("shipments")}
            className={`pb-3 font-semibold ${
              activeTab === "shipments" ? "border-b-2 border-amber-500 text-amber-600" : "text-gray-600"
            }`}
          >
            Vận đơn
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 font-semibold ${
              activeTab === "settings" ? "border-b-2 border-amber-500 text-amber-600" : "text-gray-600"
            }`}
          >
            Cài đặt
          </button>
        </div>

        {/* Shipments Table */}
        {activeTab === "shipments" && (
          <div className="bg-white rounded-lg border-2 border-amber-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-amber-50 border-b border-amber-200">
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">Mã vận đơn</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">Sản phẩm</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">Khách hàng</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">Trạng thái</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">Ngày</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b border-amber-100 hover:bg-amber-50">
                    <td className="px-6 py-3 font-mono text-sm">{shipment.id}</td>
                    <td className="px-6 py-3">{shipment.product}</td>
                    <td className="px-6 py-3">{shipment.customer}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          shipment.status === "Đã giao"
                            ? "bg-green-100 text-green-700"
                            : shipment.status === "Đang giao"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{shipment.date}</td>
                    <td className="px-6 py-3 text-right">
                      <Button className="text-sm bg-amber-500 hover:bg-amber-600 text-white">Xem</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-lg border-2 border-amber-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Cài đặt vận chuyển</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">Vận chuyển mặc định</p>
                  <p className="text-sm text-gray-600">Chọn đối tác vận chuyển ưa thích</p>
                </div>
                <select className="px-4 py-2 border-2 border-amber-200 rounded-lg">
                  <option>GHN</option>
                  <option>Shopee Express</option>
                  <option>Ahamove</option>
                </select>
              </div>
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">Lưu cài đặt</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
