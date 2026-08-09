import React from 'react';

const MinimalTemplate = ({ data }) => {
  const { personalInfo, objective, education, experience, skills, additional } = data;

    const themeColor = data.themeColor || '#4a5568';
    
  const styles = {
    container: {
      fontFamily: data.fontFamily || '"Outfit", "Inter", sans-serif',
      fontSize: '10pt',
      lineHeight: '1.6',
      color: '#334155',
      padding: '0'
    },
    header: {
      marginBottom: '30px',
      borderBottom: `2px solid ${themeColor}`,
      paddingBottom: '20px'
    },
    name: {
      fontSize: '22pt',
      fontWeight: '300',
      letterSpacing: '0.5px',
      color: themeColor,
      marginBottom: '10px'
    },
    contactInfo: {
      fontSize: '9.5pt',
      color: '#718096',
      display: 'flex',
      gap: '15px'
    },
    section: {
      display: 'grid',
      gridTemplateColumns: '150px 1fr',
      gap: '20px',
      marginBottom: '25px'
    },
    sectionTitle: {
      fontSize: '10pt',
      fontWeight: '600',
      textTransform: 'uppercase',
      color: themeColor,
      letterSpacing: '1px'
    },
    contentBlock: {
      marginBottom: '15px'
    },
    bold: { fontWeight: '600', color: '#2d3748' },
    subText: { fontSize: '9.5pt', color: '#718096' },
    list: { margin: '5px 0 0 15px', padding: 0 }
  };

  return (
    <div className="cv-template" style={styles.container}>
      {/* Header */}
      <div style={{ ...styles.header, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {personalInfo.fullName && <div style={styles.name}>{personalInfo.fullName}</div>}
          {personalInfo.professionalTitle && <div style={{ fontSize: '12pt', fontWeight: '500', color: themeColor, marginBottom: '15px' }}>{personalInfo.professionalTitle}</div>}
          <div style={styles.contactInfo}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.city && <span>{personalInfo.city}{personalInfo.country ? `, ${personalInfo.country}` : ''}</span>}
          </div>
        </div>
        {personalInfo.photo && (
          <div style={{ marginLeft: '20px' }}>
            <img src={personalInfo.photo} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
        )}
      </div>

      {/* Reorderable Sections */}
      {(data.sectionOrder || ['objective', 'experience', 'education', 'skills', 'additional']).map(section => {
        switch (section) {
          case 'objective':
            return objective ? (
              <div key="objective" style={styles.section} className="avoid-break">
                <div style={styles.sectionTitle}>Profile</div>
                <div>{objective}</div>
              </div>
            ) : null;
          case 'experience':
            return experience.length > 0 ? (
              <div key="experience" style={styles.section} className="avoid-break">
                <div style={styles.sectionTitle}>Experience</div>
                <div>
                  {experience.map((exp) => (
                    <div key={exp.id} style={styles.contentBlock} className="section-block">
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={styles.bold}>{exp.designation}</div>
                        <div style={styles.subText}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                      </div>
                      <div style={styles.subText}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
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
              </div>
            ) : null;
          case 'education':
            return education.length > 0 ? (
              <div key="education" style={styles.section} className="avoid-break">
                <div style={styles.sectionTitle}>Education</div>
                <div>
                  {education.map((edu) => (
                    <div key={edu.id} style={styles.contentBlock} className="section-block">
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={styles.bold}>{edu.qualification}</div>
                        <div style={styles.subText}>{edu.year}</div>
                      </div>
                      <div>{edu.institute}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          case 'skills':
            return skills.length > 0 ? (
              <div key="skills" style={styles.section} className="avoid-break">
                <div style={styles.sectionTitle}>Skills</div>
                <div>
                  {skills.join(' • ')}
                </div>
              </div>
            ) : null;
          case 'additional':
            return (
              <React.Fragment key="additional">
                {additional.certifications.include && additional.certifications.text && (
                  <div style={styles.section} className="avoid-break section-block">
                    <div style={styles.sectionTitle}>Certifications</div>
                    <div style={{ whiteSpace: 'pre-line' }}>{additional.certifications.text}</div>
                  </div>
                )}
                {additional.achievements.include && additional.achievements.text && (
                  <div style={styles.section} className="avoid-break section-block">
                    <div style={styles.sectionTitle}>Achievements</div>
                    <div style={{ whiteSpace: 'pre-line' }}>{additional.achievements.text}</div>
                  </div>
                )}
                {additional.hobbies.include && additional.hobbies.text && (
                  <div style={styles.section} className="avoid-break section-block">
                    <div style={styles.sectionTitle}>Hobbies</div>
                    <div style={{ whiteSpace: 'pre-line' }}>{additional.hobbies.text}</div>
                  </div>
                )}
                {additional.languages.include && additional.languages.text && (
                  <div style={styles.section} className="avoid-break section-block">
                    <div style={styles.sectionTitle}>Languages</div>
                    <div style={{ whiteSpace: 'pre-line' }}>{additional.languages.text}</div>
                  </div>
                )}
              </React.Fragment>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default MinimalTemplate;
