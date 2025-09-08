const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  links: [String], 
  skills: [String],
});

const workSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String },
  duration: { type: String },
  description: { type: String },
});

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    education: [String],

    skills: [String], 
    projects: [projectSchema],

    work: [workSchema],

    links: {
      github: { type: String },
      linkedin: { type: String },
      portfolio: { type: String },
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
