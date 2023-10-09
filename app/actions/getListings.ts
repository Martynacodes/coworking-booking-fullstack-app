import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  individualDeskCount?: number;
  privateOfficeCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

// Used to fetch all listings on the homepage.

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      individualDeskCount,
      guestCount,
      privateOfficeCount,
      locationValue,
      startDate,
      endDate,
      category,
    } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (individualDeskCount) {
      query.individualDeskCount = {
        // This will transform the individualDeskCount that is a string into an integer
        // We will filter out all the listings that have less desks than we need.
        gte: +individualDeskCount,
      };
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      };
    }

    if (privateOfficeCount) {
      query.privateOfficeCount = {
        gte: +privateOfficeCount,
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    // Create a filter for our dates, so that we only get listings that are available for our select dates.
    if (startDate && endDate) {
      // We are using reverse filtering.

      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }
    // Fetch listings
    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeListings = listings.map((listing:any) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
