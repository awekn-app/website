'use client';

import { useEffect, useRef, useState, useActionState } from 'react';
import { joinWaitlist } from './actions';

export default function Home() {
  // Mobile browsers strictly block audio autoplay. We must start muted for the video to play automatically.
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // React 19's useActionState for form action
  const [state, formAction, isPending] = useActionState(joinWaitlist, null);

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach((el) => observer.observe(el));

    // Cleanup observer
    return () => observer.disconnect();
  }, []);

  // Robust autoplay handling for React
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(e => console.error("Autoplay forced play failed:", e));
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsVideoMuted(newMutedState);
      
      // If the browser paused the video initially, tapping will ensure it plays
      if (videoRef.current.paused) {
        videoRef.current.play().catch(console.error);
      }
    }
  };

  return (
    <main className="main-container">
      {/* Hero Video Section - Only video and scroll hint */}
      <section className="hero" onClick={toggleMute}>
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted
          playsInline
          className="bg-video"
        >
          <source src="/Video_Revision_Request.mp4" type="video/mp4" />
        </video>

        {isVideoMuted && (
          <div className="unmute-hint fade-up delay-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
            <span>Tap to unmute</span>
          </div>
        )}

        <div className="scroll-indicator fade-up delay-2">
          <span>Scroll down</span>
          <div className="arrow-down"></div>
        </div>
      </section>

      {/* Impact Copy Section */}
      <section className="impact-section">
        <div className="container">
          <h2 className="reveal impact-text bold-heading">
            True growth demands progressive overload.
          </h2>
          <p className="reveal impact-subtext delay-1">
            In bodybuilding and powerlifting, forgetting a single rep costs you gains. Awekn ensures you never miss a beat. We track every set, every rep, and every PR aligning perfectly with your workout plan.
          </p>
          <p className="reveal impact-subtext delay-2">
            Get AI-generated progress reports at the end of every weekly cycle. Stop guessing, start growing.
          </p>
          <h3 className="reveal call-to-arms delay-3 bold-heading">Join the Awekn society.</h3>
        </div>
      </section>

      {/* Waitlist Form Section */}
      <section className="form-section reveal">
        <div className="container form-container">
          <h2 className="bold-heading form-title">Pre-Register Now</h2>
          <p style={{ color: '#aaa', marginBottom: '2rem' }}>Coming soon to the App Store and Google Play.</p>
          
          <div className="store-badges">
             <div className="badge apple-badge">APP STORE</div>
             <div className="badge google-badge">GOOGLE PLAY</div>
          </div>

          <form action={formAction} className="waitlist-form">
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" required placeholder="Chris Bumstead" />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" required placeholder="cbum@example.com" />
            </div>
            <div className="input-group">
              <label htmlFor="country">Country</label>
              <input type="text" id="country" name="country" required placeholder="Canada" />
            </div>
            
            <button type="submit" className="submit-btn" disabled={isPending}>
              {isPending ? 'JOINING...' : 'SECURE MY SPOT'}
            </button>

            {state?.success && (
              <p className="success-msg">{state.message}</p>
            )}
            {state?.error && (
              <p className="error-msg">{state.error}</p>
            )}
          </form>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="container footer-content">
          <p className="contact-email">Contact: <a href="mailto:areeb@awekn.com">areeb@awekn.com</a></p>
          <div className="social-links">
            <a href="https://www.instagram.com/awekn.app?igsh=ZXVnenlwcWg3amRj&utm_source=qr" target="_blank" rel="noopener noreferrer">@awekn.app (Official)</a>
            <a href="https://www.instagram.com/heisareeb?igsh=MTdmZTV2bTdpd3h0cw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">@heisareeb (Founder)</a>
          </div>
          <p className="copyright">&copy; {new Date().getFullYear()} Awekn. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
