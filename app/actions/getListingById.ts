import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export default async function getListingById(params: IParams) {
  try {
    const { listingId } = params;

    // I can get the listing directly because this is not a route

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      // We want to load the user, so we can load the profile image and the name of the user that owns this listing.
      include: {
        user: true,
      },
    });

    if (!listing) {
      return null;
    }

    // Sanitize the listing object
    return {
      // Spread the listing object
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      // Sanitize the user object
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt.toISOString(),
        updatedAt: listing.user.updatedAt.toISOString(),
        emailVerified: listing.user.emailVerified?.toString() || null,
      },
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
