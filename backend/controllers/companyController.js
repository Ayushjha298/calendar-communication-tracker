const Company = require('../models/companyModel');
const CommunicationLog = require('../models/CommunicationLog');

const addCompany = async (req, res) => {
  const { name, location, linkedin, emails, phoneNumbers, comments, communicationPeriodicity } = req.body;

  try {
    const periodicityDays = communicationPeriodicity || 14; 
    const company = new Company({
      name,
      location,
      linkedin,
      emails,
      phoneNumbers,
      comments,
      communicationPeriodicity: periodicityDays,
    });
    await company.save();
    res.status(201).json({ message: 'Company added successfully', company });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();

    const enrichedCompanies = await Promise.all(
      companies.map(async (company) => {
        const lastFiveCommunications = await CommunicationLog.find({
          companyId: company._id,
          communicationDate: { $lt: new Date() },
        })
          .sort({ communicationDate: -1 })
          .limit(5)
          .select('communicationType communicationDate notes');

        let nextScheduledCommunication = null;

        if (lastFiveCommunications.length > 0) {
          const lastCommunicationDate = new Date(
            lastFiveCommunications[0].communicationDate
          );
          const periodicityDays = company.communicationPeriodicity || 14;

          const nextCommunicationDate = new Date(
            lastCommunicationDate.getTime() + periodicityDays * 24 * 60 * 60 * 1000
          );

          if (nextCommunicationDate > new Date()) {
            nextScheduledCommunication = {
              type: 'Scheduled', 
              date: nextCommunicationDate.toLocaleDateString(),
            };
          }
        }

        return {
          ...company.toObject(),
          lastFiveCommunications: lastFiveCommunications.map((log) => ({
            type: log.communicationType,
            date: log.communicationDate.toLocaleDateString(),
            notes: log.notes,
          })),
          nextScheduledCommunication,
        };
      })
    );

    res.json(enrichedCompanies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const updateCompany = async (req, res) => {
  const { id } = req.params;
  const { name, location, linkedin, emails, phoneNumbers, comments, communicationPeriodicity } = req.body;
  try {
    const company = await Company.findByIdAndUpdate(id, { name, location, linkedin, emails, phoneNumbers, comments, communicationPeriodicity }, { new: true });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCompany = async (req, res) => {
  const { id } = req.params;
  try {
    await Company.findByIdAndDelete(id);
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addCompany, getCompanies, updateCompany, deleteCompany };
