import connectDB from "@/configs/dbConfig/dbConfig";
import Users from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { sendMail } from "@/helpers/mailer";
import { EMAIL_TYPE } from "@/constants/email";
import { createStripeCustomer } from "@/configs/stripe";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Please fill all the fields" },
        {
          status: StatusCodes.BAD_REQUEST,
        }
      );
    }

    const user = await Users.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "User already exist" },
        {
          status: StatusCodes.BAD_REQUEST,
        }
      );
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = await createStripeCustomer(email);

    const createdUser = await Users.create({
      username,
      email,
      provider: "credentials",
      stripeCustomerId: customer.id,
      password: hashedPassword,
    });

    await sendMail(email, createdUser._id, EMAIL_TYPE.VERIFY);
    return NextResponse.json(
      {
        message: "Account created successfully",
        success: true,
        user: {
          username: createdUser.username,
          email: createdUser.email,
          role: createdUser.role,
        },
      },
      {
        status: StatusCodes.CREATED,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    );
  }
}
