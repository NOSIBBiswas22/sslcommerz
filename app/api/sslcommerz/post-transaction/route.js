import { NextResponse } from "next/server";
import { SslCommerzPayment } from "sslcommerz";

const store_id = process.env.SSLC_STORE_ID; // Store ID from SSLCommerz
const store_passwd = process.env.SSLC_STORE_PASSWORD; // Store Password from SSLCommerz
const is_live = false; // Set to true for live environment

const sslConfig = new SslCommerzPayment(store_id, store_passwd, is_live);

export async function POST(req) {
  const url = new URL(req.url); // Get the full URL
  const tran_id = url.searchParams.get("tran_id"); // Extract the 'tran_id' query parameter

  // Prepare data for querying the transaction status
  const queryData = { tran_id };

  try {
    // Call the transaction query API to fetch the transaction details
    const result = await sslConfig.transactionQueryByTransactionId(queryData);

    // Check if the result has status and transaction details
    if (result?.element[0]?.status === "VALID" || result?.element[0]?.status === "VALIDATED") {
      //       // The transaction is valid, return the details
      //       return NextResponse.json({ message: "Transaction found", transaction: result }, { status: 200 });
      console.log("Transaction successful");
      // Redirect to success page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/success?tran_id=${tran_id}`,
        303 // Forces GET request on redirect
      );
    } else {
      console.log("Transaction failed or invalid");
      // Redirect to failed page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/failed?tran_id=${tran_id}`,
        303
      );
    }
  } catch (error) {
    console.error("Error querying transaction:", error);
    // Redirect to failed page on error
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/failed?error=true`,
      303
    );
  }
}
