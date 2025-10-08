"use client";

import { ReactNode } from "react";

interface MainProps {
  children: ReactNode;
}

export function Main({ children }: MainProps) {
  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">{children}</div>
    </main>
  );
}
