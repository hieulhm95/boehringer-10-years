import './App.css';
import Background from './assets/form-background-2.png';
import WelcomeBackground from './assets/welcome-background.png';
import FirstScreenLogo from './assets/first-screen-logo.png';
import AfterClickBackground from './assets/after-click-background.png';
import LeftLogo from './assets/left-logo.png';
import RightLogo from './assets/right-logo.png';
// import LogoPreClick from './assets/pre-click-content.png';
// import LogoAfterClick from './assets/after-click-content.png';
// import AcceptButton from './assets/accept-button.png';
import { useState, useEffect } from 'react';
import BigText from './assets/big-logo.png';
import Button from './assets/button.png';
// import Cookies from 'js-cookie';

// Screen states
enum AppScreen {
  WELCOME = 'welcome',
  FORM = 'form',
  THANK_YOU = 'thank_you',
}

function App() {
  const [animationClass, setAnimationClass] = useState(''); // Track animation class
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.WELCOME); // Track current screen
  const [loading, setLoading] = useState(false); // Track if loading is in progress
  const [inputValue, setInputValue] = useState(''); // Track input value
  const [savedInputValue, setSavedInputValue] = useState(''); // Save input value after click

  useEffect(() => {
    if (currentScreen === AppScreen.WELCOME) {
      const timer = setTimeout(() => {
        setCurrentScreen(AppScreen.FORM);
        setAnimationClass('fade-in');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Function to navigate between screens with animation
  const navigateToScreen = (targetScreen: AppScreen, callback?: () => void) => {
    setAnimationClass('fade-out');

    setTimeout(() => {
      setCurrentScreen(targetScreen);
      setAnimationClass('fade-in');
      callback?.(); // Execute callback if provided

      setTimeout(() => {
        setAnimationClass('');
      }, 200);
    }, 200);
  };

  // Handle welcome screen click
  const handleWelcomeClick = () => {
    navigateToScreen(AppScreen.FORM);
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    // Validate input
    if (!inputValue.trim()) {
      alert('Vui lòng nhập tên của bạn');
      return;
    }

    // Save the current input value
    setSavedInputValue(inputValue);

    setAnimationClass('fade-out');
    setLoading(true);

    try {
      // Submit username to API
      const response = await fetch(
        'https://boehringer-ingelheim-empa-10years.com/api/user/submit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: inputValue.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Username submitted successfully:', result);

      // Navigate to thank you screen
      setTimeout(() => {
        setCurrentScreen(AppScreen.THANK_YOU);
        setAnimationClass('fade-in');

        setTimeout(() => {
          setLoading(false);
        }, 200);
      }, 200);
    } catch (error) {
      console.error('Error submitting username:', error);
      alert('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại!');

      setAnimationClass('');
      setLoading(false);
    }
  };

  // Determine background based on current screen
  const getBackgroundImage = () => {
    switch (currentScreen) {
      case AppScreen.WELCOME:
        return WelcomeBackground;
      case AppScreen.FORM:
        return Background;
      case AppScreen.THANK_YOU:
        return AfterClickBackground;
      default:
        return Background;
    }
  };

  // Render current screen content
  const renderScreenContent = () => {
    if (loading) {
      return (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      );
    }

    // Show current screen content, including during animation transitions
    switch (currentScreen) {
      case AppScreen.WELCOME:
        return (
          <div className={`content ${animationClass}`}>
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Logo */}
              <div className="welcome-logo-container">
                <img
                  src={FirstScreenLogo}
                  alt="Protection Shield Logo"
                  style={{
                    width: '80%',
                    height: 'auto',
                    objectFit: 'contain',
                    marginLeft: '-60px', // Move logo slightly to the left for better centering
                  }}
                />
              </div>

              {/* Text */}
              <div>
                <p className="message-text message-text-first-screen">
                  MỖI QUYẾT ĐỊNH KỊP THỜI
                  <br />
                  NHIỂU CUỘC ĐỜI ĐƯỢC BẢO VỆ
                </p>
              </div>

              {/* Click anywhere to continue */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                  zIndex: 10,
                }}
                onClick={handleWelcomeClick}
              />
            </div>
          </div>
        );

      case AppScreen.FORM:
        return (
          <div className={`content ${animationClass}`}>
            <div
              style={{
                maxWidth: '60%',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <img src={BigText} alt="Big Text" className="bigText" />
              {/* <img
                src={ThankText}
                alt="Thank Text"
                className="thankText"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              /> */}
              <div>
                <p className="message-text message-text-form">
                  MỜI QUÝ BÁC SĨ/DƯỢC SĨ
                  <br />
                  NHẬP TÊN BÊN DƯỚI:
                </p>
              </div>

              <div className="input-container">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder=""
                  className="rounded-input"
                />
              </div>

              <div className="footer" onClick={handleFormSubmit}>
                <img src={Button} alt="Button" className="button" />
              </div>
              {/*
              <img
                src={Description}
                alt="Description"
                className="description"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              /> */}
            </div>
          </div>
        );

      case AppScreen.THANK_YOU:
        return (
          <div className={`content ${animationClass}`}>
            <div className="post-click-content">
              <div className="thank-you-message">
                <h2>Cám ơn Quý BÁC SĨ/DƯỢC SĨ:</h2>
                {savedInputValue && (
                  <h3 className="doctor-name doctor-name-gradient">{savedInputValue}</h3>
                )}
                <p className="message-text message-text-thank">
                  ĐÃ CÙNG ĐỒNG HÀNH
                  <br />
                  ĐỂ NHIỀU BỆNH NHÂN
                  <br />
                  ĐƯỢC BẢO VỆ TOÀN DIỆN.
                </p>
              </div>

              <div className="gallery-container">
                <video
                  src="https://boehringer-ingelheim-empa-10years.com/media/thanks.mp4"
                  className="human-gallery"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="posterWrapper"
      style={{
        background: `url(${getBackgroundImage()})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header with logos */}
      <div className="header">
        <img src={LeftLogo} alt="Left Logo" className="leftLogo" />
        <img src={RightLogo} alt="Right Logo" className="rightLogo" />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          height: 'calc(100vh - 120px)',
          width: '100%',
          flexDirection: 'column',
          paddingTop: '3.5rem',
        }}
      >
        {renderScreenContent()}
      </div>
    </div>
  );
}

export default App;
