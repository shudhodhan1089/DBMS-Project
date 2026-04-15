import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  User,
  Calendar,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import { scholarships, applications, allStudents } from "../data/dummyData";
import StatusTracker from "../components/StatusTracker";
import "../styles/AdminApplications.css";

function AdminApplications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);
  const [remarks, setRemarks] = useState("");

  // Combine applications with student and scholarship data
  const enrichedApplications = applications.map((app) => {
    const student = allStudents.find((s) => s.id === app.studentId);
    const scholarship = scholarships.find((s) => s.id === app.scholarshipId);
    return { ...app, student, scholarship };
  });

  // Filter applications
  const filteredApplications = enrichedApplications.filter((app) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchId = app.id.toLowerCase().includes(query);
      const matchStudent = app.student?.name.toLowerCase().includes(query);
      const matchScholarship = app.scholarship?.name.toLowerCase().includes(query);
      if (!matchId && !matchStudent && !matchScholarship) return false;
    }
    if (statusFilter !== "all" && app.status.toLowerCase().replace(" ", "-") !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleStatusUpdate = (newStatus) => {
    // In real app, update via API
    console.log("Updating status:", selectedApp.id, "to", newStatus);
    setSelectedApp({ ...selectedApp, status: newStatus });
  };

  const getStatusBadge = (status) => {
    const config = {
      Applied: { class: "applied", icon: FileText },
      "Under Review": { class: "review", icon: Clock },
      "Pending Issues": { class: "issues", icon: AlertCircle },
      Approved: { class: "approved", icon: CheckCircle },
      Rejected: { class: "rejected", icon: XCircle },
    };
    const { class: className, icon: Icon } = config[status] || config.Applied;
    return (
      <span className={`status-badge ${className}`}>
        <Icon className="badge-icon" />
        {status}
      </span>
    );
  };

  // Pagination (mock)
  const totalPages = Math.ceil(filteredApplications.length / 10);
  const currentPage = 1;

  return (
    <div className="admin-applications-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Review Applications</h1>
          <p>Manage and process student scholarship applications</p>
        </div>
        <button className="export-btn">
          <Download className="btn-icon" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search by ID, student name, or scholarship..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter className="filter-icon" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="applied">Applied</option>
            <option value="under-review">Under Review</option>
            <option value="pending-issues">Pending Issues</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">{filteredApplications.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item applied">
          <span className="stat-number">
            {filteredApplications.filter((a) => a.status === "Applied").length}
          </span>
          <span className="stat-label">New</span>
        </div>
        <div className="stat-item review">
          <span className="stat-number">
            {filteredApplications.filter((a) => a.status === "Under Review").length}
          </span>
          <span className="stat-label">Reviewing</span>
        </div>
        <div className="stat-item issues">
          <span className="stat-number">
            {filteredApplications.filter((a) => a.status === "Pending Issues").length}
          </span>
          <span className="stat-label">Issues</span>
        </div>
        <div className="stat-item approved">
          <span className="stat-number">
            {filteredApplications.filter((a) => a.status === "Approved").length}
          </span>
          <span className="stat-label">Approved</span>
        </div>
      </div>

      {/* Applications Table */}
      <div className="applications-table-container">
        <table className="applications-table">
          <thead>
            <tr>
              <th>App ID</th>
              <th>Student</th>
              <th>Scholarship</th>
              <th>Applied Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.id}>
                <td className="app-id">{app.id}</td>
                <td>
                  <div className="student-cell">
                    <div className="student-avatar">
                      <User className="avatar-icon" />
                    </div>
                    <div className="student-info">
                      <span className="student-name">{app.student?.name}</span>
                      <span className="student-dept">{app.student?.department}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="scholarship-cell">
                    <span className="scholarship-name">{app.scholarship?.name}</span>
                    <span className="scholarship-amount">
                      ₹{app.scholarship?.amount.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="date-cell">
                    <Calendar className="cell-icon" />
                    {new Date(app.appliedDate).toLocaleDateString()}
                  </div>
                </td>
                <td>{getStatusBadge(app.status)}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => setSelectedApp(app)}
                  >
                    <Eye className="btn-icon" />
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredApplications.length === 0 && (
          <div className="empty-state">
            <FileText className="empty-icon" />
            <p>No applications found</p>
          </div>
        )}

        {/* Pagination */}
        {filteredApplications.length > 0 && (
          <div className="pagination">
            <button className="page-btn" disabled>
              <ChevronLeft className="btn-icon" />
              Previous
            </button>
            <div className="page-numbers">
              <span className="page-number active">1</span>
              <span className="page-number">2</span>
              <span className="page-number">3</span>
              <span className="page-dots">...</span>
              <span className="page-number">{totalPages}</span>
            </div>
            <button className="page-btn">
              Next
              <ChevronRight className="btn-icon" />
            </button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Review Application</h3>
                <p className="app-id">{selectedApp.id}</p>
              </div>
              <button className="close-btn" onClick={() => setSelectedApp(null)}>
                <X className="close-icon" />
              </button>
            </div>

            <div className="modal-body">
              <div className="review-grid">
                {/* Student Info */}
                <div className="info-card">
                  <h4>Student Information</h4>
                  <div className="info-rows">
                    <div className="info-row">
                      <span className="label">Name</span>
                      <span className="value">{selectedApp.student?.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Roll Number</span>
                      <span className="value">{selectedApp.student?.id}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Department</span>
                      <span className="value">{selectedApp.student?.department}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Year</span>
                      <span className="value">Year {selectedApp.student?.year}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">CGPA</span>
                      <span className="value highlight">{selectedApp.student?.cgpa}</span>
                    </div>
                  </div>
                </div>

                {/* Scholarship Info */}
                <div className="info-card">
                  <h4>Scholarship Details</h4>
                  <div className="info-rows">
                    <div className="info-row">
                      <span className="label">Scholarship</span>
                      <span className="value">{selectedApp.scholarship?.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Provider</span>
                      <span className="value">{selectedApp.scholarship?.provider}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Amount</span>
                      <span className="value highlight">
                        ₹{selectedApp.scholarship?.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Category</span>
                      <span className="value">{selectedApp.scholarship?.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Tracker */}
              <div className="tracker-section">
                <h4>Application Progress</h4>
                <StatusTracker
                  status={selectedApp.status}
                  timeline={selectedApp.timeline}
                  issues={selectedApp.issues || []}
                />
              </div>

              {/* Documents Section */}
              <div className="documents-section">
                <h4>Submitted Documents</h4>
                <div className="documents-grid">
                  {selectedApp.scholarship?.documents.map((doc, index) => (
                    <div key={index} className="document-item">
                      <FileText className="doc-icon" />
                      <span>{doc}</span>
                      <button className="view-doc-btn">View</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remarks */}
              <div className="remarks-section">
                <h4>
                  <MessageSquare className="section-icon" />
                  Admin Remarks
                </h4>
                <textarea
                  rows="3"
                  value={remarks || selectedApp.remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add remarks about this application..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modal-footer">
              <div className="footer-left">
                <button
                  className="btn-secondary"
                  onClick={() => handleStatusUpdate("Pending Issues")}
                >
                  <AlertCircle className="btn-icon" />
                  Request Changes
                </button>
              </div>
              <div className="footer-right">
                <button className="btn-cancel" onClick={() => setSelectedApp(null)}>
                  Close
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleStatusUpdate("Rejected")}
                >
                  <XCircle className="btn-icon" />
                  Reject
                </button>
                <button
                  className="btn-approve"
                  onClick={() => handleStatusUpdate("Approved")}
                >
                  <CheckCircle className="btn-icon" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminApplications;
