import { getServerSession } from "next-auth";
import Image from "next/image";
import { options } from "./api/auth/[...nextauth]/Options";
import Plans from "@/components/Plans/Plans";

export default async function Home() {
  const data = await getServerSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {JSON.stringify(data)}
      <Plans />
    </main>
  );
}
