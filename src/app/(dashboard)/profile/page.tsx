"use client";
import axios from "axios";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { signOut } from "next-auth/react";
import Link from "next/link";

const Profile = () => {
  // throw new Error("Client-side error");

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  console.log("status: ", status);

  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);

  const logout = async () => {
    try {
      const res = await signOut({
        callbackUrl: "/login",
        redirect: true,
      });
      console.log("Logout: ", res);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex-col gap-4 flex items-center justify-center ">
      <h1>Profile</h1>
      <button onClick={logout} className="btn">
        Logout
      </button>
      Session: {JSON.stringify(session?.user)}
      Status: {status}
      <Link href={"/admin"}>Admin</Link>
      <Link href={"/moderation"}>Moderator</Link>
    </div>
  );
};

export default Profile;
