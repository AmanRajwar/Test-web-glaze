import { Logout } from '@/components/LogOut';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const User = () => {
    const { user } = useSelector((state) => state.user);
    const [details, setDetails] = useState(null);

    useEffect(() => {
        if (user && user.team && user.team.admin && user.team.admin.user) {
            console.log('fasdfasdfadf aman')
            setDetails({
                teamName: user.team.name,
                adminName: user.team.admin.user.name,
                adminEmail: user.team.admin.user.email,
            });
        }
    }, [user]);

    return (
        <section className="w-[70vw] h-full flex items-center justify-center">
            <div className="relative w-[1000px] h-[800px] border border-slate-100 p-2 mb-10 rounded-lg shadow-lg px-20 flex items-center justify-between">
                {details ? (
                    <div className="flex flex-col gap-8">
                        <div className="text-[20px] font-semibold font-roboto">
                            <p>Team Name: {details.teamName}</p>
                            <p>Admin Name: {details.adminName}</p>
                            <p>Admin Email: {details.adminEmail}</p>
                        </div>

                        <h1 className="text-[16px] font-roboto font-semibold">
                            I have not made any functionality.
                        </h1>
                    </div>
                ) : (
                    <h1>Loading...</h1>
                )}

                <div className="absolute bottom-3 right-3">
                    <Logout />
                </div>
            </div>
        </section>
    );
};

export default User;
