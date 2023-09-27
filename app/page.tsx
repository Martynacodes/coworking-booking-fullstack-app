import Container from "./components/reusable/Container";
import ClientOnly from "./components/ClientOnly";
import ListingCard from "@/app/components/listings/ListingCard";
import EmptyState from "@/app/components/EmptyState";
import getListings from "./actions/getListings";

export default async function Home() {
  const listings = await getListings();
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
          {listings.map((listing: any) => {
            return <ListingCard></ListingCard>;
          })}
        </div>
      </Container>
    </ClientOnly>
  );
}
