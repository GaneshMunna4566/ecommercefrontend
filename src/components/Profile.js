import React, { useState, useEffect } from 'react';
import Homenavbar from './Homenavbar';

function Profile() {
  const [profileData, setProfileData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
  });

  useEffect(() => {
    // Retrieve token from local storage
    const token = localStorage.getItem('authToken');

    // Check if token exists
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    fetch('http://localhost:5000/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        // Update state with user profile data
        setProfileData({
          id: data.id, // Assuming the user's ID is returned as "_id" from the backend
          firstName: data.firstname,
          lastName: data.lastname,
          mobileNumber: data.phone,
          email: data.email,
        });
        console.log(setProfileData)
      })
      .catch(error => console.error('Error:', error));
  }, []);


  return (
    <div>
      <Homenavbar />

      <div className="container rounded bg-white mt-5 mb-5">
        <div className="row">
          <div className="col-md-5 border-center">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-right">Profile Settings</h4>
              </div>
              <div className="row mt-2">
                <div className="col-md-6">
                  <label className="labels">ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ID"
                    value={profileData.id}
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label className="labels">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First Name"
                    value={profileData.firstName}
                    readOnly
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-6">
                  <label className="labels">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last Name"
                    value={profileData.lastName}
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label className="labels">Mobile Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mobile Number"
                    value={profileData.mobileNumber}
                    readOnly
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <label className="labels">Email ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email ID"
                    value={profileData.email}
                    readOnly
                  />
                </div>
              </div>
              <div className="mt-5 text-center">
                <button className="btn btn-primary profile-button" type="button">
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
