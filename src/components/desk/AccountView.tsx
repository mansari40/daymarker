"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useSession, signOut } from "next-auth/react";
import { Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface UserStats {
  memberSince: string | null;
  totalCompleted: number;
}

interface AccountViewProps {
  compact?: boolean;
}

export function AccountView({ compact = false }: AccountViewProps) {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (passwordSuccess) {
      const timer = setTimeout(() => setPasswordSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [passwordSuccess]);

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || "Something went wrong");
        return;
      }

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordError("Network error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    setDeleteLoading(true);

    try {
      const res = await fetch("/api/user/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || "Something went wrong");
        setDeleteLoading(false);
        return;
      }

      signOut({ callbackUrl: "/" });
    } catch {
      setDeleteError("Network error");
      setDeleteLoading(false);
    }
  };

  const user = session?.user;
  const memberSinceDate = stats?.memberSince
    ? new Date(stats.memberSince).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const p = compact ? "p-4" : "p-6";
  const gap = compact ? "gap-3" : "gap-4";
  const mt = compact ? "mt-3" : "mt-4";

  return (
    <div className={compact ? "w-full" : "mt-2 max-w-2xl"}>
      {/* User Info */}
      <div className={`rounded-[--radius-lg] bg-bg-panel border border-border-subtle ${p}`}>
        <span className="text-label font-semibold uppercase tracking-widest text-accent-400">
          Profile
        </span>
        <div className={`flex flex-col ${gap}`} style={{ marginTop: compact ? "10px" : "16px" }}>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">
              Name
            </span>
            <span className={`${compact ? "text-small" : "text-body"} text-text-primary`}>{user?.name || "—"}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">
              Email
            </span>
            <span className={`${compact ? "text-small" : "text-body"} text-text-primary`}>{user?.email || "—"}</span>
          </div>
          {memberSinceDate && (
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">
                Member since
              </span>
              <span className={`${compact ? "text-small" : "text-body"} text-text-primary`}>{memberSinceDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className={`${mt} rounded-[--radius-lg] bg-bg-panel border border-border-subtle ${p}`}>
          <span className="text-label font-semibold uppercase tracking-widest text-accent-400">
            Your activity
          </span>
          <div className="flex items-center gap-6" style={{ marginTop: compact ? "10px" : "16px" }}>
            <div className="flex flex-col gap-0.5">
              <span className={`${compact ? "text-body" : "text-h2"} font-bold text-text-primary`}>
                {stats.totalCompleted}
              </span>
              <span className={`${compact ? "text-[12px]" : "text-small"} text-text-secondary`}>Tasks completed</span>
            </div>
          </div>
        </div>
      )}

      {/* Change Password */}
      <div className={`${mt} rounded-[--radius-lg] bg-bg-panel border border-border-subtle ${p}`}>
        <span className="text-label font-semibold uppercase tracking-widest text-accent-400">
          Change password
        </span>

        <form onSubmit={handlePasswordChange} className={`flex flex-col ${compact ? "gap-3" : "gap-5"}`} style={{ marginTop: compact ? "10px" : "16px" }}>
          <div className="relative">
            <Input
              label="Current password"
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={compact ? "h-10 text-small" : ""}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-[38px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="New password"
              type={showNew ? "text" : "password"}
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className={compact ? "h-10 text-small" : ""}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-[38px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm new password"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className={compact ? "h-10 text-small" : ""}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-[38px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {passwordError && (
            <p className="text-[13px] text-red-400">{passwordError}</p>
          )}

          {passwordSuccess && (
            <div className="flex items-center gap-2 rounded-[--radius-sm] bg-green-500/10 border border-green-500/20 px-3 py-2">
              <CheckCircle size={14} className="text-green-400 shrink-0" />
              <p className="text-[13px] text-green-400">Password successfully changed.</p>
            </div>
          )}

          <div>
            <Button type="submit" disabled={passwordLoading} size={compact ? "sm" : "md"}>
              {passwordLoading ? "Changing..." : "Change password"}
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Account — inline link in compact, card in full */}
      {compact ? (
        <div className={`${mt} border-t border-border-subtle pt-3`}>
          <button
            onClick={() => {
              setShowDeleteModal(true);
              setDeleteConfirmText("");
              setDeletePassword("");
              setDeleteError(null);
            }}
            className="text-[13px] text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          >
            Delete account
          </button>
        </div>
      ) : (
        <div className={`${mt} rounded-[--radius-lg] bg-bg-panel border border-red-500/20 p-6`}>
          <span className="text-label font-semibold uppercase tracking-widest text-red-400">
            Danger zone
          </span>
          <p className="mt-2 text-small text-text-secondary">
            Permanently delete your account and all associated tasks. This action cannot be undone.
          </p>
          <div className="mt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(true);
                setDeleteConfirmText("");
                setDeletePassword("");
                setDeleteError(null);
              }}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/40"
            >
              Delete account
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeleteModal(false);
          }}
        >
          <div
            className="relative w-full max-w-md rounded-[--radius-lg] bg-bg-panel border border-border-subtle p-8 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={20} className="text-red-400" />
              <h3 className="text-h2 font-bold text-text-primary">Delete account</h3>
            </div>

            <p className="text-body text-text-secondary">
              This will permanently delete your account and all tasks. Type{" "}
              <span className="font-mono font-bold text-text-primary">DELETE</span> to
              confirm.
            </p>

            <div className="mt-4 flex flex-col gap-4">
              <Input
                label="Type DELETE to confirm"
                placeholder="DELETE"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
              <div className="relative">
                <Input
                  label="Your password"
                  type={showDeletePassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-3 top-[38px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
                >
                  {showDeletePassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {deleteError && (
              <p className="mt-3 text-small text-red-400">{deleteError}</p>
            )}

            <div className="flex items-center gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={deleteConfirmText !== "DELETE" || !deletePassword || deleteLoading}
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white border-none"
              >
                {deleteLoading ? "Deleting..." : "Delete permanently"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
