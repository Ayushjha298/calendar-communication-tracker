
const CommunicationMethod = require('../models/communicationModel');

const addCommunicationMethod = async (req, res) => {
  const { name, description, sequence, mandatory } = req.body;

  try {
    const newMethod = new CommunicationMethod({ name, description, sequence, mandatory });
    await newMethod.save();
    res.status(201).json(newMethod);
  } catch (error) {
    res.status(500).json({ message: 'Error saving communication method', error });
  }
};

const getCommunicationMethods = async (req, res) => {
  try {
    const methods = await CommunicationMethod.find().sort({ sequence: 1 });
    res.status(200).json(methods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching communication methods', error });
  }
};

const updateCommunicationMethod = async (req, res) => {
  const { id } = req.params;
  const { name, description, sequence, mandatory } = req.body;

  try {
    const updatedMethod = await CommunicationMethod.findByIdAndUpdate(id, { name, description, sequence, mandatory }, { new: true });
    res.status(200).json(updatedMethod);
  } catch (error) {
    res.status(500).json({ message: 'Error updating communication method', error });
  }
};

const deleteCommunicationMethod = async (req, res) => {
  const { id } = req.params;

  try {
    await CommunicationMethod.findByIdAndDelete(id);
    res.status(200).json({ message: 'Communication method deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting communication method', error });
  }
};

module.exports = {
  addCommunicationMethod,
  getCommunicationMethods,
  updateCommunicationMethod,
  deleteCommunicationMethod,
};
