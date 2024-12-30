import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCompanies } from "../../api/company";
import { addCommunicationLog } from "../../api/CommunicationLog";
import { Modal, Tooltip, OverlayTrigger, Button, Card, Table } from "react-bootstrap";

const Dashboard = () => {
    const [companies, setCompanies] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [error, setError] = useState(null);
    const [actionData, setActionData] = useState({
        type: "",
        date: "",
        notes: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await fetchCompanies(token);
            setCompanies(data || []);
        } catch (err) {
            setError("Failed to load companies");
        }
    };

    const handleActionSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const communicationData = selectedCompanies.map((companyId) => ({
                companyId,
                communicationType: actionData.type,
                communicationDate: actionData.date,
                notes: actionData.notes,
            }));

            await Promise.all(
                communicationData.map(async (data) => {
                    await addCommunicationLog(data, token);
                })
            );

            setActionModalVisible(false);
            setSelectedCompanies([]);
            setActionData({ type: "", date: "", notes: "" });
            loadCompanies();
        } catch (err) {
            setError("Failed to log communication");
        }
    };

    const openActionModal = () => setActionModalVisible(true);
    const closeActionModal = () => setActionModalVisible(false);

    const renderTooltip = (notes) => (
        <Tooltip>{notes || "No additional notes available"}</Tooltip>
    );

    const getHighlightClass = (nextScheduledCommunication) => {
        if (!nextScheduledCommunication) return "";
        const today = new Date();
        const scheduledDate = new Date(nextScheduledCommunication.date);
        today.setHours(0, 0, 0, 0);
        scheduledDate.setHours(0, 0, 0, 0);
        if (scheduledDate < today) return "table-danger";
        if (scheduledDate.getTime() === today.getTime()) return "table-warning";
        return "";
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center text-primary">Company Dashboard</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex justify-content-between mb-4">
                <Button
                    variant="secondary"
                    onClick={() => navigate("/user/calendar")}
                >
                    View Calendar
                </Button>
                <Button
                    variant="success"
                    onClick={openActionModal}
                    disabled={selectedCompanies.length === 0}
                >
                    Perform Communication
                </Button>
            </div>

            <Card className="shadow-lg">
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Company Name</th>
                                <th>Last Five Communications</th>
                                <th>Next Scheduled Communication</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map((company) => (
                                <tr
                                    key={company._id}
                                    className={getHighlightClass(
                                        company.nextScheduledCommunication
                                    )}
                                >
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedCompanies.includes(
                                                company._id
                                            )}
                                            onChange={() =>
                                                setSelectedCompanies((prev) =>
                                                    prev.includes(company._id)
                                                        ? prev.filter(
                                                              (id) =>
                                                                  id !==
                                                                  company._id
                                                          )
                                                        : [
                                                              ...prev,
                                                              company._id,
                                                          ]
                                                )
                                            }
                                        />
                                    </td>
                                    <td>{company.name}</td>
                                    <td>
                                        {company.lastFiveCommunications.map(
                                            (comm, index) => (
                                                <OverlayTrigger
                                                    key={index}
                                                    placement="top"
                                                    overlay={renderTooltip(
                                                        comm.notes
                                                    )}
                                                >
                                                    <span className="d-inline-block">
                                                        {`${comm.type} (${comm.date})`}
                                                    </span>
                                                </OverlayTrigger>
                                            )
                                        )}
                                    </td>
                                    <td>
                                        {company.nextScheduledCommunication
                                            ? `${company.nextScheduledCommunication.type} (${company.nextScheduledCommunication.date})`
                                            : "No scheduled communication"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Action Modal */}
            <Modal show={actionModalVisible} onHide={closeActionModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Log Communication</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label>Type of Communication</label>
                            <select
                                className="form-control"
                                value={actionData.type}
                                onChange={(e) =>
                                    setActionData((prev) => ({
                                        ...prev,
                                        type: e.target.value,
                                    }))
                                }
                            >
                                <option value="">Select</option>
                                <option value="LinkedIn Post">LinkedIn Post</option>
                                <option value="Email">Email</option>
                                <option value="Phone Call">Phone Call</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Date of Communication</label>
                            <input
                                type="date"
                                className="form-control"
                                value={actionData.date}
                                onChange={(e) =>
                                    setActionData((prev) => ({
                                        ...prev,
                                        date: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Notes</label>
                            <textarea
                                className="form-control"
                                value={actionData.notes}
                                onChange={(e) =>
                                    setActionData((prev) => ({
                                        ...prev,
                                        notes: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeActionModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleActionSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Dashboard;
