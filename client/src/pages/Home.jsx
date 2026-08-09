import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Edit, Eye, Download, LayoutTemplate } from 'lucide-react';
const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" style={{ 
        padding: '4rem 0', 
        textAlign: 'center', 
        backgroundColor: 'var(--primary)', 
        color: 'white',
        borderBottom: '4px solid #4F5B93'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            Create Your Professional CV in Minutes
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: '0.9', maxWidth: '800px', margin: '0 auto 2rem' }}>
            Enter your details, choose a professional template, preview your CV and download it as a PDF.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/create" className="btn btn-secondary" style={{ fontSize: '1.125rem', padding: '0.75rem 2rem' }}>
              Create My CV
            </Link>
            <Link to="/templates" className="btn btn-primary" style={{ border: '1px solid white', fontSize: '1.125rem', padding: '0.75rem 2rem' }}>
              View Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem', color: 'var(--text-main)' }}>Why Use CVForge?</h2>
          <div className="grid-3">
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: '#eff6ff', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                 <Edit size={32} color="var(--primary)" />
              </div>
              <h3>Easy to Use</h3>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Enter your details using our simple step-by-step form.</p>
            </div>
            
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: '#eff6ff', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                 <LayoutTemplate size={32} color="var(--primary)" />
              </div>
              <h3>Professional Templates</h3>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Choose from clean and professional CV designs.</p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: '#eff6ff', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                 <Eye size={32} color="var(--primary)" />
              </div>
              <h3>Live Preview</h3>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>See exactly how your CV looks while editing.</p>
            </div>
            
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: '#eff6ff', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                 <Download size={32} color="var(--primary)" />
              </div>
              <h3>PDF Download</h3>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Generate and download your CV as a high-quality PDF.</p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: '#eff6ff', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                 <FileText size={32} color="var(--primary)" />
              </div>
              <h3>No Design Skills Required</h3>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Create a professional CV without manually formatting documents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--card-bg)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>How It Works</h2>
          <div className="grid-2" style={{ gap: '2rem', alignItems: 'center' }}>
             <div>
                <ol style={{ listStylePosition: 'inside', padding: 0, fontSize: '1.25rem' }}>
                  <li style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}><strong>Step 1:</strong> Enter Your Details</li>
                  <li style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}><strong>Step 2:</strong> Choose a Template</li>
                  <li style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}><strong>Step 3:</strong> Preview Your CV</li>
                  <li style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}><strong>Step 4:</strong> Download PDF</li>
                </ol>
             </div>
             <div style={{ textAlign: 'center' }}>
                <Link to="/create" className="btn btn-primary" style={{ fontSize: '1.5rem', padding: '1rem 3rem' }}>
                  Ready to create your CV?
                </Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
