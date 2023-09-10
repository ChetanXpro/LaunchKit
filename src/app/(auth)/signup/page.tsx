"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";

const page = () => {
  const [isLoading, setisLoading] = React.useState(false);

  const router = useRouter();
  const {
    register,
    handleSubmit,

    watch,
    formState: { errors },
  } = useForm();

  const [buttonEnabled, setButtonEnabled] = React.useState(false);

  const onSignup = async () => {
    try {
      console.log("onSignup");

      setisLoading(true);

      const data = {
        username: watch("username"),
        email: watch("Email"),
        password: watch("Password"),
      };

      const res = await axios.post("/api/user/signup", data);

      console.log(res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/login");
      } else {
        console.log(res.data.message);
      }
    } catch (error: any) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error || error.message);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    if (watch("username") && watch("Email") && watch("Password")) {
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
  }, [watch("username"), watch("Email"), watch("Password")]);

  return (
    <div className="flex min-h-screen  flex-col gap-4  items-center justify-center  ">
      <Toaster position="top-center" reverseOrder={true} />
      <div className="flex form-control w-full max-w-xs flex-col gap-2">
        <label className="label">Username</label>
        <input
          {...register("username", { required: true })}
          placeholder="username"
          className="input input-bordered w-full max-w-xs"
        />
        {errors.username && <p className="error">UserName is required.</p>}
        <label className="label">Email</label>
        <input
          {...register("Email", { required: true })}
          className="input input-bordered w-full max-w-xs"
          placeholder="Email"
        />
        {errors.Email && <p className="error">Email is required.</p>}
        <label className="label">Password</label>
        <input
          {...register("Password", { required: true })}
          placeholder="Password"
          className="input input-bordered w-full max-w-xs"
        />
        {errors.Password && <p className="error">Password is required.</p>}

        <button
          className={` ${buttonEnabled ? "btn" : "btn btn-disabled"} mt-4`}
          onClick={onSignup}
        >
          {isLoading && <span className="loading loading-spinner"></span>}
          Signup
        </button>

        <div className="mt-4 items-center justify-between flex w-full">
          <p>
            Already have an account ?{" "}
            <Link href={"/login"} className="link link-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
