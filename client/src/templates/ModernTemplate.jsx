import React from 'react';

const ModernTemplate = ({ data }) => {
  const { personalInfo, objective, education, experience, skills, additional } = data;

    const themeColor = data.themeColor || '#0f172a';

  const styles = {
    container: {
      fontFamily: data.fontFamily || '"Outfit", "Inter", sans-serif',
      fontSize: '10pt',
      lineHeight: '1.5',
      color: '#334155'
    },
    header: {
      backgroundColor: themeColor,
      color: 'white',
      padding: '30px',
      marginBottom: '20px'
    },
    name: {
      fontSize: '24pt',
      fontWeight: 'bold',
      letterSpacing: '1px',
      marginBottom: '10px'
    },
    contactRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
      fontSize: '10pt',
      opacity: '0.9'
    },
    sectionTitle: {
      fontSize: '14pt',
      fontWeight: 'bold',
      color: themeColor,
      borderBottom: `2px solid ${themeColor}`,
      paddingBottom: '5px',
      marginBottom: '15px',
      marginTop: '20px'
    },
    bold: { fontWeight: 'bold' },
    gridRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '5px' },
    contentBlock: { marginBottom: '15px' },
    list: { margin: '5px 0 10px 20px', padding: '0' },
    skillPill: {
      display: 'inline-block',
      backgroundColor: '#e2e8f0',
      color: '#0f172a',
      padding: '4px 10px',
      borderRadius: '15px',
      fontSize: '10pt',
      marginRight: '8px',
      marginBottom: '8px',
      fontWeight: '500'
    }
  };

  return (
    <div className="cv-template" style={{ padding: 0 }}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {personalInfo.fullName && <div style={styles.name}>{personalInfo.fullName.toUpperCase()}</div>}
            {personalInfo.professionalTitle && <div style={{ fontSize: '12pt', fontWeight: '500', marginBottom: '15px', opacity: 0.95 }}>{personalInfo.professionalTitle}</div>}
            <div style={styles.contactRow}>
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>• {personalInfo.phone}</span>}
              {personalInfo.city && <span>• {personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</span>}
            </div>
          </div>
          {personalInfo.photo && (
            <div style={{ marginLeft: '20px' }}>
              <img src={personalInfo.photo} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white' }} />
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '0 30px 30px' }}>
        {/* Reorderable Sections */}
        {(data.sectionOrder || ['objective', 'experience', 'education', 'skills', 'additional']).map(section => {
          switch (section) {
            case 'objective':
              return objective ? (
                <div key="objective" className="avoid-break">
                  <div style={styles.sectionTitle}>PROFESSIONAL SUMMARY</div>
                  <p>{objective}</p>
                </div>
              ) : null;
            case 'experience':
              return experience.length > 0 ? (
                <div key="experience">
                  <div style={styles.sectionTitle} className="avoid-break">EXPERIENCE</div>
                  {experience.map((exp) => (
                    <div key={exp.id} style={styles.contentBlock} className="section-block">
                      <div style={styles.gridRow}>
                        <div style={{ ...styles.bold, fontSize: '12pt' }}>{exp.designation}</div>
                        <div style={{ fontSize: '10pt', color: '#64748b', fontWeight: '500' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                      </div>
                      <div style={{ fontSize: '11pt', color: '#0f172a', marginBottom: '8px' }}>
                        {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                      </div>
                      {exp.responsibilities.length > 0 && (
                        <ul style={styles.list}>
                          {exp.responsibilities.map((resp, i) => (
                            resp && <li key={i}>{resp}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : null;
            case 'education':
              return education.length > 0 ? (
                <div key="education">
                  <div style={styles.sectionTitle} className="avoid-break">EDUCATION</div>
                  {education.map((edu) => (
                    <div key={edu.id} style={styles.contentBlock} className="section-block">
                      <div style={styles.gridRow}>
                        <div style={styles.bold}>{edu.qualification}</div>
                        <div style={{ fontSize: '10pt', color: '#64748b' }}>{edu.year}</div>
                      </div>
                      <div>{edu.institute}, {edu.board}</div>
                      {edu.score && <div style={{ fontSize: '10pt', color: '#475569', marginTop: '2px' }}>Score/CGPA: {edu.score}</div>}
                    </div>
                  ))}
                </div>
              ) : null;
            case 'skills':
              return skills.length > 0 ? (
                <div key="skills" className="avoid-break">
                  <div style={styles.sectionTitle}>SKILLS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {skills.map((skill, i) => (
                      <div key={i} style={styles.skillPill}>{skill}</div>
                    ))}
                  </div>
                </div>
              ) : null;
            case 'additional':
              return (
                <React.Fragment key="additional">
                  {additional.certifications.include && additional.certifications.text && (
                    <div className="section-block">
                      <div style={styles.sectionTitle} className="avoid-break">CERTIFICATIONS</div>
                      <div style={{ whiteSpace: 'pre-line' }}>{additional.certifications.text}</div>
                    </div>
                  )}
                  {additional.achievements.include && additional.achievements.text && (
                    <div className="section-block">
                      <div style={styles.sectionTitle} className="avoid-break">ACHIEVEMENTS</div>
                      <div style={{ whiteSpace: 'pre-line' }}>{additional.achievements.text}</div>
                    </div>
                  )}
                  {additional.hobbies.include && additional.hobbies.text && (
                    <div className="section-block">
                      <div style={styles.sectionTitle} className="avoid-break">HOBBIES & INTERESTS</div>
                      <div style={{ whiteSpace: 'pre-line' }}>{additional.hobbies.text}</div>
                    </div>
                  )}
                </React.Fragment>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default ModernTemplate;
