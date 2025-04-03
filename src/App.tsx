import './App.css';
import Background from './assets/background.jpg';
import LeftLogo from './assets/left-logo.png';
import RightLogo from './assets/right-logo.png';
import LogoPreClick from './assets/logo-pre-click.png';
import LogoAfterClick from './assets/background-after-click.png';
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
        position: 'relative',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="header">
        <img src={LeftLogo} alt="Left Logo" className="leftLogo" />
        <img src={RightLogo} alt="Right Logo" className="rightLogo" />
      </div>
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
  );
}

export default App;
