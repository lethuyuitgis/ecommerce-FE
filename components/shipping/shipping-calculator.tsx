"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calculator } from "lucide-react"

export function ShippingCalculator() {
  const [weight, setWeight] = useState("")
  const [distance, setDistance] = useState("")
  const [result, setResult] = useState<number | null>(null)

  const calculateShipping = () => {
    if (weight && distance) {
      const baseFee = 25000
      const weightFee = Number.parseInt(weight) * 5000
      const distanceFee = Number.parseInt(distance) * 2000
      const total = baseFee + weightFee + distanceFee
      setResult(total)
    }
  }

  return (
    <div className="bg-white border-2 border-amber-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-amber-600" />
        <h3 className="text-lg font-bold text-gray-800">Tính phí vận chuyển</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cân nặng (kg)</label>
          <Input
            type="number"
            placeholder="0.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="border-2 border-amber-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Khoảng cách (km)</label>
          <Input
            type="number"
            placeholder="10"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="border-2 border-amber-200"
          />
        </div>

        <Button onClick={calculateShipping} className="w-full bg-amber-500 hover:bg-amber-600 text-white">
          Tính phí
        </Button>

        {result && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">Phí vận chuyển dự kiến</p>
            <p className="text-2xl font-bold text-amber-600">{result.toLocaleString()}đ</p>
          </div>
        )}
      </div>
    </div>
  )
}
