const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  age: {
    type: Number,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  physicalActivity: {
    type: String,
    enum: ["light", "medium", "heavy"],
    required: true,
  },
  occupation: {
    type: String,
    enum: ["student", "working", "other"],
    required: true,
  },
  googleFitLink: {
    type: String,
    default: "",
  }
}, { timestamps: true });

// Optional: Auto-calculate age before saving
userDataSchema.pre('save', function (next) {
  if (this.dateOfBirth) {
    const ageDiffMs = Date.now() - this.dateOfBirth.getTime();
    const ageDate = new Date(ageDiffMs); // miliseconds from epoch
    this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  next();
});

module.exports = mongoose.model("UserData", userDataSchema);
