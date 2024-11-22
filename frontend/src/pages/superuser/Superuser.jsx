import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/apiClient.js";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GET_ADMINS, ADD_ADMIN_ROUTE, DELETE_ADMIN_ROUTE } from "@/utils/constants.js"
import { setAdmins } from "@/redux/features/superUserSlice";
import { useSelector, useDispatch } from 'react-redux'
import { Logout } from "@/components/LogOut";

const Superuser = () => {
    const dispatch = useDispatch();
    const { admins } = useSelector((state) => state.superuser);

    // State for form inputs
    const [adminDetails, setAdminDetails] = useState({
        name: "",
        email: "",
        password: "",
    });

    // Fetch all admins
    const getAllAdmins = async () => {
        try {
            const response = await apiClient.get(GET_ADMINS, { withCredentials: true });
            console.log('response', response)
            if (response.data.success) {
                dispatch(setAdmins(response.data.admins));
            } else {
                dispatch(setAdmins(null))
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setAdminDetails((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Add Admin function
    const handleAddAdmin = async () => {
        const { name, email, password } = adminDetails;
        console.log(adminDetails)
        try {
            const response = await apiClient.post(
                ADD_ADMIN_ROUTE,
                { name, email, password },
                { withCredentials: true }
            );
            if (response.data.success) {
                getAllAdmins();
                setAdminDetails({ name: "", email: "", password: "" }); // Reset inputs
            }
        } catch (error) {
            console.log(error);
        }
    };

    //delete admins
    const handleDeleteAdmin = async (adminId) => {
        // console.log( DELETE_ADMIN_ROUTE(adminId))
        try {
            const response = await apiClient.delete(
                DELETE_ADMIN_ROUTE(adminId),
                { withCredentials: true }
            );
            if (response.data.success) {
                getAllAdmins(); // Refresh admin list
            }
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getAllAdmins();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            console.log(admins)
        }, 2000)
    }, [admins])

    return (
        <section className=" w-[70vw]">
            <div className=" border border-slate-100 p-2 mb-10 rounded-lg shadow-lg px-20 flex items-center justify-between">
                <h1 className=" font-roboto font-semibold"> All Admins</h1>
                <div className=" flex gap-3">

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="px-6 text-[18px]">Add Admin</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Add Admin</DialogTitle>
                                <DialogDescription>
                                    Fill in the details to add a new admin.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Admin Name"
                                        className="col-span-3"
                                        value={adminDetails.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        placeholder="example@xyz.com"
                                        className="col-span-3"
                                        value={adminDetails.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="password" className="text-right">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type='password'
                                        placeholder="Password"
                                        className="col-span-3"
                                        value={adminDetails.password}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" onClick={handleAddAdmin}>
                                    Add Admin
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Logout />
                </div>
            </div>
            <div className="min-h-[900px] min-w-[500px] border border-slate-100 shadow-lg rounded-lg">
                {admins ? (
                    <ul className="px-10">
                        {admins.map((admin) => (
                            <li key={admin.id} className="flex justify-between my-5 py-5 border-b items-center px-3 hover:bg-slate-50 rounded-md">
                                <h3 className="text-[20px] font-semibold">{admin.user.name}</h3>
                                <button onClick={() => handleDeleteAdmin(admin.id)}>
                                    <img src="/images/user.png" alt='delete admin' className="size-10" />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="w-full flex justify-center mt-10">
                        <h1 className="font-roboto p-4 border-b">Add admins to see</h1>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Superuser;
