"use client"

import * as React from "react"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { ACTIVATE_ACCOUNT_ROUTE } from "@/utils/constants"
import apiClient from "@/lib/apiClient"

const Verify = () => {
    const [value, setValue] = React.useState("")
    const verifyOtp = async (otp) => {
        try {
            const response = await apiClient.post(ACTIVATE_ACCOUNT_ROUTE, {
                activation_code: otp
            }, { withCredentials: true })
            const user = response.data.user;
            dispatch(setUser(user));
            if (user.role === 'admin') {
                navigate('/admin')
            }

        } catch (error) {
            // add toast
            console.log(error)
        }
    }

    React.useEffect(() => {
        if (value.length === 4) {
            verifyOtp(value)
        }
    }, [value])
    return (
        <section className="size-full flex  items-center ">
            <div className="space-y-2 shadow-lg border px-20 py-10 rounded-md flex justify-center flex-col items-center bg-white">
                <InputOTP
                    maxLength={4}
                    value={value}
                    onChange={(value) => setValue(value)}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                    </InputOTPGroup>
                </InputOTP>
                <div className="text-center text-sm">
                    {value === "" ? (
                        <>Enter your one-time password.</>
                    ) : (
                        <>You entered: {value}</>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Verify