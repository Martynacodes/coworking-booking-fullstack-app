import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  //   Extract listingId from the params object
  const { listingId } = params;

  // Check the type of the listingId
  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid listing ID.");
  }

  //   Create a copy of the user's favorite IDs (assuming the user has a property "favoriteIds")
  // Then modify it accordingly based on whether it's a POST or DELETE request

  // Create an array of favorite IDs
  // If "currentUser.favoriteIds is falsy(e.g. null or undefined or an empty array)
  // then it will be replaced with an empty array [].
  // This is a common pattern used to ensure taht "favortieIds" is always an array,
  // Even if the "currentUser.favoriteIds" is initially undefined or null."

  // The [...]syntax creates a shallow copy of an array.
  // In this case, it creates a new array with the same elements as "currentUser.favoriteIds"
  // This is done to avoid modifying the original array directly.

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  // After creating a copy of the array, the code adds a new item to it.
  favoriteIds.push(listingId);

  //   Update the user's data in the database using "prisma" client and return the updated user data as a JSON response
  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds,
    },
  });

  return NextResponse.json(user);
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid listing ID.");
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds,
    },
  });

  return NextResponse.json(user);
}
