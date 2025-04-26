import React, { useState, useEffect } from 'react';
import { Utensils, BookOpen } from 'lucide-react';
import EducationalContentShare from './EducationalContentShare';
import EducationalContentFeed from './EducationalContentFeed';
import './EducationalContent.css';

function EducationalContentPage() {
  const userId = localStorage.getItem("psnUserId");
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="app-container">
      {/* Logo and Title */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 30}px)`,
        transition: 'transform 1s, opacity 1s',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          backgroundColor: '#0056D2',
          padding: '0.75rem',
          borderRadius: '0.75rem',
          marginRight: '1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <BookOpen size={32} style={{ color: '#fff' }} />
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#0056D2',
          margin: 0,
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>Learning Docs</h1>
      </div>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <EducationalContentShare userId={userId} />
        
        <div className="content-divider"></div>
        
        <EducationalContentFeed userId={userId} />
      </div>
    </div>
  );
}

export default EducationalContentPage;