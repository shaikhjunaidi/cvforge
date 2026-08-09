import React from 'react';
import { useCV } from '../../context/CVContext';
import { Plus, Trash2, GripVertical } from 'lucide-react';

const ExperienceForm = () => {
  const { cvData, updateExperience } = useCV();
  const { experience } = cvData;

  const handleAdd = () => {
    updateExperience([
      ...experience, 
      { 
        id: Date.now(), 
        company: '', 
        designation: '', 
        location: '', 
        startDate: '', 
        endDate: '', 
        current: false, 
        responsibilities: [''] 
      }
    ]);
  };

  const handleRemove = (id) => {
    updateExperience(experience.filter(item => item.id !== id));
  };

  const handleChange = (id, field, value) => {
    const updated = experience.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateExperience(updated);
  };

  const handleAddResp = (expId) => {
    const updated = experience.map(item => {
      if (item.id === expId) {
        return { ...item, responsibilities: [...item.responsibilities, ''] };
      }
      return item;
    });
    updateExperience(updated);
  };

  const handleRemoveResp = (expId, respIndex) => {
    const updated = experience.map(item => {
      if (item.id === expId) {
        const newResps = [...item.responsibilities];
        newResps.splice(respIndex, 1);
        return { ...item, responsibilities: newResps };
      }
      return item;
    });
    updateExperience(updated);
  };

  const handleRespChange = (expId, respIndex, value) => {
    const updated = experience.map(item => {
      if (item.id === expId) {
        const newResps = [...item.responsibilities];
        newResps[respIndex] = value;
        return { ...item, responsibilities: newResps };
      }
      return item;
    });
    updateExperience(updated);
  };

  return (
    <div className="card">
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h3>Work Experience</h3>
        <button className="btn btn-primary" onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {experience.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
          No experience added yet. (Optional)
        </p>
      ) : (
        experience.map((item, index) => (
          <div key={item.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
            
            <div className="flex-between" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '1rem' }}>Experience #{index + 1}</h4>
              <button 
                className="btn btn-danger" 
                style={{ padding: '0.25rem' }} 
                onClick={() => handleRemove(item.id)}
                title="Delete Entry"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={item.company} 
                  onChange={(e) => handleChange(item.id, 'company', e.target.value)}
                  placeholder="e.g. Google" 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Designation / Role *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={item.designation} 
                  onChange={(e) => handleChange(item.id, 'designation', e.target.value)}
                  placeholder="e.g. Software Engineer" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={item.location} 
                  onChange={(e) => handleChange(item.id, 'location', e.target.value)}
                  placeholder="e.g. New York, USA" 
                />
              </div>
              
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label className="checkbox-label" style={{ marginTop: '1.5rem' }}>
                  <input 
                    type="checkbox" 
                    checked={item.current} 
                    onChange={(e) => handleChange(item.id, 'current', e.target.checked)} 
                  />
                  I currently work here
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={item.startDate} 
                  onChange={(e) => handleChange(item.id, 'startDate', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={item.endDate} 
                  onChange={(e) => handleChange(item.id, 'endDate', e.target.value)}
                  disabled={item.current}
                  style={{ opacity: item.current ? 0.5 : 1 }}
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1rem' }}>
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Job Responsibilities</label>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} 
                  onClick={() => handleAddResp(item.id)}
                >
                  <Plus size={14} style={{ marginRight: '0.25rem' }} /> Add Point
                </button>
              </div>
              
              {item.responsibilities.map((resp, rIndex) => (
                <div key={rIndex} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                  <div style={{ padding: '0.5rem 0', color: 'var(--text-muted)' }}>
                    <GripVertical size={16} />
                  </div>
                  <textarea 
                    className="form-control" 
                    style={{ minHeight: '40px', padding: '0.5rem' }}
                    value={resp} 
                    onChange={(e) => handleRespChange(item.id, rIndex, e.target.value)}
                    placeholder="Describe a key responsibility or achievement..." 
                  />
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '0.5rem' }} 
                    onClick={() => handleRemoveResp(item.id, rIndex)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExperienceForm;
