const CommunicationLog = require('../models/CommunicationLog');
const Company = require('../models/companyModel');
const CommunicationMethod = require('../models/communicationModel');

exports.getCompanyCommunications = async (req, res) => {
  try {
    const { companyId } = req.params;

    const logs = await CommunicationLog.find({ companyId })
      .sort({ communicationDate: -1 })
      .limit(5);

    const nextCommunication = await CommunicationLog.findOne({
      companyId,
      communicationDate: { $gte: new Date() },
    }).sort({ communicationDate: 1 });

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({
      companyName: company.name,
      logs,
      nextCommunication,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching communications', error });
  }
};


  exports.addCommunicationLog = async (req, res) => {
    const { companyId, communicationType, communicationDate, notes } = req.body;
    try {
      const newLog = new CommunicationLog({
        companyId,
        communicationType,
        communicationDate,
        notes,
      });
      await newLog.save();
  
      res.status(201).json(newLog);
    } catch (error) {
      res.status(500).json({ message: 'Error logging communication', error });
    }
  };
  
  
  