import { useState } from "react";
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
import apiClient from "@/lib/apiClient"; // Ensure this is configured properly
import { ADD_TEAM_MEMBER } from "@/utils/constants"; // Ensure this contains the correct endpoint function

const AddUserDialog = ({ team }) => {
    const [memberDetails, setMemberDetails] = useState({
        name: "",
        email: "",
        password: "",
    });

    // Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setMemberDetails((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Handle adding a member
    const handleAddMember = async () => {
        const { name, email, password } = memberDetails;

        if (!name || !email || !password) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            const response = await apiClient.post(
                ADD_TEAM_MEMBER(team._id),
                { name, email, password },
                { withCredentials: true }
            );
            setMemberDetails({ name: "", email: "", password: "" }); // Clear inputs
        } catch (error) {
            console.error("Error adding member:", error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="px-6 text-[18px]">
                    Add Members
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add Members</DialogTitle>
                    <DialogDescription>
                        Fill out the details below to add a new member to the team.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="Member Name"
                            className="col-span-3"
                            value={memberDetails.name}
                            onChange={handleChange}
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
                            value={memberDetails.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter Password"
                            className="col-span-3"
                            value={memberDetails.password}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleAddMember}>
                        Add Members
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserDialog;
