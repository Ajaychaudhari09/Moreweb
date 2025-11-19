// src/components/Icon.tsx
"use client";

import * as RadixIcons from "@radix-ui/react-icons";
import * as TablerIcons from "@tabler/icons-react";
import * as PhosphorIcons from "@phosphor-icons/react";

type IconLibrary = "radix" | "tabler" | "phosphor";

interface IconProps {
  name: string;
  lib?: IconLibrary;
  size?: number;
  className?: string;
}

export default function Icon({ name, lib = "radix", size = 20, className }: IconProps) {
  const libraries = {
    radix: RadixIcons,
    tabler: TablerIcons,
    phosphor: PhosphorIcons,
  };

  const IconComponent = (libraries[lib] as any)[name];

  if (!IconComponent) {
    console.warn(`⚠️ Icon "${name}" not found in ${lib}.Check spelling.`);
    return null;
  }

  return <IconComponent size={size} className={className} />;
}
