"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { getToken } from "@/libs/cache"

export default function PaymentSuccessPage(){
    const router = useRouter()
    const searchParams = useSearchParams()
    const [message, setMessage] = useState("결제 확인 중...")
    const requestedRef = useRef(false)


    useEffect(() => {
            if(requestedRef.current) return


        const paymentKey = searchParams.get("paymentKey")
        const orderId = searchParams.get("orderId")
        const amount = Number(searchParams.get("amount"))



        if(!paymentKey || !orderId || !amount){
            setMessage("결제 정보가 없습니다.")
            return
            }

        requestedRef.current = true

        ;(async () => {
            try {
                const token = await getToken()
                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/payment/confirm`,
                    { paymentKey, orderId, amount },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                            },
                        },
                    )
                //결제 승인 후 이동 페이지
                router.replace(`/mypage/payment/history/${data.paymentId}`)
                } catch(e) {
                    console. error(e)
                    setMessage("결제 승인에 실패했습니다.")
                    }
            })()
        }, [searchParams, router])
    return <p>{message}</p>
    }