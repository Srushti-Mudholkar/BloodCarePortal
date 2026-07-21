import Inventory from "../models/inventoryModel.js";
import Users from "../models/userModel.js";
import mongoose from "mongoose";
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
      const inventory = new Inventory({
        inventoryType,
        bloodGroup,
        quantity,
        email,
        donor: donor._id,
        organisation: req.user.userId,
      });
      await inventory.save();

      // Send confirmation email to donor
      const org = await Users.findById(req.user.userId);
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
      const orgId = new mongoose.Types.ObjectId(req.user.userId);
      console.log("orgId:", orgId);
      console.log("bloodGroup:", bloodGroup);
      
      const totalIn = await Inventory.aggregate([
        { $match: { organisation: orgId, bloodGroup, inventoryType: "in" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]);
      console.log("totalIn:", totalIn);
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

      const inventory = new Inventory({
        inventoryType,
        bloodGroup,
        quantity,
        email,
        hospital: hospital._id,
        organisation: req.user.userId,
      });
      await inventory.save();

      // Send confirmation email to hospital
      const org = await Users.findById(req.user.userId);
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
   
    const inventory = await Inventory.find({ organisation: req.user.userId })
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

    const orgObjectId = new mongoose.Types.ObjectId(req.user.userId);

    for (const group of bloodGroups) {
      const totalIn = await Inventory.aggregate([
        { $match: { organisation: orgObjectId, bloodGroup: group, inventoryType: "in" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]);
      const totalOut = await Inventory.aggregate([
        { $match: { organisation: orgObjectId, bloodGroup: group, inventoryType: "out" } },
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
    const history = await Inventory.find({ donor: req.user.userId, inventoryType: "in" })
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
    const history = await Inventory.find({ hospital: req.user.userId, inventoryType: "out" })
      .populate("organisation", "organisationName email")
      .sort({ createdAt: -1 });

    return res.status(200).send({ success: true, message: "Hospital history fetched", history });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Error fetching history", error: error.message });
  }
};

// GET DONORS WHO HAVE DONATED TO THIS ORGANISATION
export const getOrgDonorsController = async (req, res) => {
  try {
    // Find all "in" inventory records for this org, get unique donor ids
    const records = await Inventory.find({
      organisation: req.user.userId,
      inventoryType: "in",
    }).populate("donor", "name email bloodGroup phone address");

    // deduplicate — one donor may have donated multiple times
    const seen = new Set();
    const donors = [];
    for (const r of records) {
      if (r.donor && !seen.has(r.donor._id.toString())) {
        seen.add(r.donor._id.toString());
        donors.push(r.donor);
      }
    }

    return res.status(200).send({ success: true, message: "Donors fetched", donors });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Error fetching donors", error: error.message });
  }
};

// GET HOSPITALS WHO HAVE RECEIVED BLOOD FROM THIS ORGANISATION
export const getOrgHospitalsController = async (req, res) => {
  try {
    // Find all "out" inventory records for this org, get unique hospital ids
    const records = await Inventory.find({
      organisation: req.user.userId,
      inventoryType: "out",
    }).populate("hospital", "hospitalName email phone address website");

    // deduplicate — one hospital may have received blood multiple times
    const seen = new Set();
    const hospitals = [];
    for (const r of records) {
      if (r.hospital && !seen.has(r.hospital._id.toString())) {
        seen.add(r.hospital._id.toString());
        hospitals.push(r.hospital);
      }
    }

    return res.status(200).send({ success: true, message: "Hospitals fetched", hospitals });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Error fetching hospitals", error: error.message });
  }
};

// GET ALL ORGANISATIONS — for donor/hospital request form dropdown
export const getOrganisationsListController = async (req, res) => {
  try {
    const organisations = await Users.find({ role: "organisation" }).select("-password").sort({ createdAt: -1 });
    return res.status(200).send({ success: true, message: "Organisations fetched", organisations });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Error fetching organisations", error: error.message });
  }
};
