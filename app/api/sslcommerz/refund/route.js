import { NextResponse } from "next/server";
import { SslCommerzPayment } from "sslcommerz";

const store_id = process.env.SSLC_STORE_ID; // Store ID from SSLCommerz
const store_passwd = process.env.SSLC_STORE_PASSWORD; // Store Password from SSLCommerz
const is_live = false; // Set to true for live environment

const sslConfig = new SslCommerzPayment(store_id, store_passwd, is_live);

export async function POST(req) {
  const { bank_tran_id, refund_amount, refund_remarks, refund_ref_id } =
    await req.json(); // Extract data from the request body

  if (refund_ref_id) {
    const refund_data = {
      refund_ref_id: refund_ref_id,
    };
    try {
      // Call the refund API to process the refund
      const result = await sslConfig.refundQuery(refund_data);

      // Check if the refund was successful
      if (result.tran_id) {
        return NextResponse.json(
          { message: "Refund id found", details: result },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Refund id not found", error: result.errorReason },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Error processing refund status:", error);
      return NextResponse.json(
        { message: "Error processing refund status", error: error.message },
        { status: 500 }
      );
    }
  } else {
    // Prepare data for the refund API
    const refundData = {
      refund_amount: refund_amount, // The amount to be refunded
      refund_remarks: refund_remarks, // Any remarks for the refund
      bank_tran_id: bank_tran_id,
      refe_id: `EASY${Date.now()}${Math.floor(Math.random() * 1000)}`, 
    };

    try {
      // Call the refund API to process the refund
      const result = await sslConfig.initiateRefund(refundData);

      // Check if the refund was successful
      if (result.status == "success") {
        return NextResponse.json(
          { message: "Refund successfully initiated", details: result },
          { status: 200 }
        );
      }else if (result.errorReason) {
        return NextResponse.json(
          { message: result.errorReason, details: result },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { message: "Refund initiation failed", error: result },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { message: "Error processing refund", error: error.message },
        { status: 500 }
      );
    }
  }
}
