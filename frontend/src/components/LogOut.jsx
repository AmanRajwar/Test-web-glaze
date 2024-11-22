import { Button } from "@/components/ui/button"
import { setAdminId, setTeams } from "@/redux/features/adminSlice";
import { setAdmins } from "@/redux/features/superUserSlice";
import { setUser } from "@/redux/features/userSlice.js";
import { LOGOUT_ROUTE } from "@/utils/constants";
import {  useDispatch } from 'react-redux'
import apiClient from "@/lib/apiClient";

export function Logout() {
    const dispatch = useDispatch()

    const handleLogout = async () => {

        try {
            const response = await apiClient.get(
                LOGOUT_ROUTE,
                { withCredentials: true }
            );
            if (response.data.success) {
                dispatch(setUser(null))
                dispatch(setAdminId(null))
                dispatch(setAdmins(null))
                dispatch(setTeams(null))
            }
        } catch (error) {
            console.error("Error adding member:", error);
        }
    }
    return <Button variant="destructive" className='text-[18px]' onClick={handleLogout}>Log Out</Button>
}
