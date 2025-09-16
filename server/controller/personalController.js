import PersonalInfo from '../models/personalInfoModel.js';

// Helper: build $set payload only with provided (not undefined) fields
const buildUpdatePayload = (body) => {
  const {
    name,
    dob,
    parentName,
    emergencyContactPerson,
    emergencyContactNumber,
    qualification,
    department,
    aadharNumber,
    panNumber,
    bankAccountNumber,
    bankName,
    bankBranch,
    uanNumber
  } = body;

  return {
    ...(name !== undefined && { name }),
    ...(dob !== undefined && { dob: new Date(dob) }),
    ...(parentName !== undefined && { parentName }),
    ...(emergencyContactPerson !== undefined && { emergencyContactPerson }),
    ...(emergencyContactNumber !== undefined && { emergencyContactNumber }),
    ...(qualification !== undefined && { qualification }),
    ...(department !== undefined && { department }),
    ...(aadharNumber !== undefined && { aadharNumber }),
    ...(panNumber !== undefined && { panNumber }),
    ...(bankAccountNumber !== undefined && { bankAccountNumber }),
    ...(bankName !== undefined && { bankName }),
    ...(bankBranch !== undefined && { bankBranch }),
    ...(uanNumber !== undefined && { uanNumber })
  };
};

export const createPersonalInfo = async (req, res) => {
  const userId = req.userId;
  const {
    name,
    dob,
    parentName,
    emergencyContactPerson,
    emergencyContactNumber,
    qualification,
    department,
    aadharNumber,
    panNumber,
    bankAccountNumber,
    bankName,
    bankBranch,
    uanNumber
  } = req.body;

  try {
    const parsedDob = new Date(dob);
    if (Number.isNaN(parsedDob.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid Date of Birth.' });
    }

    const personalInfo = new PersonalInfo({
      employee_id: userId,
      name,
      dob: parsedDob,
      parentName,
      emergencyContactPerson,
      emergencyContactNumber,
      qualification,
      department,
      aadharNumber,
      panNumber,
      bankAccountNumber,
      bankName,
      bankBranch,
      uanNumber
    });

    await personalInfo.save();
    return res.status(201).json({ success: true, message: 'Personal Information saved successfully', data: personalInfo });
  } catch (error) {
    if (error?.code === 11000) {
      const field = Object.keys(error.keyValue || {}) || 'field';
      return res.status(409).json({ success: false, error: `Duplicate entry for ${field}: ${error.keyValue?.[field]}` });
    }
    if (error?.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map((key) => error.errors[key].message);
      return res.status(400).json({ success: false, error: 'Validation failed', messages: errors });
    }
    return res.status(500).json({ success: false, error: 'Server error saving personal information.' });
  }
};

export const updatePersonalInfo = async (req, res) => {
  const userId = req.userId;

  try {
    const $set = buildUpdatePayload(req.body);
    if (Object.keys($set).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update.' });
    }

    const updatedPersonalInfo = await PersonalInfo.findOneAndUpdate(
      { employee_id: userId },
      { $set },
      { new: true, runValidators: true, omitUndefined: true }
    );

    if (!updatedPersonalInfo) {
      return res.status(404).json({ success: false, message: 'Personal information not found for this user.' });
    }

    return res.status(200).json({ success: true, message: 'Personal Information updated successfully', data: updatedPersonalInfo });
  } catch (error) {
    if (error?.code === 11000) {
      const field = Object.keys(error.keyValue || {}) || 'field';
      const val = error.keyValue?.[field];
      return res.status(409).json({ success: false, error: `Duplicate entry for ${field}${val ? `: ${val}` : ''}` });
    }
    if (error?.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map((key) => error.errors[key].message);
      return res.status(400).json({ success: false, error: 'Validation failed', messages: errors });
    }
    return res.status(500).json({ success: false, error: 'Server error updating personal information.' });
  }
};

export const getPersonalInfo = async (req, res) => {
  const userId = req.userId;
  try {
    const personalInfo = await PersonalInfo.findOne({ employee_id: userId })
      .populate('employee_id', 'name emailId empId');

    if (!personalInfo) {
      return res.status(404).json({ success: false, message: 'Personal information not found for this user.' });
    }

    return res.status(200).json({ success: true, message: 'Personal information retrieved successfully', data: personalInfo });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error retrieving personal information.' });
  }
};

export const deletePersonalInfo = async (req, res) => {
  const userId = req.userId;
  try {
    const deletedPersonalInfo = await PersonalInfo.findOneAndDelete({ employee_id: userId });
    if (!deletedPersonalInfo) {
      return res.status(404).json({ success: false, message: 'Personal information not found for this user.' });
    }
    return res.status(200).json({ success: true, message: 'Personal Information deleted successfully', id: deletedPersonalInfo._id });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error deleting personal information.' });
  }
};
   