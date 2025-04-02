"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function FailedPage() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");
  const isError = searchParams.get("error");


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <h1 className="text-3xl font-bold text-red-700">Payment Failed!</h1>
      <p className="mt-2 text-lg">Something went wrong with your payment.</p>
      {tranId && (
        <p className="mt-2 text-sm text-gray-700">
          Transaction ID: <span className="font-semibold">{tranId}</span>
        </p>
      )}
      {isError && (
        <p className="mt-2 text-sm text-gray-600">
          An unexpected error occurred.
        </p>
      )}
      <Link href="/">
        <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Try Again
        </button>
      </Link>
    </div>
  );
}
