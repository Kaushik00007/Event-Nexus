import { Link } from 'react-router-dom';
import { Calendar, Mail, Github, Twitter, Linkedin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  const socialLinks = [
    { icon: Twitter, delayClass: 'delay-[400ms]' },
    { icon: Github, delayClass: 'delay-[500ms]' },
    { icon: Linkedin, delayClass: 'delay-[600ms]' },
    { icon: Mail, delayClass: 'delay-[700ms]' },
  ];

  return (
    <footer ref={footerRef} className="bg-gray-900 text-gray-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand - Column 1 */}
          <div className={`col-span-1 md:col-span-2 transition-all duration-[800ms] ease-out delay-[100ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[50px]'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/logo.png"
                alt="EventNexus Logo"
                className="w-16 h-16 object-contain"
              />
              <span className="text-xl font-bold text-white">EventNexus</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md transition-colors">
              Your one-stop platform to discover college events, hackathons, coding contests,
              workshops, and more. Never miss an opportunity to learn and grow!
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className={`flex items-center justify-center text-gray-400 hover:text-white transition-all duration-500 ease-out ${item.delayClass} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                >
                  <item.icon className="w-5 h-5 transition-transform hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Column 2 */}
          <div className={`transition-all duration-[800ms] ease-out delay-[200ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[50px]'}`}>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/colleges" className="text-gray-400 hover:text-white transition-colors">
                  Participating Colleges
                </Link>
              </li>
              <li>
                <Link to="/events?category=hackathon" className="text-gray-400 hover:text-white transition-colors">
                  Hackathons
                </Link>
              </li>
              <li>
                <Link to="/events?category=coding-contest" className="text-gray-400 hover:text-white transition-colors">
                  Coding Contests
                </Link>
              </li>
              <li>
                <Link to="/events?category=workshop" className="text-gray-400 hover:text-white transition-colors">
                  Workshops
                </Link>
              </li>
              <li>
                <Link to="/create-event" className="text-gray-400 hover:text-white transition-colors">
                  Submit Event
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories - Column 3 */}
          <div className={`transition-all duration-[800ms] ease-out delay-[300ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[50px]'}`}>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events?category=seminar" className="text-gray-400 hover:text-white transition-colors">
                  Seminars
                </Link>
              </li>
              <li>
                <Link to="/events?category=tech-talk" className="text-gray-400 hover:text-white transition-colors">
                  Tech Talks
                </Link>
              </li>
              <li>
                <Link to="/events?category=cultural" className="text-gray-400 hover:text-white transition-colors">
                  Cultural Events
                </Link>
              </li>
              <li>
                <Link to="/events?category=sports" className="text-gray-400 hover:text-white transition-colors">
                  Sports
                </Link>
              </li>
              <li>
                <Link to="/events?category=networking" className="text-gray-400 hover:text-white transition-colors">
                  Networking
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={`border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center transition-all duration-[800ms] ease-out delay-[400ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[50px]'}`}>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} EventNexus. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
