"use client";

import { useRouter } from "next/navigation";

import Button from "./Button";
import Heading from "./Heading";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}
// Assign the props to the EmptyState component
const EmptyState: React.FC<EmptyStateProps> = ({
  //   Extract the props from the EmptyState component
  // Assign default values to the props
  title = "No exact matches",
  subtitle = "Try adjusting or removing some of your filters to find what you are looking for.",
  showReset,
}) => {
  const router = useRouter();

  return (
    <div
      className="
    h-[60vh]
    flex 
    flex-col 
    gap-2 
    justify-center 
    items-center 
  "
    >
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            outline
            label="Remove all filters"
            onClick={() => router.push("/")}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
