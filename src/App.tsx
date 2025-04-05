import './App.css';
import Background from './assets/background.png';
import LogoPreClick from './assets/pre-click-content.png';
import LogoAfterClick from './assets/after-click-content.png';
import AcceptButton from './assets/accept-button.png';
import { useState } from 'react';
// import Cookies from 'js-cookie';

function App() {
  const [animationClass, setAnimationClass] = useState(''); // Track animation class
  const [showPreClickContent, setShowPreClickContent] = useState(true); // Control which content to show
  const [isAnimating, setIsAnimating] = useState(false); // Track if animation is in progress
  const [loading, setLoading] = useState(false); // Track if loading is in progress
  // useEffect(() => {
  //   const cookieValue = Cookies.get('boehringer_10_accepted');
  //   if (cookieValue === 'true') {
  //     setIsAccepted(true);
  //   } else {
  //     setIsAccepted(false);
  //   }
  // }, []);

  const handleOnClick = () => {
    setAnimationClass('fade-out'); // Start fade-out animation
    setIsAnimating(true); // Mark animation as in progress
    setLoading(true); // Show loading indicator

    setTimeout(() => {
      setShowPreClickContent(false); // Hide pre-click content
      setAnimationClass('fade-in'); // Start fade-in animation

      setTimeout(() => {
        setIsAnimating(false); // Animation is complete
        setLoading(false); // Hide loading indicator
      }, 200); // Match the duration of the fade-in animation
    }, 200); // Match the duration of the fade-out animation
  };

  return (
    <div
      className="posterWrapper"
      style={{
        background: `url(${Background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div>
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : showPreClickContent || isAnimating ? (
          <div className={`content ${animationClass}`}>
            <img src={LogoPreClick} alt="Logo Pre Click" className="logoPreClick" />
            <div className="footer" onClick={handleOnClick}>
              <img src={AcceptButton} alt="Accept Button" className="acceptButton" />
            </div>
          </div>
        ) : (
          <div className={`content ${animationClass}`}>
            <img src={LogoAfterClick} alt="Logo After Click" className="logoAfterClick" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
