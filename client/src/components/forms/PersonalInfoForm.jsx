import React from 'react';
import { useCV } from '../../context/CVContext';

const PersonalInfoForm = () => {
  const { cvData, updatePersonalInfo } = useCV();
  const { personalInfo } = cvData;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updatePersonalInfo({ [name]: type === 'checkbox' ? checked : value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
         alert("Photo must be less than 2MB");
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo({ photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    updatePersonalInfo({ photo: '' });
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem' }}>Personal Information</h3>
      
      <div className="form-group" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {personalInfo.photo ? (
           <div style={{ position: 'relative', width: '100px', height: '100px' }}>
              <img src={personalInfo.photo} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }} />
              <button 
                 onClick={handleRemovePhoto} 
                 style={{ position: 'absolute', top: 0, right: 0, background: 'var(--error)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                 title="Remove Photo"
              >
                 ×
              </button>
           </div>
        ) : (
           <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--bg-color)', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '0.5rem' }}>
             No Photo
           </div>
        )}
        
        <div>
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
             Upload Photo
             <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handlePhotoUpload} style={{ display: 'none' }} />
          </label>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Recommended: Square image, max 2MB (JPG/PNG).
          </div>
        </div>
      </div>
      
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input 
            type="text" 
            className="form-control" 
            name="fullName" 
            value={personalInfo.fullName} 
            onChange={handleChange}
            placeholder="John Doe" 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Professional Title</label>
          <input 
            type="text" 
            className="form-control" 
            name="professionalTitle" 
            value={personalInfo.professionalTitle || ''} 
            onChange={handleChange}
            placeholder="e.g. Electrical Technician" 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Father's Name</label>
          <input 
            type="text" 
            className="form-control" 
            name="fatherName" 
            value={personalInfo.fatherName} 
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input 
            type="email" 
            className="form-control" 
            name="email" 
            value={personalInfo.email} 
            onChange={handleChange}
            placeholder="john@example.com" 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input 
            type="tel" 
            className="form-control" 
            name="phone" 
            value={personalInfo.phone} 
            onChange={handleChange}
            placeholder="+1 234 567 8900" 
          />
        </div>
      </div>

      <h4 style={{ margin: '1.5rem 0 1rem', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        Optional Details
      </h4>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Date of Birth</label>
          <input 
            type="date" 
            className="form-control" 
            name="dob" 
            value={personalInfo.dob} 
            onChange={handleChange}
          />
          <label className="checkbox-label" style={{ marginTop: '0.5rem' }}>
            <input type="checkbox" name="includeDob" checked={personalInfo.includeDob} onChange={handleChange} />
            Include in CV
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">Gender</label>
          <select className="form-control" name="gender" value={personalInfo.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <label className="checkbox-label" style={{ marginTop: '0.5rem' }}>
            <input type="checkbox" name="includeGender" checked={personalInfo.includeGender} onChange={handleChange} />
            Include in CV
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">Marital Status</label>
          <select className="form-control" name="maritalStatus" value={personalInfo.maritalStatus} onChange={handleChange}>
            <option value="">Select Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
          </select>
          <label className="checkbox-label" style={{ marginTop: '0.5rem' }}>
            <input type="checkbox" name="includeMaritalStatus" checked={personalInfo.includeMaritalStatus} onChange={handleChange} />
            Include in CV
          </label>
        </div>
        
        <div className="form-group">
          <label className="form-label">Nationality</label>
          <input 
            type="text" 
            className="form-control" 
            name="nationality" 
            value={personalInfo.nationality} 
            onChange={handleChange}
          />
        </div>
      </div>

      <h4 style={{ margin: '1.5rem 0 1rem', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        Address
      </h4>

      <div className="form-group">
        <label className="form-label">Street Address</label>
        <input 
          type="text" 
          className="form-control" 
          name="address" 
          value={personalInfo.address} 
          onChange={handleChange}
        />
      </div>
      
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">City</label>
          <input 
            type="text" 
            className="form-control" 
            name="city" 
            value={personalInfo.city} 
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">State / Province</label>
          <input 
            type="text" 
            className="form-control" 
            name="state" 
            value={personalInfo.state} 
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Country</label>
          <input 
            type="text" 
            className="form-control" 
            name="country" 
            value={personalInfo.country} 
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">PIN / Zip Code</label>
          <input 
            type="text" 
            className="form-control" 
            name="pinCode" 
            value={personalInfo.pinCode} 
            onChange={handleChange}
          />
        </div>
      </div>

    </div>
  );
};

export default PersonalInfoForm;
