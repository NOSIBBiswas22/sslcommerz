"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminRefundPanel() {
  const [bankTranId, setBankTranId] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundRemarks, setRefundRemarks] = useState("");
  const [refundRefId, setRefundRefId] = useState("");
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleRefund = async () => {
    setLoadingA(true);
    setMessage("");
    setError(null);

    const data = {
      bank_tran_id: bankTranId,
      refund_amount: refundAmount,
      refund_remarks: refundRemarks,
    };

    try {
      // Make a POST request using fetch
      const response = await fetch("/api/sslcommerz/refund", {
        method: "POST", // Set the method to POST
        headers: {
          "Content-Type": "application/json", // Ensure you're sending JSON
        },
        body: JSON.stringify(data), // Convert data to JSON format
      });
      const result = await response.json(); // Parse the response as JSON

      if (result) {
        setMessage(result); // Display the full result
      } else {
        // Handle HTTP errors (e.g., status 400, 500)
        setError("An error occurred while processing the refund.");
      }
    } catch (err) {
      // Catch any network or other errors
      setError("An error occurred while processing the refund.");
    } finally {
      setLoadingA(false);
    }
  };

  const handleRefundStatus = async () => {
    setLoadingB(true);
    setMessage("");
    setError(null);

    const data = {
      refund_ref_id: refundRefId, // Assuming you need the same transaction ID for status check
    };

    try {
      // Make a POST request to check the refund status
      const response = await fetch("/api/sslcommerz/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result) {
        setMessage(result);
      } else {
        setError("An error occurred while checking the refund status.");
      }
    } catch (err) {
      setError("An error occurred while checking the refund status.");
    } finally {
      setLoadingB(false);
    }
  };

  return (
    <div className="bg-green-100 min-h-screen flex items-center justify-center">
      <div className="w-1/2 mx-auto p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-4 text-green-800">
          Admin Panel
        </h1>
        <hr />

        {/* Refund Initiation and Status Section Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Refund Initiation Section */}
          <div className=" rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-black">
              Initiate Refund
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">
                  Bank Transaction ID
                </label>
                <input
                  type="text"
                  value={bankTranId}
                  onChange={(e) => setBankTranId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 outline-green-200"
                  placeholder="Enter Bank Transaction ID"
                />
              </div>
              <div>
                <label className="block text-gray-700">Refund Amount</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 outline-green-200"
                  placeholder="Enter Refund Amount"
                />
              </div>
              <div>
                <label className="block text-gray-700">Refund Remarks</label>
                <textarea
                  value={refundRemarks}
                  onChange={(e) => setRefundRemarks(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 outline-green-200"
                  placeholder="Enter Refund Remarks"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleRefund}
                className="px-6 py-3 bg-green-300 font-bold text-gray-800 rounded-lg hover:bg-green-400 cursor-pointer"
                disabled={loadingA}
              >
                {loadingA ? "Processing..." : "Initiate Refund"}
              </button>
            </div>
          </div>

          {/* Refund Status Section */}
          <div className=" rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-black">
              Check Refund Status
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Refund Ref ID</label>
                <input
                  type="text"
                  value={refundRefId}
                  onChange={(e) => setRefundRefId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 outline-green-200"
                  placeholder="Enter Refund Ref ID"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleRefundStatus}
                className="px-6 py-3 bg-green-300 text-gray-700 font-bold rounded-lg hover:bg-green-400 cursor-pointer"
                disabled={loadingB}
              >
                {loadingB ? "Fetching..." : "Get Status"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {/* Display Results */}
        {message && (
          <div className="mt-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
            <h3 className="font-semibold">Response:</h3>
            <pre className="text-lg text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(message, null, 2)}
              {/* Format JSON for better readability */}
            </pre>
          </div>
        )}
        <div className="flex flex-row-reverse">
      <Link href={"/"}><button className="bg-green-500 text-white p-1 rounded-sm cursor-pointer mt-2 text-sm">GO BACK</button></Link></div>
      </div>
    </div>
  );
}
