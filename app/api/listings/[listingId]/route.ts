import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  // Extract the data from the request
  const body = await request.json();
  const {
    title,
    description,
    imageSrc,
    category,
    guestCount,
    individualDeskCount,
    privateOfficeCount,
    price,
    location,
  } = body;

  // Iterate over all of these items and check whether one of them is missing

  Object.keys(body).forEach((value: any) => {
    // All of the items are required, so if one is missing, then we'll throw an error
    if (!body[value]) {
      NextResponse.error();
    }
  });

  // Create the listing
  const listing = await prisma.listing.create({
    // Open the data object
    data: {
      title,
      description,
      imageSrc,
      category,
      guestCount,
      individualDeskCount,
      privateOfficeCount,
      locationValue: location.value,
      // Make sure that the price is an integer
      price: parseInt(price, 10),
      userId: currentUser.id,
    },
  });

  return NextResponse.json(listing);
}
