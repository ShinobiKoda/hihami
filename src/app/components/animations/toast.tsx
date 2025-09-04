"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle } from "react-icons/fa";
import React from "react";

export function ToastProvider() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  );
}

export function notifyLoginSuccess(displayName: string) {
  const name = displayName?.trim();
  toast.success(
    <span className="flex items-start gap-2">
      <FaCheckCircle className="mt-0.5 text-emerald-400" size={18} />
      <span>
        <strong className="font-semibold">Successfully logged in</strong>
        <br />
        <span className="opacity-90">as {name}</span>
      </span>
    </span>,
    { icon: false }
  );
}

export function notifyNFTCreated(nftName?: string) {
  const name = nftName?.trim();
  toast.success(
    <span className="flex items-start gap-2">
      <FaCheckCircle className="mt-0.5 text-emerald-400" size={18} />
      <span>
        <strong className="font-semibold">NFT successfully created</strong>
        {name ? (
          <>
            <br />
            <span className="opacity-90">{name}</span>
          </>
        ) : null}
      </span>
    </span>,
    { icon: false }
  );
}

const REDIRECT_TOAST_ID = "redirecting-dashboard" as const;

export function showRedirectingToDashboard() {
  // Loading toast that persists across navigation until dismissed
  toast.loading("Redirecting to dashboard…", {
    toastId: REDIRECT_TOAST_ID,
    closeOnClick: false,
    autoClose: false,
  });
}

export function dismissRedirectingToast() {
  toast.dismiss(REDIRECT_TOAST_ID);
}
