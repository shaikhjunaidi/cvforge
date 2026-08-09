import React from 'react';
import { useCV } from '../../context/CVContext';
import { Plus, Trash2 } from 'lucide-react';

const EducationForm = () => {
  const { cvData, updateEducation } = useCV();
  const { education } = cvData;

  const handleAdd = () => {
    updateEducation([
      ...education, 
      { id: Date.now(), qualification: '', board: '', institute: '', year: '', score: '' }
    ]);
  };

  const handleRemove = (id) => {
    updateEducation(education.filter(item => item.id !== id));
  };

  const handleChange = (id, field, value) => {
    const updated = education.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateEducation(updated);
  };

  return (
    <div className="card">
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h3>Education</h3>
        <button className="btn btn-primary" onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
          <Plus size={16} /> Add Education
        </button>
      </div>

      {education.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
          No education added yet. Click the button above to add one.
        </p>
      ) : (
        education.map((item, index) => (
          <div key={item.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem', position: 'relative' }}>
            
            <div className="flex-between" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '1rem' }}>Education #{index + 1}</h4>
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
                <label className="form-label">Qualification / Degree *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={item.qualification} 
                  onChange={(e) => handleChange(item.id, 'qualification', e.target.value)}
                  placeholder="e.g. B.Sc in Computer Science" 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Board / University *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={item.board} 
                  onChange={(e) => handleChange(item.id, 'board', e.target.value)}
                  placeholder="e.g. State Board" 
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Institute / College *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={item.institute} 
                  onChange={(e) => handleChange(item.id, 'institute', e.target.value)}
                  placeholder="e.g. XYZ College" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Passing Year</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={item.year} 
                  onChange={(e) => handleChange(item.id, 'year', e.target.value)}
                  placeholder="e.g. 2024" 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Percentage / CGPA</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={item.score} 
                  onChange={(e) => handleChange(item.id, 'score', e.target.value)}
                  placeholder="e.g. 85%" 
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EducationForm;
