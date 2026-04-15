import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  ChevronRight,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";
import { scholarships } from "../data/dummyData";
import "../styles/AdminScholarships.css";

function AdminScholarships() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);

  // Filter scholarships
  const filteredScholarships = scholarships.filter((s) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!s.name.toLowerCase().includes(query) && !s.provider.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (filter !== "all" && s.category !== filter) {
      return false;
    }
    return true;
  });

  const handleEdit = (scholarship) => {
    setEditingScholarship(scholarship);
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this scholarship?")) {
      // In real app, delete from backend
      console.log("Deleting scholarship:", id);
    }
  };

  const getStatusBadge = (status) => {
    return status === "Active" ? (
      <span className="status-badge active">
        <CheckCircle className="badge-icon" />
        Active
      </span>
    ) : (
      <span className="status-badge inactive">
        <XCircle className="badge-icon" />
        Inactive
      </span>
    );
  };

  const categories = ["all", "Merit", "SC/ST", "OBC", "NT/VJNT", "EWS", "Special"];

  return (
    <div className="admin-scholarships-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Manage Scholarships</h1>
          <p>Add, edit, and manage scholarship programs</p>
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          <Plus className="btn-icon" />
          Add Scholarship
        </button>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search scholarships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={filter === cat ? "active" : ""}
              onClick={() => setFilter(cat)}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scholarships Table */}
      <div className="scholarships-table-container">
        <table className="scholarships-table">
          <thead>
            <tr>
              <th>Scholarship Name</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Applications</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredScholarships.map((scholarship) => (
              <tr key={scholarship.id}>
                <td>
                  <div className="scholarship-cell">
                    <span className="scholarship-name">{scholarship.name}</span>
                    <span className="scholarship-provider">{scholarship.provider}</span>
                  </div>
                </td>
                <td>
                  <span className="category-tag">{scholarship.category}</span>
                </td>
                <td>
                  <span className="amount">₹{scholarship.amount.toLocaleString()}</span>
                </td>
                <td>
                  <div className="applications-cell">
                    <Users className="cell-icon" />
                    <span>{scholarship.applicationsCount}</span>
                  </div>
                </td>
                <td>
                  <div className="deadline-cell">
                    <Calendar className="cell-icon" />
                    <span>{new Date(scholarship.deadline).toLocaleDateString()}</span>
                  </div>
                </td>
                <td>{getStatusBadge(scholarship.status)}</td>
                <td>
                  <div className="actions-cell">
                    <button
                      className="action-btn view"
                      onClick={() => navigate(`/scholarships/${scholarship.id}`)}
                      title="View"
                    >
                      <Eye className="action-icon" />
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(scholarship)}
                      title="Edit"
                    >
                      <Edit2 className="action-icon" />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(scholarship.id)}
                      title="Delete"
                    >
                      <Trash2 className="action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredScholarships.length === 0 && (
          <div className="empty-state">
            <p>No scholarships found</p>
            <button onClick={() => { setSearchQuery(""); setFilter("all"); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal modal-large">
            <div className="modal-header">
              <h3>{editingScholarship ? "Edit Scholarship" : "Add New Scholarship"}</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingScholarship(null);
                }}
              >
                <X className="close-icon" />
              </button>
            </div>

            <form className="scholarship-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Scholarship Name *</label>
                  <input
                    type="text"
                    defaultValue={editingScholarship?.name}
                    placeholder="Enter scholarship name"
                  />
                </div>

                <div className="form-group">
                  <label>Provider *</label>
                  <input
                    type="text"
                    defaultValue={editingScholarship?.provider}
                    placeholder="e.g., Government of India"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select defaultValue={editingScholarship?.category}>
                    <option value="Merit">Merit Based</option>
                    <option value="SC/ST">SC/ST</option>
                    <option value="OBC">OBC</option>
                    <option value="NT/VJNT">NT/VJNT</option>
                    <option value="EWS">EWS</option>
                    <option value="Special">Special</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input
                    type="number"
                    defaultValue={editingScholarship?.amount}
                    placeholder="Enter scholarship amount"
                  />
                </div>

                <div className="form-group">
                  <label>Application Deadline *</label>
                  <input
                    type="date"
                    defaultValue={editingScholarship?.deadline}
                  />
                </div>

                <div className="form-group">
                  <label>Duration</label>
                  <select defaultValue={editingScholarship?.duration || "Annual"}>
                    <option value="One-time">One-time</option>
                    <option value="Annual">Annual</option>
                    <option value="Semester">Semester</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    defaultValue={editingScholarship?.description}
                    placeholder="Enter scholarship description"
                  />
                </div>

                <div className="form-section full-width">
                  <h4>Eligibility Criteria</h4>
                </div>

                <div className="form-group">
                  <label>Minimum CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    defaultValue={editingScholarship?.eligibility?.minCgpa || 6.0}
                  />
                </div>

                <div className="form-group">
                  <label>Maximum Income (₹)</label>
                  <input
                    type="number"
                    defaultValue={editingScholarship?.eligibility?.maxIncome}
                    placeholder="Annual family income limit"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Eligible Categories (comma-separated)</label>
                  <input
                    type="text"
                    defaultValue={editingScholarship?.eligibility?.caste?.join(", ")}
                    placeholder="e.g., OPEN, SC, ST, OBC"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Required Documents (comma-separated)</label>
                  <input
                    type="text"
                    defaultValue={editingScholarship?.documents?.join(", ")}
                    placeholder="e.g., Income Certificate, Caste Certificate, Marksheet"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingScholarship(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingScholarship ? "Save Changes" : "Add Scholarship"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminScholarships;
