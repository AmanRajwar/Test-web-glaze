import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import apiClient from "@/lib/apiClient";
import { DELETE_TEAM_MEMBERS, GET_TEAM_MEMBERS } from "@/utils/constants";
import { useState } from "react";
const TeamMembersDialog = ({ team }) => {
    const [members, setMembers] = useState(null);

    const getTeamMembers = async () => {
        try {
            const teamId = team._id;
            const response = await apiClient.get(
                GET_TEAM_MEMBERS(teamId),
                { withCredentials: true }
            );
            if (response.data.success) {
                if (response.data.members.length === 0) {
                    setMembers(null)
                } else {
                    setMembers(response.data.members)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const removeMember = async (userId, teamId) => {
        try {
            const response = await apiClient.delete(
                DELETE_TEAM_MEMBERS(teamId, userId),
                { withCredentials: true }
            );
            if (response.data.success) {
                getTeamMembers()
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild className='cursor-pointer '>
                <div className='size-full py-6' onClick={getTeamMembers}>
                    <h3 className=" text-[20px] font-semibold "> {team.name}</h3>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] ">
                <DialogHeader>
                    <DialogTitle>Team members</DialogTitle>
                </DialogHeader>

                {members ? (
                    <ul className="px-10 max-h-[800px]">
                        {members.map((member) => (
                            <li key={member.id} className="flex justify-between my-5 py-5 border-b items-center px-3 hover:bg-slate-50 rounded-md">
                                <h3 className="text-[20px] font-semibold">{member.name}</h3>
                                <button onClick={() => removeMember(member._id, team._id)}>
                                    <img src="/images/user.png" alt='delete admin' className="size-8" />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="w-full flex justify-center mt-10">
                        <h2 className="font-roboto p-4 border-b text-[20px]">No Members</h2>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default TeamMembersDialog