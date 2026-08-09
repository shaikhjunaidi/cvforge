import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Edit, Eye, Download, LayoutTemplate } from 'lucide-react';
const Home = () => {
  return (
    <div className="home-page">
      <section className="hero" style={{ 
        padding: '5rem 0', 
        textAlign: 'center', 
        background: 'linear-gradient(135deg, var(--primary) 0%, #2e3875 100%)', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '4px solid #1a2254'
      }}>
        {/* Subtle background decoration */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.1, transform: 'rotate(15deg)' }}>
          <FileText size={400} />
        </div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '15px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}>
              <FileText size={48} strokeWidth={2} />
            </div>
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: '800', letterSpacing: '-1px' }}>
            Build a Winning CV with <span style={{ color: '#93c5fd' }}>CVForge</span>
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: '0.9', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
            The fast, easy, and completely free way to generate professional, beautifully-formatted resumes. Choose a template and get hired faster.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/create" className="btn btn-secondary" style={{ fontSize: '1.125rem', padding: '0.875rem 2.5rem', fontWeight: 'bold', boxShadow: '0 4px 14px 0 rgba(255, 255, 255, 0.2)' }}>
              Create My CV Now
            </Link>
            <Link to="/templates" className="btn" style={{ border: '1px solid rgba(255,255,255,0.4)', backgroundColor: 'transparent', color: 'white', fontSize: '1.125rem', padding: '0.875rem 2.5rem', fontWeight: 'bold' }}>
              Explore Templates
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
      {/* Footer Branding */}
      <footer style={{ backgroundColor: 'var(--secondary)', color: 'white', padding: '3rem 0 2rem 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1rem' }}>
            <FileText size={28} color="#93c5fd" />
            <span style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.5px' }}>CVForge</span>
          </div>
          <p style={{ opacity: 0.7, maxWidth: '500px', margin: '0 auto 2rem' }}>
            Empowering professionals to build standout resumes effortlessly. Your career journey starts here.
          </p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', fontSize: '0.875rem', opacity: 0.5 }}>
            &copy; {new Date().getFullYear()} CVForge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
