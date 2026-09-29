import React from "react";
import { RolDetailClient } from "./rol-detail-client";

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

export default async function WireframeRolDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <RolDetailClient id={id} />;
}

