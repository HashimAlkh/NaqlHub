import type { ReactNode } from "react";
import {
  Wifi,
  Armchair,
  CarFront,
  WashingMachine,
  ArrowUpDown,
  Bath,
  CookingPot,
  Users,
} from "lucide-react";

type EquipmentMetaItem = {
  label: string;
  icon: (props: { className?: string }) => ReactNode;
};

export const equipmentMeta = {
  wifi: {
    label: "WLAN",
    icon: Wifi,
  },
  furnished: {
    label: "möbliert",
    icon: Armchair,
  },
  parking: {
    label: "Parkplatz",
    icon: CarFront,
  },
  washing_machine: {
    label: "Waschmaschine",
    icon: WashingMachine,
  },
  elevator: {
    label: "Aufzug",
    icon: ArrowUpDown,
  },
  bathroom_private: {
    label: "Eigenes Bad",
    icon: Bath,
  },
  bathroom_shared: {
    label: "Gemeinsames Bad",
    icon: Users,
  },
  kitchen_private: {
    label: "Eigene Küche",
    icon: CookingPot,
  },
  kitchen_shared: {
    label: "Gemeinsame Küche",
    icon: Users,
  },
} satisfies Record<string, EquipmentMetaItem>;

export type EquipmentMetaKey = keyof typeof equipmentMeta;