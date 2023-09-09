import connectDB from "@/configs/dbConfig/dbConfig";
import Users from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

import { StatusCodes } from "http-status-codes";
import { getInformationFromJWT } from "@/helpers/jwt";

connectDB();

export async function GET(request: NextRequest) {
  try {
    const userId = await getInformationFromJWT(request);

    const user = await Users.findById(userId)
      .select("-password -__v -createdAt -updatedAt -_id")
      .exec();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        {
          status: StatusCodes.NOT_FOUND,
        }
      );
    }
    return NextResponse.json({
      message: "User information",
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    );
  }
}
