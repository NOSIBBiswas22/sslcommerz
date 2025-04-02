import { NextResponse } from "next/server";
import { SslCommerzPayment } from "sslcommerz";

const store_id = process.env.SSLC_STORE_ID; // Store ID from SSLCommerz
const store_passwd = process.env.SSLC_STORE_PASSWORD; // Store Password from SSLCommerz
const is_live = false; // Set to true for live environment

const sslConfig = new SslCommerzPayment(store_id, store_passwd, is_live);

export async function POST(req) {
  const { tran_id } = await req.json(); // Extract transaction ID from the request body
  // const url = new URL(req.url);  // Get the full URL
  // const tran_id = url.searchParams.get("tran_id");  // Extract the 'tran_id' query parameter

  // Prepare data for querying the transaction status
  const queryData = {
    tran_id: tran_id,
  };

  try {
    // Call the transaction query API to fetch the transaction details
    const result = await sslConfig.transactionQueryByTransactionId(queryData);

    // Check if the result has status and transaction details
    if (result.element[0].status === "VALID") {
      // The transaction is valid, return the details
      return NextResponse.json(
        { message: "Transaction found", tran_details: result },
        { status: 200 }
      );
    } else if (result.element[0].status === "VALIDATED") {
      // The transaction is valid, return the details
      return NextResponse.json(
        { message: "Transaction already validated", tran_details: result },
        { status: 200 }
      );
    } else {
      // If the transaction is not valid or not found, return an error message
      return NextResponse.json(
        { message: "Transaction not found or invalid", error: result },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error querying transaction:", error);
    return NextResponse.json(
      { message: "Error querying transaction", error: error.message },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import { SslCommerzPayment } from "sslcommerz";

// const store_id = process.env.SSLC_STORE_ID; // Store ID from SSLCommerz
// const store_passwd = process.env.SSLC_STORE_PASSWORD; // Store Password from SSLCommerz
// const is_live = false; // Use true for live and false for sandbox

// const sslConfig = new SslCommerzPayment(store_id, store_passwd, is_live);

// export async function POST(req) {
//   // Grab the POST request from SSLCommerz IPN
//   const data = await req.formData(); // Get the form data from the IPN POST request

//   console.log("data:",data)
//   const transactionId = data.get("tran_id");
//   const paymentStatus = data.get("status");
//   const paymentAmount = data.get("amount");
//   const paymentCurrency = data.get("currency");

//   // Initialize the data to verify the payment
//   const verificationData = {
//     tran_id: transactionId,
//   };

//   try {
//     // Make the verification call to SSLCommerz
//     const result = await sslConfig.validatePayment(verificationData);

//     // Check the verification status and the amount
//     if (result.status === "VALID" && paymentStatus === "SUCCESS" && result.amount === paymentAmount && result.currency === paymentCurrency) {
//       // Payment is valid and successful, process your business logic here
//       return NextResponse.json({ message: "Payment validated successfully", transaction: result }, { status: 200 });
//     } else {
//       // If the payment is not valid, return a failure response
//       return NextResponse.json({ message: "Payment validation failed", error: result }, { status: 400 });
//     }
//   } catch (error) {
//     return NextResponse.json({ message: "Error during payment validation", error: error }, { status: 500 });
//   }
// }
