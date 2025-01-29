import axios from "axios";

export const createCharge = async (paymentObject) => {
  try {
    const tapResponse = await axios.post(
      `${process.env.TAP_URL}/v2/charges`,
      paymentObject,
      {
        headers: {
          Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Payment link:", tapResponse.data.transaction.url);
    return tapResponse.data.transaction.url;
  } catch (error) {
    console.error("Error creating charge:", error.response?.data || error.message);
    return null;
  }
};

export const createCardToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.TAP_URL}/tokens`,
      {
        card: {
          number: "5123450000000008", // Test card number
          exp_month: "12", // Expiry month
          exp_year: "25", // Expiry year
          cvc: "100", // CVC
          name: "Test User", // Cardholder name
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.id; // Card token
  } catch (error) {
    console.error("Error creating card token:", error.response?.data || error.message);
    return null;
  }
};