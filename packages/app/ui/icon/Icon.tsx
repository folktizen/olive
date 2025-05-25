import * as IconList from "public/assets/icons";

export type IconName =
  | "arrow-external"
  | "arrow-left"
  | "blocks"
  | "caret-down"
  | "caret-left"
  | "caret-right"
  | "check"
  | "checkbox"
  | "close"
  | "discord"
  | "info"
  | "menu"
  | "plus"
  | "search"
  | "sparkles"
  | "stackly"
  | "swap"
  | "warning";

interface IconProps {
  alt?: string;
  className?: string;
  name: IconName;
  size?: number;
}

export const iconMap: Record<IconName, any> = {
  "arrow-external": IconList.ArrowExternalIcon,
  "arrow-left": IconList.ArrowLeftIcon,
  blocks: IconList.FourBlocksIcon,
  "caret-down": IconList.CaretDownIcon,
  "caret-left": IconList.CaretLeftIcon,
  "caret-right": IconList.CaretRightIcon,
  check: IconList.CheckmarkIcon,
  checkbox: IconList.CheckboxIcon,
  close: IconList.CloseIcon,
  discord: IconList.DiscordIcon,
  info: IconList.InfoIcon,
  menu: IconList.HamburgerIcon,
  plus: IconList.PlusIcon,
  search: IconList.SearchIcon,
  sparkles: IconList.SparklesIcon,
  stackly: IconList.StacklyLogoIcon,
  swap: IconList.SwapIcon,
  warning: IconList.WarningIcon,
};

export const Icon = ({ alt, className, name, size = 20 }: IconProps) => {
  const IconComponent = iconMap[name];

  return (
    <IconComponent className={className} height={size} title={alt ? alt : name} width={size} />
  );
};
