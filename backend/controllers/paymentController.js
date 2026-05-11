const axios = require("axios");
const User = require("../models/User");
const Payment = require("../models/Payment");

const CHAPA_SECRET = process.env.CHAPA_SECRET_KEY;
const CHAPA_INIT_URL = "https://api.chapa.co/v1/transaction/initialize";

// =========================
// INITIATE PAYMENT
// =========================
exports.initiatePayment = async (req, res) => {
  try {
    const company = await User.findById(req.user._id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const tx_ref = `upgrade-${company._id}-${Date.now()}`;

    const nameParts = company.name.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Company";

    const payload = {
      amount: "500",
      currency: "ETB",
      email: company.email,
      first_name,
      last_name,
      tx_ref,

      callback_url: `${process.env.BACKEND_URL}/api/payment/verify`,
      return_url: `${process.env.FRONTEND_URL}/company/payment-success?tx_ref=${tx_ref}`,

      customization: {
        title: "Intern Upgrade",
        description: "Unlock 2 internship posts",
      },
    };

    const response = await axios.post(CHAPA_INIT_URL, payload, {
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET}`,
        "Content-Type": "application/json",
      },
    });

    // =========================
    // SAVE PAYMENT SESSION
    // =========================
    await Payment.findOneAndUpdate(
      { company: company._id },
      {
        $set: {
          company: company._id,
          pendingTxRef: tx_ref,
          tx_ref,
          status: "pending",
        },
        $setOnInsert: {
          freePostsUsed: 0,
          paidPostCredits: 0,
          amount: 500,
        },
      },
      { upsert: true, new: true }
    );

    return res.json({
      checkout_url: response.data.data.checkout_url,
      tx_ref,
    });
  } catch (err) {
    console.error("🔥 CHAPA INIT ERROR:", err.response?.data || err);

    return res.status(500).json({
      message: err.response?.data || err.message,
    });
  }
};

// =========================
// VERIFY PAYMENT
// =========================
exports.verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.query;

    if (!tx_ref) {
      return res.status(400).json({ success: false, message: "Missing tx_ref" });
    }

    const verifyRes = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: { Authorization: `Bearer ${CHAPA_SECRET}` },
      }
    );

    const chapaStatus = verifyRes.data?.data?.status?.toLowerCase();

    const paymentData = await Payment.findOne({ tx_ref });

    if (!paymentData) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

   if (chapaStatus === "success") {
  paymentData.postsRemaining = 2; // reset to 2 posts
  paymentData.subscriptionStart = new Date();
  paymentData.subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  paymentData.status = "success";
  paymentData.pendingTxRef = null;
  paymentData.paidAt = new Date();

  await paymentData.save();

  return res.json({ success: true });
}

    paymentData.status = "failed";
    await paymentData.save();

    return res.json({
      success: false,
      message: "Payment not completed",
    });
  } catch (err) {
    console.error("VERIFY ERROR:", err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};