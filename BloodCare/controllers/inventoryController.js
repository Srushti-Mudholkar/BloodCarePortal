import Inventory from "../models/inventoryModel.js";
import Users from "../models/userModel.js";
import { sendDonationConfirmationEmail, sendBloodIssuedEmail } from "../utils/emailService.js";

// CREATE BLOOD INVENTORY (donation in / request out)
export const createInventoryController = async (req, res) => {
  try {
    const { inventoryType, bloodGroup, quantity, email, organisation } = req.body;

    // Validate donor/hospital email
    if (inventoryType === "in") {
      const donor = await Users.findOne({ email, role: "donor" });
      if (!donor) {
        return res.status(404).send({ success: false, message: "Donor not found with this email" });
      }
      // Check donor blood group matches
      if (donor.bloodGroup !== bloodGroup) {
        return res.status(400).send({
          success: false,
          message: `Donor blood group is ${donor.bloodGroup}, not ${bloodGroup}`,
        });
      }
      const inventory = new Inventory({ ...req.body, donor: donor._id });
      await inventory.save();

      // Send confirmation email to donor
      const org = await Users.findById(req.body.userId);
      await sendDonationConfirmationEmail({
        donorEmail: donor.email,
        donorName: donor.name,
        bloodGroup,
        quantity,
        orgName: org?.organisationName || "BloodCare Organisation",
      });

      return res.status(201).send({ success: true, message: "Blood donated successfully", inventory });
    }

    if (inventoryType === "out") {
      const hospital = await Users.findOne({ email, role: "hospital" });
      if (!hospital) {
        return res.status(404).send({ success: false, message: "Hospital not found with this email" });
      }

      // Check available blood
      const orgId = organisation || req.body.userId;
      const totalIn = await Inventory.aggregate([
        { $match: { organisation: orgId, bloodGroup, inventoryType: "in" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]);
      const totalOut = await Inventory.aggregate([
        { $match: { organisation: orgId, bloodGroup, inventoryType: "out" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]);

      const available = (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);
      if (available < quantity) {
        return res.status(400).send({
          success: false,
          message: `Insufficient blood. Available: ${available} units`,
        });
      }

      const inventory = new Inventory({ ...req.body, hospital: hospital._id });
      await inventory.save();

      // Send confirmation email to hospital
      const org = await Users.findById(req.body.userId);
      await sendBloodIssuedEmail({
        hospitalEmail: hospital.email,
        hospitalName: hospital.hospitalName,
        bloodGroup,
        quantity,
        orgName: org?.organisationName || "BloodCare Organisation",
      });

      return res.status(201).send({ success: true, message: "Blood issued successfully", inventory });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Error in Inventory API", error: error.message });
  }
};

// GET ALL BLOOD RECORDS FOR AN ORGANISATION
export const getInventoryController = async (req, res) => {
  try {
    const inventory = await Inventory.find({ organisation: req.body.userId })
      .populate("donor", "name email bloodGroup")
      .populate("hospital", "hospitalName email")
      .sort({ createdAt: -1 });

    return res.status(200).send({ success: true, message: "Inventory fetched", inventory });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Error fetching inventory", error: error.message });
  }
};

// GET BLOOD GROUP AVAILABILITY (for an organisation)
export const getBloodGroupAvailabilityController = async (req, res) => {
  try {
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const availability = [];

    for (const group of bloodGroups) {
      const totalIn = await Inventory.aggregate([
        { $match: { organisation: req.body.userId, bloodGroup: group, inventoryType: "in" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]);
      const totalOut = await Inventory.aggregate([
        { $match: { organisation: req.body.userId, bloodGroup: group, inventoryType: "out" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]);
      availability.push({
        bloodGroup: group,
        available: (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0),
      });
    }

    return res.status(200).send({ success: true, message: "Blood availability fetched", availability });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Error fetching availability", error: error.message });
  }
};

// GET DONATION HISTORY FOR A DONOR
export const getDonorHistoryController = async (req, res) => {
  try {
    const history = await Inventory.find({ donor: req.body.userId, inventoryType: "in" })
      .populate("organisation", "organisationName email")
      .sort({ createdAt: -1 });

    return res.status(200).send({ success: true, message: "Donation history fetched", history });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Error fetching history", error: error.message });
  }
};

// GET HOSPITAL BLOOD REQUEST HISTORY
export const getHospitalHistoryController = async (req, res) => {
  try {
    const history = await Inventory.find({ hospital: req.body.userId, inventoryType: "out" })
      .populate("organisation", "organisationName email")
      .sort({ createdAt: -1 });

    return res.status(200).send({ success: true, message: "Hospital history fetched", history });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Error fetching history", error: error.message });
  }
};
