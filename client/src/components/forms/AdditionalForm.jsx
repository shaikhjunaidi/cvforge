import React from 'react';
import { useCV } from '../../context/CVContext';

const AdditionalForm = () => {
  const { cvData, updateAdditional } = useCV();
  const { additional } = cvData;

  const handlePassportChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateAdditional('passport', {
      ...additional.passport,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSectionChange = (section, field, value) => {
    updateAdditional(section, {
      ...additional[section],
      [field]: value
    });
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem' }}>Additional Information</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Include optional sections like Passport Details, Hobbies, Certifications, etc.
      </p>

      {/* Passport Section */}
      <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
        <label className="checkbox-label" style={{ fontWeight: '600', marginBottom: additional.passport.include ? '1rem' : 0 }}>
          <input 
            type="checkbox" 
            name="include" 
            checked={additional.passport.include} 
            onChange={handlePassportChange} 
          />
          Include Passport Details
        </label>
        
        {additional.passport.include && (
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Passport Number</label>
              <input type="text" className="form-control" name="number" value={additional.passport.number} onChange={handlePassportChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Place of Issue</label>
              <input type="text" className="form-control" name="placeOfIssue" value={additional.passport.placeOfIssue} onChange={handlePassportChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Issue</label>
              <input type="date" className="form-control" name="dateOfIssue" value={additional.passport.dateOfIssue} onChange={handlePassportChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Expiry</label>
              <input type="date" className="form-control" name="dateOfExpiry" value={additional.passport.dateOfExpiry} onChange={handlePassportChange} />
            </div>
          </div>
        )}
      </div>

      {/* Certifications Section */}
      <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
        <label className="checkbox-label" style={{ fontWeight: '600', marginBottom: additional.certifications.include ? '1rem' : 0 }}>
          <input 
            type="checkbox" 
            checked={additional.certifications.include} 
            onChange={(e) => handleSectionChange('certifications', 'include', e.target.checked)} 
          />
          Include Certifications
        </label>
        {additional.certifications.include && (
          <textarea 
            className="form-control" 
            style={{ minHeight: '80px' }}
            value={additional.certifications.text} 
            onChange={(e) => handleSectionChange('certifications', 'text', e.target.value)} 
            placeholder="List your certifications (one per line)..."
          />
        )}
      </div>

      {/* Achievements Section */}
      <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
        <label className="checkbox-label" style={{ fontWeight: '600', marginBottom: additional.achievements.include ? '1rem' : 0 }}>
          <input 
            type="checkbox" 
            checked={additional.achievements.include} 
            onChange={(e) => handleSectionChange('achievements', 'include', e.target.checked)} 
          />
          Include Achievements
        </label>
        {additional.achievements.include && (
          <textarea 
            className="form-control" 
            style={{ minHeight: '80px' }}
            value={additional.achievements.text} 
            onChange={(e) => handleSectionChange('achievements', 'text', e.target.value)} 
            placeholder="List your achievements (one per line)..."
          />
        )}
      </div>

      {/* Hobbies Section */}
      <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
        <label className="checkbox-label" style={{ fontWeight: '600', marginBottom: additional.hobbies.include ? '1rem' : 0 }}>
          <input 
            type="checkbox" 
            checked={additional.hobbies.include} 
            onChange={(e) => handleSectionChange('hobbies', 'include', e.target.checked)} 
          />
          Include Hobbies & Interests
        </label>
        {additional.hobbies.include && (
          <textarea 
            className="form-control" 
            style={{ minHeight: '80px' }}
            value={additional.hobbies.text} 
            onChange={(e) => handleSectionChange('hobbies', 'text', e.target.value)} 
            placeholder="e.g. Reading, Traveling, Open Source Contribution..."
          />
        )}
      </div>

      {/* Languages Section */}
      <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
        <label className="checkbox-label" style={{ fontWeight: '600', marginBottom: additional.languages.include ? '1rem' : 0 }}>
          <input 
            type="checkbox" 
            checked={additional.languages.include} 
            onChange={(e) => handleSectionChange('languages', 'include', e.target.checked)} 
          />
          Include Languages (List format)
        </label>
        {additional.languages.include && (
          <textarea 
            className="form-control" 
            style={{ minHeight: '80px' }}
            value={additional.languages.text} 
            onChange={(e) => handleSectionChange('languages', 'text', e.target.value)} 
            placeholder="e.g. English (Fluent), Spanish (Basic)..."
          />
        )}
      </div>
      
    </div>
  );
};

export default AdditionalForm;
