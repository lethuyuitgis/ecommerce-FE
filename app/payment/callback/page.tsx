'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { paymentApi } from '@/lib/api/payment'
import Link from 'next/link'

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get all query parameters from VNPay callback
        const params: Record<string, string> = {}
        searchParams.forEach((value, key) => {
          params[key] = value
        })

        // Call backend to verify payment
        const response = await paymentApi.vnpayCallback(params)

        if (response.success && response.data) {
          if (response.data.status === 'COMPLETED' || response.data.status === 'SUCCESS') {
            setStatus('success')
            setMessage(response.data.message || 'Thanh toán thành công!')
            
            // Redirect to orders page after 3 seconds
            setTimeout(() => {
              router.push('/orders')
            }, 3000)
          } else {
            setStatus('failed')
            setMessage(response.data.message || 'Thanh toán thất bại')
          }
        } else {
          setStatus('failed')
          setMessage(response.message || 'Có lỗi xảy ra khi xử lý thanh toán')
        }
      } catch (error: any) {
        setStatus('failed')
        setMessage(error.message || 'Có lỗi xảy ra khi xử lý thanh toán')
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900">Đang xử lý thanh toán...</h2>
              <p className="mt-2 text-gray-600">Vui lòng đợi trong giây lát</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Thanh toán thành công!</h2>
              <p className="mt-2 text-gray-600">{message}</p>
              <p className="mt-4 text-sm text-gray-500">Đang chuyển hướng đến trang đơn hàng...</p>
              <div className="mt-6">
                <Link
                  href="/orders"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                >
                  Xem đơn hàng
                </Link>
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Thanh toán thất bại</h2>
              <p className="mt-2 text-gray-600">{message}</p>
              <div className="mt-6 space-x-4">
                <Link
                  href="/orders"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Xem đơn hàng
                </Link>
                <Link
                  href="/cart"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                >
                  Thử lại
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

