const mongoose = require("mongoose");

const [formData, setFormData] = useState({
  name: "",
  email: "",
  dateOfBirth: "",        
  height: "",
  weight: "",
  physicalActivity: "",   
  occupation: "",         
});

module.exports = mongoose.model("Profile", profileSchema);
