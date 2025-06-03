import { ColumnDef } from "@tanstack/react-table";
import { generateFakeUsers } from "../lib/users";
import { User } from "../types/user";
import { ClientTableWrapper } from "../components/client-table-wrapper";

const data = generateFakeUsers();

const columns: ColumnDef<User>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "firstName", header: "First Name" },
  { accessorKey: "lastName", header: "Last Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "registeredDate", header: "Registered Date" },
  { accessorKey: "fullName", header: "Full Name" },
  { accessorKey: "dsr", header: "DSR" },
];

export default function Home() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Thrive Table</h1>
      <ClientTableWrapper data={data} columns={columns} />
    </main>
  );
}
