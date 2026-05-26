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

export function resolveIcon(name: string): IconComponent {
  return ICONS[name] ?? FALLBACK_ICON;
}
