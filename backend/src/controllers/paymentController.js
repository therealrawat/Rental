import { Payment } from "../models/Payment.js";
import { Tenant } from "../models/Tenant.js";
import { Notification } from "../models/Notification.js";

export const createPayment = async (req, res) => {
  try {
    const { amount, month, year, paymentMethod, transactionId, notes } = req.body;

    // Find tenant by userId
    const tenant = await Tenant.findOne({ userId: req.user.id }).populate("propertyId");
    if (!tenant) return res.status(404).json({ message: "Tenant record not found" });

    const day = new Date().getDate();
    // Restriction: Payment usually 1-5 of the month (optional but can be enforced or just warned)
    // For now, let's just create it.

    const payment = await Payment.create({
      tenantId: tenant._id,
      propertyId: tenant.propertyId._id,
      landlordId: tenant.propertyId.userId,
      amount,
      month,
      year,
      paymentMethod,
      transactionId,
      notes,
      status: "pending"
    });

    // Notify Landlord
    await Notification.create({
      userId: tenant.propertyId.userId,
      title: "Rent Payment Received",
      message: `Tenant ${tenant.name} has submitted a payment of ₹${amount} for ${month}/${year}. Please approve it.`,
      type: "payment_received",
      link: "/finance"
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listPayments = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "tenant") {
      const tenant = await Tenant.findOne({ userId: req.user.id });
      if (!tenant) return res.json([]);
      filter = { tenantId: tenant._id };
    } else {
      filter = { landlordId: req.user.id };
    }

    const payments = await Payment.find(filter)
      .populate("tenantId", "name email")
      .populate("propertyId", "name address")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approvePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // approved or rejected

    const payment = await Payment.findById(id).populate("tenantId");
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Security: Only landlord can approve
    if (String(payment.landlordId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    payment.status = status;
    await payment.save();

    // Notify Tenant
    await Notification.create({
      userId: payment.tenantId.userId,
      title: status === "approved" ? "Payment Approved" : "Payment Rejected",
      message: status === "approved" 
        ? `Your rent payment of ₹${payment.amount} for ${payment.month}/${payment.year} has been approved.`
        : `Your rent payment of ₹${payment.amount} for ${payment.month}/${payment.year} was rejected. Reason: ${req.body.reason || 'Check with landlord'}.`,
      type: "payment_approved",
      link: "/payments"
    });

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
