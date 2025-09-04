"use client";
import { motion } from "motion/react";
import ClipLoader from "react-spinners/ClipLoader";

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDeleteModal({
  open,
  title = "Delete NFT",
  message = "Are you sure you want to delete this NFT? This action cannot be undone.",
  confirmLabel = "Yes, delete",
  cancelLabel = "Cancel",
  pending = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => {
          if (!pending) onCancel();
        }}
      />
      <motion.div
        className="relative z-10 w-[92vw] max-w-[480px] rounded-2xl p-5 bg-[#140C1F] border border-white/15 text-white"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-white/80">{message}</p>
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <motion.button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-[10px] bg-red-600/80 px-5 py-2 text-white disabled:opacity-70"
            whileHover={{ scale: pending ? 1 : 1.02 }}
            whileTap={{ scale: pending ? 1 : 0.98 }}
          >
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <ClipLoader size={16} color="#fff" />
                Deleting...
              </span>
            ) : (
              confirmLabel
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
