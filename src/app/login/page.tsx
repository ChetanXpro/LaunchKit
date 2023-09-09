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

  const onLogin = async () => {
    try {
      console.log("onLogin");

      setisLoading(true);

      const data = {
        email: watch("Email"),
        password: watch("Password"),
      };

      const res = await axios.post("/api/user/login", data);

      console.log(res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/profile");
      } else {
        console.log(res.data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    if (watch("Email") && watch("Password")) {
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
  }, [watch("username"), watch("Email"), watch("Password")]);

  return (
    <div className="flex min-h-screen  flex-col gap-4  items-center justify-center  ">
      <div className="flex flex-col gap-2">
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
          className={`btn mt-3 flex gap-3  ${
            buttonEnabled ? "btn" : "btn btn-disabled"
          } `}
          onClick={onLogin}
        >
          {isLoading && <span className="loading loading-spinner"></span>}
          Login
        </button>

        <div className="mt-4 items-center justify-between flex w-full">
          <p>
            Dont have any account ?{" "}
            <Link href={"/signup"} className="link link-primary">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
