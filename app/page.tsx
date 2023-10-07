import Container from "./components/reusable/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import EmptyState from "@/app/components/reusable/EmptyState";

import getListings, { IListingsParams } from "@/app/actions/getListings";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "./components/reusable/ClientOnly";

interface HomeProps {
  searchParams: IListingsParams;
}

// SearchParams in server components is always an object
const Home = async ({ searchParams }: HomeProps) => {
  const listings = await getListings(searchParams);
  // If a user doesn't exist, we will not get an error
  // Because we didn't throw an error in the getCurrentUser function
  // Because the homepage is available to signed out users as well
  const currentUser = await getCurrentUser();

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div
          className="
      pt-24
      grid
      grid-cols-1
      sm:grid-cols-2
      md:grid-cols-4
      lg:grid-cols-5
      xl:grid-cols-6
      gap-8
      "
        >
          {listings.map((listing: any) => (
            <ListingCard
              currentUser={currentUser}
              key={listing.id}
              data={listing}
            />
          ))}
        </div>
      </Container>
    </ClientOnly>
  );
};

export default Home;
