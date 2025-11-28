"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

interface BackButtonProps {
  href?: string;
  label?: string;
}

export function BackButton({ href, label = "Go Back" }: BackButtonProps) {
  const handleBack = () => {
    if (href) {
      window.location.href = href;
    } else {
      window.history.back();
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className="mb-6 hover:bg-accent hover:text-accent-foreground"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
