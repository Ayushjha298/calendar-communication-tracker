import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCompanies } from "../../api/company";
import { addCommunicationLog } from "../../api/CommunicationLog";
import { Modal } from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarView = () => {
    const [companies, setCompanies] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [error, setError] = useState(null);
    const [actionData, setActionData] = useState({ type: "", date: "", notes: "" });
    const [selectedDate, setSelectedDate] = useState(null); // Store selected date
    const [overdueNotifications, setOverdueNotifications] = useState([]);
    const [dueNotifications, setDueNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await fetchCompanies(token);
            setCompanies(data || []);
            calculateNotifications(data);  // Calculate overdue and due notifications
        } catch (err) {
            setError("Failed to load companies");
        }
    };

    const calculateNotifications = (companies) => {
        const currentDate = moment();
        let overdue = [];
        let dueToday = [];

        companies.forEach((company) => {
            company.lastFiveCommunications.forEach((comm) => {
                const commDate = moment(comm.date, "DD/MM/YYYY");
                if (commDate.isBefore(currentDate, "day")) {
                    overdue.push({ company, comm });
                } else if (commDate.isSame(currentDate, "day")) {
                    dueToday.push({ company, comm });
                }
            });

            if (company.nextScheduledCommunication) {
                const nextCommDate = moment(company.nextScheduledCommunication.date, "DD/MM/YYYY");
                if (nextCommDate.isBefore(currentDate, "day")) {
                    overdue.push({ company, comm: company.nextScheduledCommunication });
                } else if (nextCommDate.isSame(currentDate, "day")) {
                    dueToday.push({ company, comm: company.nextScheduledCommunication });
                }
            }
        });

        setOverdueNotifications(overdue);
        setDueNotifications(dueToday);
    };

    const handleActionSubmit = async () => {
        try {
            console.log("Selected Companies:", selectedCompanies); // Debugging log
            if (selectedCompanies.length === 0) {
                setError("Please select at least one company.");
                return;
            }

            const token = localStorage.getItem("token");
            const communicationData = selectedCompanies.map((companyId) => ({
                companyId,
                communicationType: actionData.type,
                communicationDate: actionData.date,
                notes: actionData.notes,
            }));

            console.log("Communication Data:", communicationData); // Debugging log

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
            console.error(err); // Log error for debugging
            setError("Failed to log communication");
        }
    };

    const openActionModal = (date) => {
        setSelectedDate(moment(date).format("YYYY-MM-DD")); // Store the selected date
        setActionModalVisible(true); // Open modal
    };

    const closeActionModal = () => setActionModalVisible(false);

    const getCalendarEvents = () => {
        const events = [];
        companies.forEach((company) => {
            company.lastFiveCommunications.forEach((comm) => {
                events.push({
                    title: `${company.name}: ${comm.type}`,
                    start: moment(comm.date, "DD/MM/YYYY").toDate(),
                    end: moment(comm.date, "DD/MM/YYYY").toDate(),
                    notes: comm.notes,
                });
            });

            if (company.nextScheduledCommunication) {
                events.push({
                    title: `${company.name}: ${company.nextScheduledCommunication.type}`,
                    start: moment(
                        company.nextScheduledCommunication.date,
                        "DD/MM/YYYY"
                    ).toDate(),
                    end: moment(
                        company.nextScheduledCommunication.date,
                        "DD/MM/YYYY"
                    ).toDate(),
                });
            }
        });
        return events;
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Company Dashboard</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row mb-4">
                <div className="col-md-6">
                    <h4>Overdue Communications</h4>
                    <ul className="list-group">
                        {overdueNotifications.map(({ company, comm }, index) => (
                            <li 
                                key={index} 
                                className="list-group-item" 
                                style={{ backgroundColor: "red", color: "white" }} // Red highlight for overdue
                            >
                                <strong>{company.name}</strong>: {comm.type} on {comm.date}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-md-6">
                    <h4>Due Today Communications</h4>
                    <ul className="list-group">
                        {dueNotifications.map(({ company, comm }, index) => (
                            <li 
                                key={index} 
                                className="list-group-item" 
                                style={{ backgroundColor: "yellow" }} // Yellow highlight for due today
                            >
                                <strong>{company.name}</strong>: {comm.type} on {comm.date}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Calendar
                localizer={localizer}
                events={getCalendarEvents()}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectSlot={(slotInfo) => openActionModal(slotInfo.start)} // Open modal when a date is selected
                selectable={true}
            />

            {/* Action Modal */}
            <Modal show={actionModalVisible} onHide={closeActionModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Log Communication</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label>Companies</label>
                            <select
                                className="form-control"
                                multiple
                                value={selectedCompanies}
                                onChange={(e) => {
                                    const selectedOptions = Array.from(e.target.selectedOptions).map(
                                        (option) => option.value
                                    );
                                    setSelectedCompanies(selectedOptions);
                                }}
                            >
                                {companies.map((company) => (
                                    <option key={company._id} value={company._id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                                value={actionData.date || selectedDate}
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
                    <button
                        className="btn btn-secondary"
                        onClick={closeActionModal}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleActionSubmit}
                    >
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CalendarView;
