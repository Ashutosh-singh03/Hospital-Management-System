import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../config";

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("Pediatrics");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        console.log("Making API call to fetch doctors...");
        const response = await axios.get(
          `${API_URL}/api/v1/user/doctors`,
          { withCredentials: true }
        );
        console.log("API Response:", response);
        console.log("Response data:", response.data);
        console.log("Doctors array:", response.data.doctors);
        
        if (response.data && response.data.doctors) {
          console.log("Number of doctors received:", response.data.doctors.length);
          console.log("First doctor sample:", response.data.doctors[0]);
          setDoctors(response.data.doctors);
        } else {
          console.warn("No doctors data in response");
          toast.warning("No doctors found in the system");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        console.error("Error response:", error.response);
        toast.error("Failed to fetch doctors. Please try again later.");
      }
    };
    fetchDoctors();
  }, []);

  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const hasVisitedBool = Boolean(hasVisited);
      const { data } = await axios.post(
        `${API_URL}/api/v1/appointment/post`,
        {
          firstName,
          lastName,
          email,
          phone,
          aadhar,
          dob,
          gender,
          appointment_date: appointmentDate,
          department,
          doctor_firstName: doctorFirstName,
          doctor_lastName: doctorLastName,
          hasVisited: hasVisitedBool,
          address,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setAadhar("");
      setDob("");
      setGender("");
      setAppointmentDate("");
      setDepartment("");
      setDoctorFirstName("");
      setDoctorLastName("");
      setHasVisited("");
      setAddress("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="container form-component appointment-form">
        <h2>Appointment Form</h2>
        <form onSubmit={handleAppointment}>
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Aadhar Number"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="date"
              placeholder="Appointment Date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </div>
          <div>
            <select
              value={department}
              onChange={(e) => {
                console.log("Selected department:", e.target.value);
                setDepartment(e.target.value);
              }}
            >
              <option value="">Select Department</option>
              {departmentsArray.map((depart, index) => (
                <option value={depart} key={index}>
                  {depart}
                </option>
              ))}
            </select>
            <select
              value={JSON.stringify({
                firstName: doctorFirstName,
                lastName: doctorLastName,
              })}
              onChange={(e) => {
                const selectedDoctor = JSON.parse(e.target.value);
                console.log("Selected doctor:", selectedDoctor);
                setDoctorFirstName(selectedDoctor.firstName);
                setDoctorLastName(selectedDoctor.lastName);
              }}
            >
              <option value="">Select Doctor</option>
              {loading ? (
                <option value="" disabled>Loading doctors...</option>
              ) : error ? (
                <option value="" disabled>Error loading doctors</option>
              ) : doctors.length === 0 ? (
                <option value="" disabled>No doctors available</option>
              ) : (
                doctors
                  .filter((doctor) => {
                    console.log("Filtering doctor:", doctor, "for department:", department);
                    return doctor.doctorDepartment === department;
                  })
                  .map((doctor, index) => (
                    <option
                      key={index}
                      value={JSON.stringify({
                        firstName: doctor.firstName,
                        lastName: doctor.lastName,
                      })}
                    >
                      {doctor.firstName} {doctor.lastName}
                    </option>
                  ))
              )}
            </select>
          </div>
          <textarea
            rows="10"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <div
            style={{
              gap: "10px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <p style={{ marginBottom: 0 }}>Have you visited before?</p>
            <input
              type="checkbox"
              checked={hasVisited}
              onChange={(e) => setHasVisited(e.target.checked)}
              style={{ flex: "none", width: "25px" }}
            />
          </div>
          <button style={{ margin: "0 auto" }}>GET APPOINTMENT</button>
        </form>
      </div>
    </>
  );
};

export default AppointmentForm;
