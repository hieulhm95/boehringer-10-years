import './App.css';
import Background from './assets/form-background-2.png';
import AfterClickBackground from './assets/after-click-background.png';
import LeftLogo from './assets/left-logo.png';
import RightLogo from './assets/right-logo.png';
import HumanGallery from './assets/human-gallery.png';
// import LogoPreClick from './assets/pre-click-content.png';
// import LogoAfterClick from './assets/after-click-content.png';
// import AcceptButton from './assets/accept-button.png';
import { useState } from 'react';
import BigText from './assets/big-logo.png';
import Button from './assets/button.png';
import Description from './assets/description.png';
import ThankText from './assets/thank-text.png';
// import Cookies from 'js-cookie';

function App() {
  const [animationClass, setAnimationClass] = useState(''); // Track animation class
  const [showPreClickContent, setShowPreClickContent] = useState(true); // Control which content to show
  const [isAnimating, setIsAnimating] = useState(false); // Track if animation is in progress
  const [loading, setLoading] = useState(false); // Track if loading is in progress
  const [inputValue, setInputValue] = useState(''); // Track input value
  const [savedInputValue, setSavedInputValue] = useState(''); // Save input value after click
  // useEffect(() => {
  //   const cookieValue = Cookies.get('boehringer_10_accepted');
  //   if (cookieValue === 'true') {
  //     setIsAccepted(true);
  //   } else {
  //     setIsAccepted(false);
  //   }
  // }, []);

  const handleOnClick = async () => {
    // Validate input
    if (!inputValue.trim()) {
      alert('Vui lòng nhập tên của bạn');
      return;
    }

    // Save the current input value
    setSavedInputValue(inputValue);

    setAnimationClass('fade-out'); // Start fade-out animation
    setIsAnimating(true); // Mark animation as in progress
    setLoading(true); // Show loading indicator

    try {
      // Submit username to API
      const response = await fetch('https://chubb-party-project-backend.onrender.com/user/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: inputValue.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Username submitted successfully:', result);

      // Proceed with UI animation after successful API call
      setTimeout(() => {
        setShowPreClickContent(false); // Hide pre-click content
        setAnimationClass('fade-in'); // Start fade-in animation

        setTimeout(() => {
          setIsAnimating(false); // Animation is complete
          setLoading(false); // Hide loading indicator
        }, 200); // Match the duration of the fade-in animation
      }, 200); // Match the duration of the fade-out animation
    } catch (error) {
      console.error('Error submitting username:', error);

      // Show error message but still proceed with UI (for better UX)
      alert('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại!');

      // Reset animation state on error
      setAnimationClass('');
      setIsAnimating(false);
      setLoading(false);
    }
  };

  return (
    <div
      className="posterWrapper"
      style={{
        background: `url(${showPreClickContent ? Background : AfterClickBackground})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <button
        onClick={() => {
          window.location.href = '/live';
        }}
      >
        Live
      </button>
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
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : showPreClickContent || isAnimating ? (
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
              <img
                src={ThankText}
                alt="Thank Text"
                className="thankText"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />

              <div className="input-container">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder=""
                  className="rounded-input"
                />
              </div>

              <div className="footer" onClick={handleOnClick}>
                <img src={Button} alt="Button" className="button" />
              </div>

              <img
                src={Description}
                alt="Description"
                className="description"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
        ) : (
          <div className={`content ${animationClass}`}>
            <div className="post-click-content">
              {/* Thank you message with saved input */}
              <div className="thank-you-message">
                <h2>CẢM ƠN QUÝ BS,DS</h2>
                {savedInputValue && <h3 className="doctor-name">{savedInputValue}</h3>}
                <p className="message-text">
                  ĐÃ CÙNG ĐỒNG HÀNH ĐỂ THÊM NHIỀU BỆNH NHÂN
                  <br />
                  TIM MẠCH, THẬN, CHUYỂN HÓA
                  <br />
                  ĐƯỢC BẢO VỆ TOÀN DIỆN.
                </p>
              </div>

              {/* Human Gallery Image */}
              <div className="gallery-container">
                <img
                  src={HumanGallery}
                  alt="Human Gallery"
                  className="human-gallery"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
