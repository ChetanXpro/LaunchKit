import connectDB from "@/configs/dbConfig/dbConfig";
import Users from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqbody = await request.json();
    const token = reqbody.token;

    console.log(token);

    const user = await Users.findOne({
      varificationToken: token,
      varificationTokenExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return {
        status: StatusCodes.BAD_REQUEST,
        body: {
          success: false,
          message: "Expired token",
        },
      };
    }

    user.isVarified = true;
    user.varificationToken = undefined;
    user.varificationTokenExpire = undefined;

    await user.save();

    return NextResponse.json({
      status: StatusCodes.OK,
      message: "Email verified",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: "Server error",
      },
    });
  }

  // Expire
}
