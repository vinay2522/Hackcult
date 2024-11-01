const Evidence = require('../models/Evidence');

exports.addEvidence = async (req, res) => {
  try {
    const { title, description, datetime, location } = req.body;
    const newEvidence = new Evidence({
      title,
      description,
      datetime,
      location,
      owner: req.user.id
    });
    const evidence = await newEvidence.save();
    res.json(evidence);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);
    if (!evidence) {
      return res.status(404).json({ msg: 'Evidence not found' });
    }
    if (evidence.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(evidence);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Evidence not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.getAllEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.find({ owner: req.user.id }).sort({ date: -1 });
    res.json(evidence);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
