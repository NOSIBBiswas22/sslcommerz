import { NextResponse } from "next/server";
import { SslCommerzPayment } from "sslcommerz";

const store_id = process.env.SSLC_STORE_ID; // Store ID from SSLCommerz
const store_passwd = process.env.SSLC_STORE_PASSWORD; // Store Password from SSLCommerz
const is_live = false; // Use true for live and false for sandbox

const sslConfig = new SslCommerzPayment(store_id, store_passwd, is_live);

export async function POST(req) {
  let { amount } = await req.json();
  
  function generateTransactionId() { 
    const prefix = "TrxID-"; // Fixed prefix
    const length = 6; // Random part length
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    // Generate a random 6-character alphanumeric string
    let randomString = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
  
    // Get the last 6 digits of the current timestamp for uniqueness
    const timestampPart = Date.now().toString().slice(-6);
  
    // Combine to form a 12-character unique ID
    return `${prefix}${randomString}${timestampPart}`;
  }
  
  // Example usage:
  const transactionId = generateTransactionId();

  const data = {
    total_amount: amount,
    tran_id: transactionId, // unique transaction ID
    currency: "BDT",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/sslcommerz/post-transaction?tran_id=${transactionId}`,
    fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/sslcommerz/post-transaction?tran_id=${transactionId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/sslcommerz/post-transaction?tran_id=${transactionId}`,
    // ipn_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/sslcommerz/ipn`, // For automatic validation
    shipping_method: "Courier",
    product_name: "Samsung Galaxy S23 Ultra",
    product_category: "mobile",
    product_profile: "general",
    cus_name: "Kajol Roy",
    cus_email: "shrikajol@gmail.com",
    cus_add1: "Lalmonirhat",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01705956055",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  try {
    const result = await sslConfig.init(data);

    if (!result.GatewayPageURL || result.status === "FAILED") {
      return NextResponse.json({ message: result.failedreason }, { status: 400 });
    }
    return NextResponse.json({ url: result.GatewayPageURL });
  } catch (error) {
    return NextResponse.json({ error: "Error: " + error }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Request denied!" });
}
