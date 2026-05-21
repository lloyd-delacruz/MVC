import {
  Stamp,
  Heart,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  UserRound,
  ScrollText,
  Users,
  Star,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Languages,
  CalendarDays,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import type { ComponentType } from "react";
import { MapleLeaf } from "@/components/ui/MapleLeaf";

export type IconComponent = ComponentType<{ className?: string; strokeWidth?: string | number }>;

// Allowlist of icons the client may choose in the admin. Storing a name (not
// code) keeps content safe; resolveIcon maps it back to a component.
const ICONS: Record<string, IconComponent> = {
  Stamp,
  Heart,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  UserRound,
  ScrollText,
  Users,
  Star,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Languages,
  CalendarDays,
  CreditCard,
  MapleLeaf,
};

const FALLBACK_ICON: IconComponent = HelpCircle;

export const ICON_NAMES = Object.keys(ICONS);

export function resolveIcon(name: string): IconComponent {
  return ICONS[name] ?? FALLBACK_ICON;
}
