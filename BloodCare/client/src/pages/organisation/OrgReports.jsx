import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout.jsx";
import API from "../../utils/axios.js";

const OrgReports = () => {
  const [tab, setTab] = useState("in");
  const [reportIn, setReportIn] = useState([]);
  const [reportOut, setReportOut] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [inRes, outRes] = await Promise.all([
          API.get("/inventory/report-in"),
          API.get("/inventory/report-out"),
        ]);
        if (inRes.data.success) setReportIn(inRes.data.report);
        if (outRes.data.success) setReportOut(outRes.data.report);
      } catch (e) { console.log(e); }
      finally { setLoading(false); }
    };
    fetchReports();
  }, []);

  return (
    <Layout>
      <div>
        <h1>Blood Reports</h1>
        <p>Track where blood is coming from and going to</p>
      </div>

      <div>
        <button onClick={() => setTab("in")} style={{ fontWeight: tab === "in" ? "bold" : "normal" }}>
          Blood In Report
        </button>
        <button onClick={() => setTab("out")} style={{ fontWeight: tab === "out" ? "bold" : "normal" }}>
          Blood Out Report
        </button>
      </div>

      {loading ? <p>Loading...</p> : (
        <>
          {tab === "in" && (
            <div>
              <h3>Blood Received (Donations)</h3>
              {reportIn.map((r, i) => (
                <div key={i} style={{ border: "1px solid #ccc", padding: "10px", margin: "5px" }}>
                  <p>Donor: {r._id.donor?.name || "Unknown"}</p>
                  <p>Email: {r._id.donor?.email || "—"}</p>
                  <p>Blood Group: {r._id.bloodGroup}</p>
                  <p>Total Donated: {r.totalQuantity} units</p>
                  <p>Times Donated: {r.donations}</p>
                  <p>Last Donation: {new Date(r.lastDonation).toLocaleDateString("en-IN")}</p>
                </div>
              ))}
              {reportIn.length === 0 && <p>No donations recorded yet.</p>}
            </div>
          )}

          {tab === "out" && (
            <div>
              <h3>Blood Issued (Given Out)</h3>
              {reportOut.map((r, i) => (
                <div key={i} style={{ border: "1px solid #ccc", padding: "10px", margin: "5px" }}>
                  <p>To: {r._id.hospital?.hospitalName || r._id.donor?.name || "Unknown"}</p>
                  <p>Blood Group: {r._id.bloodGroup}</p>
                  <p>Total Issued: {r.totalQuantity} units</p>
                  <p>Times Issued: {r.issues}</p>
                  <p>Last Issued: {new Date(r.lastIssued).toLocaleDateString("en-IN")}</p>
                </div>
              ))}
              {reportOut.length === 0 && <p>No blood issued yet.</p>}
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default OrgReports;
