import React, { useState, useEffect } from "react";
import {
    fetchCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
} from "../../api/company";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CompanyManagement = () => {
    const [companies, setCompanies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        linkedin: "",
        emails: "",
        phoneNumbers: "",
        comments: "",
        communicationPeriodicity: "",
    });
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await fetchCompanies(token);
            setCompanies(data);
        } catch (err) {
            setError("Failed to load companies");
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddOrEditCompany = async () => {
        try {
            const token = localStorage.getItem("token");
            if (editMode) {
                // Pass the correct company ID and formData for updating
                await updateCompany(selectedCompany._id, formData, token);
            } else {
                await addCompany(formData, token);
            }
            setShowModal(false);
            setEditMode(false);
            setFormData({
                name: "",
                location: "",
                linkedin: "",
                emails: "",
                phoneNumbers: "",
                comments: "",
                communicationPeriodicity: "",
            });
            loadCompanies();
        } catch (err) {
            setError("Failed to save company");
        }
    };

    const handleEdit = (company) => {
        setEditMode(true);
        setSelectedCompany(company);
        setFormData(company);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this company?")) {
          const token = localStorage.getItem("token");
            try {
                await deleteCompany(id,token);
                loadCompanies();
                toast.success("Company deleted successfully!");
            } catch (err) {
                toast.error("Failed to delete company");
            }
        }
    };

    const handleShowModal = () => {
        setEditMode(false);
        setFormData({
            name: "",
            location: "",
            linkedin: "",
            emails: "",
            phoneNumbers: "",
            comments: "",
            communicationPeriodicity: "",
        });
        setShowModal(true);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Company Management</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="text-right mb-3">
                <button onClick={handleShowModal} className="btn btn-primary">
                    <i className="fas fa-plus-circle"></i> Add Company
                </button>
            </div>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>LinkedIn</th>
                        <th>Emails</th>
                        <th>Phone Numbers</th>
                        <th>Comments</th>
                        <th>Communication Periodicity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map((company) => (
                        <tr key={company._id}>
                            <td>{company.name}</td>
                            <td>{company.location}</td>
                            <td>
                                <a
                                    href={company.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    LinkedIn
                                </a>
                            </td>
                            <td>{company.emails}</td>
                            <td>{company.phoneNumbers}</td>
                            <td>{company.comments}</td>
                            <td>{company.communicationPeriodicity}</td>
                            <td>
                                <div className="d-flex">
                                    <button
                                        onClick={() => handleEdit(company)}
                                        className="btn btn-warning btn-sm"
                                        style={{ marginRight: "10px" }}
                                    >
                                        <i className="fas fa-edit"></i> Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(company._id)
                                        }
                                        className="btn btn-danger btn-sm"
                                    >
                                        <i className="fas fa-trash-alt"></i>{" "}
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block" }}
                    role="dialog"
                    aria-hidden="false"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editMode ? "Edit Company" : "Add Company"}
                                </h5>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="close"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Location</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>LinkedIn</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="linkedin"
                                            value={formData.linkedin}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Emails</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="emails"
                                            value={formData.emails}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Numbers</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="phoneNumbers"
                                            value={formData.phoneNumbers}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Comments</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="comments"
                                            value={formData.comments}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Communication Periodicity</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="communicationPeriodicity"
                                            value={
                                                formData.communicationPeriodicity
                                            }
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="btn btn-secondary"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleAddOrEditCompany}
                                    className="btn btn-primary"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default CompanyManagement;
