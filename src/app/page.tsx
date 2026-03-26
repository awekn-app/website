'use client';

import { useEffect, useRef, useState, useActionState } from 'react';
import { joinWaitlist } from './actions';

export default function Home() {
  // Attempt to start unmuted as requested. If browser blocks it, gracefully fall back.
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
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
    // Video should ALWAYS be muted and play automatically
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(e => console.error("Video forced play failed:", e));
    }
    
    // Attempt to play audio unmuted as requested
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().then(() => {
        setIsAudioMuted(false);
      }).catch(e => {
        // Safari/Chrome strictly blocks audio without user interaction.
        // If blocked, we gracefully degrade to muted state so the user can easily tap to play it.
        audioRef.current!.muted = true;
        setIsAudioMuted(true);
      });
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !audioRef.current.muted;
      audioRef.current.muted = newMutedState;
      setIsAudioMuted(newMutedState);
      
      // If unmuting and video was paused, force play
      if (!newMutedState && audioRef.current.paused) {
        audioRef.current.play().catch(console.error);
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
        
        {/* Custom audio track added by User */}
        <audio
          ref={audioRef}
          autoPlay
          loop
          muted={isAudioMuted}
        >
          <source src="/ReelAudio-67053.mp3" type="audio/mpeg" />
        </audio>

        <div className="unmute-hint fade-up delay-1" onClick={(e) => { e.stopPropagation(); toggleMute(); }}>
          {isAudioMuted ? (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
              <span>Tap to unmute</span>
            </>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
              <span>Tap to mute</span>
            </>
          )}
        </div>

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
