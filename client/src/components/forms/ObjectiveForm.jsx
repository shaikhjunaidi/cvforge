import React from 'react';
import { useCV } from '../../context/CVContext';

const ObjectiveForm = () => {
  const { cvData, updateObjective } = useCV();

  const handleChange = (e) => {
    updateObjective(e.target.value);
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem' }}>Career Objective</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
        Write a short professional objective highlighting your career goals and key strengths. Recommended: 50-100 words.
      </p>
      
      <div className="form-group">
        <textarea 
          className="form-control" 
          value={cvData.objective} 
          onChange={handleChange}
          placeholder="Highly motivated and detail-oriented professional seeking to leverage my skills in..."
          style={{ minHeight: '150px' }}
        />
        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
           {cvData.objective.split(/\s+/).filter(w => w.length > 0).length} words
        </div>
      </div>
    </div>
  );
};

export default ObjectiveForm;
