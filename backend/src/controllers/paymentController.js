import { Payment } from "../models/Payment.js";
import { Tenant } from "../models/Tenant.js";
import { Notification } from "../models/Notification.js";

export const createPayment = async (req, res) => {
  try {
    const { amount, paidMonths, paymentMethod, transactionId, notes } = req.body;

    // Find tenant by userId
    const tenant = await Tenant.findOne({ userId: req.user.id }).populate("propertyId");
    if (!tenant) return res.status(404).json({ message: "Tenant record not found" });

    const payment = await Payment.create({
      tenantId: tenant._id,
      propertyId: tenant.propertyId._id,
      landlordId: tenant.propertyId.userId,
      amount,
      paidMonths, // Expecting array: [{month, year}]
      paymentMethod,
      transactionId,
      notes,
      status: "pending"
    });

    // Format months for notification
    const monthsStr = paidMonths.map(m => `${m.month}/${m.year}`).join(", ");

    // Notify Landlord
    await Notification.create({
      userId: tenant.propertyId.userId,
      title: "Rent Payment Received",
      message: `Tenant ${tenant.name} submitted ₹${amount} for [${monthsStr}].`,
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

    const monthsStr = payment.paidMonths.map(m => `${m.month}/${m.year}`).join(", ");

    // Notify Tenant
    await Notification.create({
      userId: payment.tenantId.userId,
      title: status === "approved" ? "Payment Approved" : "Payment Rejected",
      message: status === "approved" 
        ? `Your rent payment of ₹${payment.amount} for [${monthsStr}] has been approved.`
        : `Your rent payment of ₹${payment.amount} for [${monthsStr}] was rejected.`,
      type: "payment_approved",
      link: "/payments"
    });

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
