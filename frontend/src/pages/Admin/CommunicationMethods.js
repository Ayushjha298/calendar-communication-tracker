import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getCommunicationMethods,
  addCommunicationMethod,
  updateCommunicationMethod,
  deleteCommunicationMethod,
} from "../../api/communication";

const AdminCommunicationMethod = () => {
  const [methods, setMethods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [methodToUpdate, setMethodToUpdate] = useState(null);
  const [newMethod, setNewMethod] = useState({
    name: "",
    description: "",
    sequence: 1,
    mandatory: false,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCommunicationMethods();
  }, []);

  const loadCommunicationMethods = async () => {
    try {
      const data = await getCommunicationMethods();
      setMethods(data);
    } catch (err) {
      setError("Failed to load communication methods");
    }
  };

  const handleInputChange = (e) => {
    setNewMethod({ ...newMethod, [e.target.name]: e.target.value });
  };

  const handleAddOrEditMethod = async () => {
    try {
      if (isUpdating) {
        await updateCommunicationMethod(methodToUpdate, newMethod);
      } else {
        await addCommunicationMethod(newMethod);
      }
      setShowModal(false);
      setIsUpdating(false);
      setMethodToUpdate(null);
      setNewMethod({
        name: "",
        description: "",
        sequence: 1,
        mandatory: false,
      });
      loadCommunicationMethods();
    } catch (err) {
      setError("Failed to save communication method");
    }
  };

  const handleEditMethod = (method) => {
    setIsUpdating(true);
    setMethodToUpdate(method._id);
    setNewMethod(method);
    setShowModal(true);
  };

  const handleDeleteMethod = async (id) => {
    if (window.confirm("Are you sure you want to delete this communication method?")) {
      try {
        await deleteCommunicationMethod(id);
        loadCommunicationMethods();
        toast.success("Communication method deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete communication method");
      }
    }
  };

  const handleShowModal = () => {
    setIsUpdating(false);
    setNewMethod({
      name: "",
      description: "",
      sequence: 1,
      mandatory: false,
    });
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Manage Communication Methods</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="text-right mb-3">
        <button onClick={handleShowModal} className="btn btn-primary">
          <i className="fas fa-plus-circle"></i> Add Communication Method
        </button>
      </div>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Sequence</th>
            <th>Mandatory</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {methods.map((method) => (
            <tr key={method._id}>
              <td>{method.name}</td>
              <td>{method.description}</td>
              <td>{method.sequence}</td>
              <td>{method.mandatory ? "Yes" : "No"}</td>
              <td>
                <div className="d-flex">
                  <button
                    onClick={() => handleEditMethod(method)}
                    className="btn btn-warning btn-sm"
                    style={{ marginRight: "10px" }}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMethod(method._id)}
                    className="btn btn-danger btn-sm"
                  >
                    <i className="fas fa-trash-alt"></i> Delete
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
                  {isUpdating ? "Edit Communication Method" : "Add Communication Method"}
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
                      value={newMethod.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input
                      type="text"
                      className="form-control"
                      name="description"
                      value={newMethod.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Sequence</label>
                    <input
                      type="number"
                      className="form-control"
                      name="sequence"
                      value={newMethod.sequence}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mandatory</label>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="mandatory"
                      checked={newMethod.mandatory}
                      onChange={(e) => setNewMethod({ ...newMethod, mandatory: e.target.checked })}
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
                  onClick={handleAddOrEditMethod}
                  className="btn btn-primary"
                >
                  {isUpdating ? "Update Method" : "Add Method"}
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

export default AdminCommunicationMethod;
