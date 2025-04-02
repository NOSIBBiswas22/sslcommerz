"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CancelPage() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100">
      <h1 className="text-3xl font-bold text-yellow-700">Payment Canceled</h1>
      <p className="mt-2 text-lg">Your payment was canceled.</p>
      {tranId && (
        <p className="mt-2 text-sm text-gray-700">
          Transaction ID: <span className="font-semibold">{tranId}</span>
        </p>
      )}
      <Link href="/">
        <button className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
          Go Back
        </button>
      </Link>
    </div>
  );
}
