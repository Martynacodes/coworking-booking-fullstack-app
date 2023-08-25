import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";

export async function getSession() {
  return await getServerSession(authOptions);
}

// It's direct communication with my database through my server component.
export default async function getCurrentUser() {
  try {
    // Initiate the session by using getSession function.
    // That's how I'm getting my server in
    const session = await getSession();
    // Check if the session is valid
    if (!session?.user?.email) {
      return null;
    }
    // Find the current user
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error: any) {
    return null;
  }
}
