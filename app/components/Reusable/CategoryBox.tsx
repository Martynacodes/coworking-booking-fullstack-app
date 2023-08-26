import { IconType } from "react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import qs from "query-string";

interface CategoryProps {
  icon: IconType;
  label: string;
  selected?: boolean;
}

const CategoryBox: React.FC<CategoryProps> = ({
  icon: Icon,
  label,
  selected,
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    // Define an empty query object.
    let currentQuery = {};

    // Look through the current params. Check if they are an object
    // Check if there are params, because they can be a type of null.
    if (params) {
      // Create an object out of the current parameters.
      currentQuery = qs.parse(params.toString());
    }

    // Spread the current query into a new object.
    const updatedQuery: any = {
      ...currentQuery,
      // When one of the category boxes gets clicked on,
      // the current label is going to be assigned to category param in the url.
      category: label,
    };
    // If the category we click on has already been selected before,
    //(if we click the same category twice),
    // we want to reset it, meaning remove the selection
    if (params?.get("category") === label) {
      delete updatedQuery.category;
    }
    // Generate the new url with the updated query.
    // Remove the category from the query and generate the new url with the updated query.
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );
    router.push(url);
  }, [label, params, router]);
  return (
    <div
      onClick={handleClick}
      className={`
        flex 
        flex-col 
        items-center 
        justify-center 
        gap-2
        p-3
        border-b-2
        hover:text-neutral-800
        transition
        cursor-pointer
        ${selected ? "border-b-neutral-800" : "border-transparent"}
        ${selected ? "text-neutral-800" : "text-neutral-500"}

    `}
    >
      <Icon size={26} />
      <div className="font-medium text-sm">{label}</div>
    </div>
  );
};

export default CategoryBox;
