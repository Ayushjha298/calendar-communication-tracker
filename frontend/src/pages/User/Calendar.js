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
    const [actionData, setActionData] = useState({ type: "", date: "", time: "", notes: "" });
    const [selectedDate, setSelectedDate] = useState(null); 
    const [overdueNotifications, setOverdueNotifications] = useState([]);
    const [dueNotifications, setDueNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Token:", token);
            const data = await fetchCompanies(token);
            console.log("Fetched Data:", data);
            
            setCompanies(data || []);
            calculateNotifications(data);
        } catch (err) {
            console.error("Error fetching companies:", err);
            setError("Failed to load companies");
        }
    };

    const calculateNotifications = (companies) => {
        const currentDate = moment().startOf('day');  
        let overdue = [];
        let dueToday = [];
    
        companies.forEach((company) => {
            company.lastFiveCommunications.forEach((comm) => {
                const commDate = moment(comm.date).startOf('day'); 
                if (commDate.isBefore(currentDate, "day")) {  
                    overdue.push({ company, comm });
                } else if (commDate.isSame(currentDate, "day")) { 
                    dueToday.push({ company, comm });
                }
            });
    
            if (company.nextScheduledCommunication) {
                const nextCommDate = moment(company.nextScheduledCommunication.date).startOf('day');  
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
            console.log("Selected Companies:", selectedCompanies); 
            if (selectedCompanies.length === 0) {
                setError("Please select at least one company.");
                return;
            }

            const token = localStorage.getItem("token");
            const communicationData = selectedCompanies.map((companyId) => ({
                companyId,
                communicationType: actionData.type,
                communicationDate: `${actionData.date}T${actionData.time}`, 
                notes: actionData.notes,
            }));

            console.log("Communication Data:", communicationData); 

            await Promise.all(
                communicationData.map(async (data) => {
                    await addCommunicationLog(data, token);
                })
            );

            setActionModalVisible(false);
            setSelectedCompanies([]);
            setActionData({ type: "", date: "", time: "", notes: "" });
            loadCompanies();
        } catch (err) {
            console.error(err); 
            setError("Failed to log communication");
        }
    };

    const openActionModal = (date) => {
        setSelectedDate(moment(date).format("YYYY-MM-DD"));
        setActionModalVisible(true); 
    };

    const closeActionModal = () => setActionModalVisible(false);

    const getCalendarEvents = () => {
        const events = [];
        companies.forEach((company) => {
            company.lastFiveCommunications.forEach((comm) => {
                events.push({
                    title: `${company.name}: ${comm.type}`,
                    start: moment(comm.date).toDate(),
                    end: moment(comm.date).toDate(),
                    notes: comm.notes,
                });
            });

            if (company.nextScheduledCommunication) {
                events.push({
                    title: `${company.name}: ${company.nextScheduledCommunication.type}`,
                    start: moment(company.nextScheduledCommunication.date).toDate(),
                    end: moment(company.nextScheduledCommunication.date).toDate(),
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
                                style={{ backgroundColor: "red", color: "white" }} 
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
                                style={{ backgroundColor: "yellow" }} 
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
                onSelectSlot={(slotInfo) => openActionModal(slotInfo.start)}
            />

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
                            <label>Communication Date</label>
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
                            <label>Communication Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={actionData.time}
                                onChange={(e) =>
                                    setActionData((prev) => ({
                                        ...prev,
                                        time: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Notes</label>
                            <textarea
                                className="form-control"
                                rows="3"
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
                        Close
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
