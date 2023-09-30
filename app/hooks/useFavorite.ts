import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "@/app/types";

import useLoginModal from "./useLoginModal";

interface IUseFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const router = useRouter();

  const loginModal = useLoginModal();

  const hasFavorited = useMemo(() => {
    // We don't get an error if there's no currentUser
    const list = currentUser?.favoriteIds || [];

    return list.includes(listingId);
  }, [currentUser, listingId]);

  const toggleFavorite = useCallback(
    // Create an event parameter
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      // If you're not signed in, then open the login modal.
      if (!currentUser) {
        return loginModal.onOpen();
      }

      try {
        let request;

        // If we already have a listing liked, then we want to unlike it.
        if (hasFavorited) {
          request = () => axios.delete(`/api/favorites/${listingId}`);
        } else {
          // Else, like it.
          request = () => axios.post(`/api/favorites/${listingId}`);
        }

        await request();
        router.refresh();
        toast.success("Success");
      } catch (error) {
        toast.error("Something went wrong.");
      }
    },
    [currentUser, hasFavorited, listingId, loginModal, router]
  );

  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useFavorite;
