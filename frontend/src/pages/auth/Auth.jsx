import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useSelector, useDispatch } from 'react-redux'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../components/ui/form"
import { Input } from "@/components/ui/input"
import apiClient from "@/lib/apiClient.js"
import { LOGIN_ROUTE } from "@/utils/constants.js"
import { setUser } from "@/redux/features/userSlice.js"
import { useNavigate } from "react-router-dom"


const formSchema = z.object({
    email: z.string().min(7),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters"
    })

})


const Auth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    })


    // 2. Define a submit handler.
    async function onSubmit(values) {
        const { email, password } = values
        console.log(values)
        try {
            const response = await apiClient.post(LOGIN_ROUTE, {
                email, password
            }, { withCredentials: true })
            const user = response.data.user;
            console.log(response)
            dispatch(setUser(user))
            if (user.role === 'superuser') {
                navigate('/superuser')
            }

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <section className="size-full flex  items-center ">
            <Form {...form}  >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 border px-20  py-10 rounded-lg shadow-lg bg-white">
                    <h1 className="font-roboto font-bold pb-5"> Log Into Account</h1>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Sign In</Button>
                </form>
            </Form>
        </section>
    )
}


export default Auth