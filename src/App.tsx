import './App.css';
import Background from './assets/background.png';
import LogoPreClick from './assets/pre-click-content.png';
import LogoAfterClick from './assets/after-click-content.png';
import AcceptButton from './assets/accept-button.png';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function App() {
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    const cookieValue = Cookies.get('boehringer_10_accepted');
    if (cookieValue === 'true') {
      setIsAccepted(true);
    } else {
      setIsAccepted(false);
    }
  }, []);

  const handleOnClick = () => {
    setIsAccepted(true);
    Cookies.set('boehringer_10_accepted', 'true', { expires: 5 });
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
        {isAccepted ? (
          <div className="content">
            <img src={LogoAfterClick} alt="Logo After Click" className="logoAfterClick" />
          </div>
        ) : (
          <>
            <div className="content">
              <img src={LogoPreClick} alt="Logo Pre Click" className="logoPreClick" />
            </div>
            <div className="footer" onClick={handleOnClick}>
              <img src={AcceptButton} alt="Accept Button" className="acceptButton" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
