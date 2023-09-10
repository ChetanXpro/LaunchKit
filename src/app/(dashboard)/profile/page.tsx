"use client";
import axios from "axios";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Profile = () => {
  // throw new Error("Client-side error");
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const logout = async () => {
    try {
      const res = await axios.get("/api/user/logout");
      if (res.data.success) {
        router.push("/login");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getProfile = async () => {
    try {
      const res = await axios.get("/api/user/me");
      if (!res.data.success) {
        toast.error(res.data.message);
      } else {
        setUser(res.data.user);
        console.log(res.data.user);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <h1>Profile</h1>
      <button onClick={logout} className="btn">
        Logout
      </button>

      {user && user.username}
      {user && user.email}
    </div>
  );
};

export default Profile;
