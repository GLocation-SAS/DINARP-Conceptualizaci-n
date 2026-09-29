import React from "react";
import { RolEditClient } from "./rol-edit-client";

export function generateStaticParams() {
  return [
    { id: "ROL-001" },
    { id: "ROL-002" },
    { id: "ROL-003" },
    { id: "ROL-004" },
    { id: "ROL-005" },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WireframeRolEditPage({ params }: PageProps) {
  const { id } = await params;
  return <RolEditClient id={id} />;
}

