"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  HiUser,
  HiMail,
  HiLockClosed,
  HiTrash,
  HiPencil,
  HiCheck,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import {
  useProfile,
  useUpdateProfile,
  useChangeEmail,
  useChangePassword,
  useDeleteAccount,
} from "@/hooks/use-profile";

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center">
          <Icon className="text-primary-600 text-base" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ─── Password input ───────────────────────────────────────────────────────────

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 px-3.5 pr-10 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? (
            <HiEyeOff className="text-base" />
          ) : (
            <HiEye className="text-base" />
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { data: session } = useSession();
  const { data, isLoading } = useProfile();
  const user = data?.user;

  // ── Update profile state ───────────────────────────────────────────────────
  const [name, setName] = useState("");
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  // ── Change email state ─────────────────────────────────────────────────────
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const { mutate: changeEmail, isPending: isChangingEmail } = useChangeEmail();

  // ── Change password state ──────────────────────────────────────────────────
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const { mutate: changePassword, isPending: isChangingPw } =
    useChangePassword();

  // ── Delete account state ───────────────────────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletePw, setDeletePw] = useState("");
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto space-y-4 py-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-4 py-2">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
          <Image
            src={user?.image ?? session?.user?.image ?? "/user.png"}
            alt={user?.name ?? "User"}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900">
            {user?.name ?? "—"}
          </h1>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-primary-50 text-primary-600 border border-primary-100 mt-1 inline-block">
            {user?.role}
          </span>
        </div>
      </div>

      {/* ── Edit Name ─────────────────────────────────────────────────────── */}
      <Section
        icon={HiUser}
        title="Profile"
        description="Update your display name"
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={user?.name ?? ""}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full h-10 px-3.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200"
            />
          </div>
          <button
            type="button"
            onClick={() => updateProfile({ name })}
            disabled={isUpdating || !name.trim()}
            className="flex items-center gap-1.5 h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <HiCheck className="text-sm" />
            )}
            Save Changes
          </button>
        </div>
      </Section>

      {/* ── Change Email ──────────────────────────────────────────────────── */}
      <Section
        icon={HiMail}
        title="Email Address"
        description="Change your login email"
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">
              New Email
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder={user?.email}
              className="w-full h-10 px-3.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200"
            />
          </div>
          <PasswordInput
            label="Confirm Password"
            value={emailPassword}
            onChange={setEmailPassword}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => {
              changeEmail(
                { email: newEmail, password: emailPassword },
                {
                  onSuccess: () => {
                    setNewEmail("");
                    setEmailPassword("");
                  },
                },
              );
            }}
            disabled={isChangingEmail || !newEmail.trim()}
            className="flex items-center gap-1.5 h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isChangingEmail ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <HiCheck className="text-sm" />
            )}
            Update Email
          </button>
        </div>
      </Section>

      {/* ── Change Password ───────────────────────────────────────────────── */}
      <Section
        icon={HiLockClosed}
        title="Password"
        description="Update your account password"
      >
        <div className="space-y-3">
          <PasswordInput
            label="Current Password"
            value={currentPw}
            onChange={setCurrentPw}
            placeholder="Enter current password"
          />
          <PasswordInput
            label="New Password"
            value={newPw}
            onChange={setNewPw}
            placeholder="Min 8 chars, 1 uppercase"
          />
          <PasswordInput
            label="Confirm New Password"
            value={confirmPw}
            onChange={setConfirmPw}
            placeholder="Repeat new password"
          />

          {newPw && confirmPw && newPw !== confirmPw && (
            <p className="text-xs text-red-500">Passwords do not match.</p>
          )}

          <button
            type="button"
            onClick={() => {
              changePassword(
                { currentPassword: currentPw, newPassword: newPw },
                {
                  onSuccess: () => {
                    setCurrentPw("");
                    setNewPw("");
                    setConfirmPw("");
                  },
                },
              );
            }}
            disabled={
              isChangingPw || !currentPw || !newPw || newPw !== confirmPw
            }
            className="flex items-center gap-1.5 h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isChangingPw ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <HiCheck className="text-sm" />
            )}
            Change Password
          </button>
        </div>
      </Section>

      {/* ── Delete Account ────────────────────────────────────────────────── */}
      <div className="bg-white border border-red-100 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-red-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
            <HiTrash className="text-red-500 text-base" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Delete Account</h2>
            <p className="text-xs text-gray-400">
              Permanently remove your account and all data
            </p>
          </div>
        </div>
        <div className="px-6 py-5">
          {!deleteConfirm ? (
            <button
              type="button"
              onClick={() => setDeleteConfirm(true)}
              className="h-9 px-4 text-xs font-bold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors duration-150"
            >
              Delete My Account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-red-600 font-semibold">
                ⚠ This action is irreversible. All your data will be permanently
                deleted.
              </p>
              <PasswordInput
                label="Confirm Password"
                value={deletePw}
                onChange={setDeletePw}
                placeholder="Enter your password to confirm"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirm(false);
                    setDeletePw("");
                  }}
                  className="h-9 px-4 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteAccount({ password: deletePw })}
                  disabled={isDeleting}
                  className="flex items-center gap-1.5 h-9 px-4 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors duration-150 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <HiTrash className="text-sm" />
                  )}
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
