"use client";

import { ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import { User } from "../types/user";

const UserTable = dynamic(
  () => import("./user-table").then((mod) => mod.UserTable),
  { ssr: false }
);

interface ClientTableWrapperProps {
  data: User[];
  columns: ColumnDef<User>[];
}

export function ClientTableWrapper({ data, columns }: ClientTableWrapperProps) {
  return <UserTable data={data} columns={columns} />;
}
