import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddUserDialog from "../../components/AddUserDialog";
import TeamMembersDialog from "../../components/TeamMembersDialog";
import apiClient from "@/lib/apiClient";
import { useSelector, useDispatch } from 'react-redux'
import { GET_ADMIN_DETAILS_ROUTE, CREATE_TEAM_ROUTE, DELETE_TEAM_ROUTE } from "@/utils/constants";
import { setAdminId, setTeams } from "@/redux/features/adminSlice";
import { Logout } from "@/components/LogOut";

const Admin = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.user)
    const { teams } = useSelector((state) => state.admin)
    // State for team creation
    const [teamName, setTeamName] = useState("");


    // Fetch teams on component load
    useEffect(() => {
        getAdminDetails()
    }, []);



    const getAdminDetails = async () => {
        try {
            const userId = user._id
            const response = await apiClient.get(GET_ADMIN_DETAILS_ROUTE(userId), { withCredentials: true });

            if (response.data.success) {
                const admin = response.data.admin
                dispatch(setAdminId(admin._id))
                if (admin.teams.length !== 0) {
                    dispatch(setTeams(admin.teams))
                } else {
                    dispatch(setTeams(null))
                }
            }
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
    };


    // Handle team creation
    const handleCreateTeam = async () => {
        try {
            const response = await apiClient.post(
                CREATE_TEAM_ROUTE,
                { teamName },
                { withCredentials: true }
            );
            if (response.data.success) {
                setTeamName(""); 
                getAdminDetails(); 
            }
        } catch (error) {
            console.error("Error creating team:", error);
        }
    };

    const deleteTeam = async (teamId) => {
        try {
            const response = await apiClient.delete(
                DELETE_TEAM_ROUTE(teamId),
                { withCredentials: true }
            );

            if (response.data.success) {
                setTeamName(""); // Clear input
                getAdminDetails(); // Refresh team list
            }
        } catch (error) {
            console.error("Error creating team:", error);
        }
    };


    return (
        <section className=" w-[70vw] ">
            <div className=" border mt-5 border-slate-100 p-2 mb-10 rounded-lg shadow-lg px-20 flex items-center justify-between">
                <h1 className=" font-roboto font-semibold"> Your Teams</h1>
                <div className=" flex gap-3">

                    <Dialog>
                        <DialogTrigger asChild>
                            <div className=" flex gap-2 ">
                                <Button variant="outline" className="px-6 text-[18px]">
                                    Create Team
                                </Button>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Create Team</DialogTitle>
                                <DialogDescription>
                                    Enter the name of the team and click save.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter Team Name"
                                        className="col-span-3"
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" onClick={handleCreateTeam}>
                                    Create Team
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Logout />
                </div>
            </div>
            <div className="min-h-[900px] min-w-[500px] border border-slate-100 shadow-lg rounded-lg">
                {teams ? (<>
                    <ul className="px-10">
                        {teams.map((team) => (
                            <li
                                key={team._id}
                                className="flex justify-between my-5 px-3 border-b items-center hover:bg-slate-100 rounded-md"
                            >
                                <TeamMembersDialog team={team} />
                                <div className="flex gap-4 py-5">
                                    <AddUserDialog
                                        team={team}
                                    />
                                    <button className="size-10" onClick={() => deleteTeam(team._id)}>
                                        <img src="/images/user.png" alt="" className="size-10" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>) : <>
                    <div className="w-full flex justify-center mt-10">
                        <h1 className="font-roboto p-4 border-b">Create Teams </h1>
                    </div>
                </>
                }
            </div>

        </section >
    );
};

export default Admin;
