const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
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
    Streak:{
      type:Number,
      default:0,
    },
  },
  { timestamps: true }
);

userDataSchema.pre("save", function (next) {
  if (this.dateOfBirth) {
    const ageDiffMs = Date.now() - this.dateOfBirth.getTime();
    const ageDate = new Date(ageDiffMs);
    this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  next();
});

module.exports = mongoose.model("UserData", userDataSchema);
