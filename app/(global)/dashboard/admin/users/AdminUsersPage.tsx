"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiSearch,
  HiEye,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
  HiBan,
  HiCheckCircle,
} from "react-icons/hi";
import {
  useAdminUsers,
  useUpdateAdminUser,
  useDeleteAdminUser,
} from "@/hooks/use-admin-user";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [banned, setBanned] = useState("");
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const { data, isLoading } = useAdminUsers({
    page,
    search: query,
    role,
    banned,
  });
  const { mutate: update } = useUpdateAdminUser();
  const { mutate: remove, isPending: isDeleting } = useDeleteAdminUser();

  const users = data?.users ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.totalUsers ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
    setPage(1);
  };

  return (
    <div className="space-y-5 max-w-6xl">
      <div>
        <h1 className="text-xl font-black text-gray-900">Users</h1>
        <p className="text-xs text-gray-400 mt-0.5">{total} users total</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-60 h-9 pl-9 pr-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            className="h-9 px-3 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Search
          </button>
        </form>

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 text-xs font-semibold border border-gray-200 rounded-xl bg-white outline-none text-gray-600"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={banned}
          onChange={(e) => {
            setBanned(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 text-xs font-semibold border border-gray-200 rounded-xl bg-white outline-none text-gray-600"
        >
          <option value="">All Users</option>
          <option value="false">Active</option>
          <option value="true">Banned</option>
        </select>

        {(query || role || banned) && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setQuery("");
              setRole("");
              setBanned("");
              setPage(1);
            }}
            className="h-9 px-3 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
          {["User", "Role", "Status", "Joined", "Actions"].map((h) => (
            <p
              key={h}
              className="text-xs font-bold text-gray-500 uppercase tracking-wide"
            >
              {h}
            </p>
          ))}
        </div>

        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 px-5 py-4"
              >
                {[1, 2, 3, 4, 5].map((j) => (
                  <div
                    key={j}
                    className="h-4 bg-gray-100 rounded animate-pulse"
                  />
                ))}
              </div>
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name ?? ""}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {user.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {user.name ?? "—"}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg w-fit ${
                    user.role === "admin"
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {user.role}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg w-fit ${
                    user.banned
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-primary-50 text-primary-700 border border-primary-200"
                  }`}
                >
                  {user.banned ? "Banned" : "Active"}
                </span>

                <p className="text-xs text-gray-400">
                  {formatDate(user.createdAt)}
                </p>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/dashboard/admin/users/${user.id}`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 border border-transparent hover:border-primary-200 transition-all duration-150"
                  >
                    <HiEye className="text-sm" />
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      update({ id: user.id, payload: { banned: !user.banned } })
                    }
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border border-transparent transition-all duration-150 ${
                      user.banned
                        ? "text-gray-400 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-200"
                        : "text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
                    }`}
                  >
                    {user.banned ? (
                      <HiCheckCircle className="text-sm" />
                    ) : (
                      <HiBan className="text-sm" />
                    )}
                  </button>

                  {confirmId === user.id ? (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          remove(user.id);
                          setConfirmId(null);
                        }}
                        disabled={isDeleting}
                        className="h-8 px-2 text-[10px] font-bold bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="h-8 px-2 text-[10px] font-bold border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmId(user.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-150"
                    >
                      <HiTrash className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-gray-500">
              No users found
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <HiChevronLeft className="text-sm" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className="text-xs text-gray-400 px-1">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-colors ${page === p ? "bg-primary-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                  >
                    {p}
                  </button>
                ),
              )}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <HiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
