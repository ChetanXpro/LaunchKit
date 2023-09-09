import connectDB from "@/configs/dbConfig/dbConfig";
import Users from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { generateJWT } from "@/helpers/jwt";

connectDB();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please fill all the fields" },
        {
          status: StatusCodes.BAD_REQUEST,
        }
      );
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Account not exist" },
        {
          status: StatusCodes.BAD_REQUEST,
        }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        {
          status: StatusCodes.BAD_REQUEST,
        }
      );
    }

    const token = generateJWT(
      { id: user._id, username: user.username, email: user.email },
      "5d"
    );

    const response = NextResponse.json(
      {
        message: "Login successfully",
        success: true,
      },
      {
        status: StatusCodes.OK,
      }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    );
  }
}
