"use client";
import Container from "../reusable/Container";
import CategoryBox from "../reusable/CategoryBox";

import { useSearchParams, usePathname } from "next/navigation";
import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import {
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCastle,
  GiForestCamp,
  GiIsland,
} from "react-icons/gi";
import { GiSailboat } from "react-icons/gi";
import { IoIosCafe } from "react-icons/io";
import { BsSnow } from "react-icons/bs";
import { MdOutlineVilla } from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { IoDiamond } from "react-icons/io5";

export const categories = [
  {
    label: "City",
    icon: MdOutlineVilla,
    description: "This desk is in the city!",
  },
  {
    label: "Island",
    icon: GiIsland,
    description: "This desk is on an island!",
  },
  {
    label: "Cafe",
    icon: IoIosCafe,
    description: "This desk is in a cafe!",
  },

  {
    label: "Office",
    icon: HiOutlineBuildingOffice2,
    description: "This desk is in an office building!",
  },

  {
    label: "Mountains",
    icon: TbMountain,
    description: "This desk is in the mountains!",
  },
  {
    label: "Countryside",
    icon: GiBarn,
    description: "This desk is in the countryside!",
  },

  {
    label: "Beach",
    icon: TbBeach,
    description: "This desk is on the beach!",
  },

  {
    label: "Desert",
    icon: GiCactus,
    description: "This desk is in the desert!",
  },
  {
    label: "Historic",
    icon: GiCastle,
    description: "This desk is inside a historic property!",
  },
  {
    label: "Wilderness",
    icon: GiForestCamp,
    description: "This desk is in the wilderness!",
  },
  {
    label: "Arctic",
    icon: BsSnow,
    description: "This desk is in arctic environment!",
  },
  {
    label: "Lux",
    icon: IoDiamond,
    description: "This desk is in a luxury property!",
  },
  {
    label: "Pools",
    icon: TbPool,
    description: "This desk is in a building with a beautiful pool!",
  },
  {
    label: "Lake",
    icon: GiBoatFishing,
    description: "This desk is near a lake!",
  },
  {
    label: "Boat",
    icon: GiSailboat,
    description: "This desk is on a boat!",
  },
];
const Categories = () => {
  const params = useSearchParams();
  // Extract the category from the params.

  const category = params?.get("category");
  const pathname = usePathname();

  const isMainPage = pathname === "/";
  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div
        className="
  pt-4
  flex
  flex-row
  justify-between
  overflow-x-auto"
      >
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={category === item.label}
          />
        ))}
      </div>
    </Container>
  );
};

export default Categories;
