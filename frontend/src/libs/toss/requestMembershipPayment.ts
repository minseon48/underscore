import { loadTossPayments } from "@tosspayments/tosspayments-sdk"
import { TypePostPaymentOrderResult } from "@/queries/api/payment/useMutationPaymentOrder"

export async function requestMembershipPayment(order: TypePostPaymentOrderResult){
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY

    if(!clientKey){
        throw new Error("NEXT_PUBLIC_TOSS_CLIENT_KEY가 없습니다.")
        }

    //1) SDK 초기화
    const tossPayments = await loadTossPayments(clientKey)

    //2) 결제 객체
    const payment = tossPayments.payment({
        customerKey: order.customerKey,
        })

    //3) 통합결제창 오픈
    await payment.requestPayment({
        method: "CARD",
        amount: {
            currency: "KRW",
            value: order.amount,
            },
        orderId: order.orderId,
        orderName: order.orderName,
        successUrl: `${window.location.origin}/mypage/payment/success`,
        failUrl: `${window.location.origin}/mypage/payment/fail`
        })
    }