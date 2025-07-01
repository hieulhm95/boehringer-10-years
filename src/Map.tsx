/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useCallback, useState, Fragment } from 'react';
import { Stage, Layer, Image, Text } from 'react-konva';
import { useWebSocket } from './hooks/useWebSocket';
import { UserJoinedEvent, PositionedUser } from './types/user.types';
import './Map.css';
import useImage from 'use-image';

const URLImage = ({ src, ...rest }) => {
  const [image] = useImage(src, 'anonymous');
  return <Image image={image} {...rest} />;
};

function AnimationMap({
  inputUsers
}: {
  inputUsers: string[]
}) {
  const minuses = [-1, 1];

  const intervalRef = useRef<() => void>(null);
  const layerRef = useRef<any>(null);
  const [itemTexts, setItemTexts] = useState<any[]>([]);
  const backgroundRef = useRef<any>(null);
  const finishRef = useRef<any>(null);
  const currentInputUserIndexRef = useRef<number>(0);
  const maxTime = 10 * 1000;
  const startTimeRef = useRef<number>(Date.now());
  const [eventStop, setEventStop] = useState<boolean>(false);

  const generateName = (name: string) => {
    const xDirection = minuses[Math.floor(Math.random() * 2)];
    const yDirection = minuses[Math.floor(Math.random() * 2)];

    const baseX = window.innerWidth / 2 + (Math.floor(Math.random() * 150) + 25) * xDirection;
    const baseY = window.innerHeight / 2 + (Math.floor(Math.random() * 200)) * yDirection;

    return {
      x: baseX,
      y: baseY,
      opacity: 0.005,
      xVelocity: (Math.floor(Math.random() * 2) + 2) * xDirection,
      yVelocity: 1 * yDirection,
      stopX: Math.floor(Math.random() * 100) + 50,
      stopY: Math.floor(Math.random() * 100) + 50,
      currentX: 0,
      currentY: 0,
      fontSize: 10,
      text: name,
    }
  }

  useEffect(() => {
    let count = 0;
    const names = [
      'Thảo',
      'Hoàng Đức',
      'Vũ Thị Lan',
      'Phan Van Kiet',
      'Ngô Văn Hoàng',
      'Trinh Van Nam',
      'Le Hieu',
      'Cao Thi Linh',
      'Phạm Đức',
      'Trần Thị Hương',
      'Ngo Thi Thao',
      'Dang Thi Mai',
      'Lam Thi Phuong',
      'Đặng Minh',
      'Vo Van Tuan',
      'Yến',
      'Bui Van Khang',
      'Nguyen Van Minh',
      'Lê Văn Phúc',
      'Do Van Thanh',
      'Tran Van Hung',
      'Pham Thi Hoa',
      'Nguyen Thi Nga',
      'Mai',
      'Le Hoang Duc',
      'Vu Thi Huong',
      'Minh',
      'Duong Thi Yen',
      'Ly Van Phong',
      'Khang',
      'Cao Thị',
      'Nguyễn Văn Tiên',
      'Hoang Van Dat',
      'Linh',
      'Hương',
      'Tran Thi Lan',
      'Le Thi Quynh',
      'Trịnh Văn',
      'Nam',
      'Phương',
    ];
    const nameLength = names.length;
    finishRef.current.style.display = "none";
    intervalRef.current = function () {
      setTimeout(() => {
        setItemTexts(prev => [
          ...prev,
          generateName(names[Math.floor(Math.random() * nameLength)]),
        ]);
        count += 1;
        const currentTime = Date.now();
        if (currentTime - startTimeRef.current >= maxTime - 2000) {
          backgroundRef.current.remove();
          finishRef.current.style.display = "block";
          finishRef.current.play();
        }
        if (Date.now() - startTimeRef.current < maxTime) {
          intervalRef.current?.();
        }
        else {
          setTimeout(() => {
            animation.stop();
          }, 20000);
        }

      }, 499);
    };
    intervalRef.current();
    const targetFPS = 30;
    let frameCount = 0;
    const animation = new (window as any).Konva.Animation((frame) => {
      const timeDiff = frame.timeDiff;
      frameCount += timeDiff / (1000 / targetFPS);
      if (frameCount >= 1) {
        setItemTexts(prev => {
          return prev.map(p => {
            const opacity = Math.min(1, p.opacity + 0.015);
            // if (p.currentX == p.stopX || p.currentY == p.stopY) return p;
            const xDirection = p.xVelocity < 0 ? -1 : 1;
            const yDirection = p.yVelocity < 0 ? -1 : 1;

            const xVelocity = (Math.abs(p.xVelocity) + 0.095) * xDirection;
            const yVelocity = (Math.abs(p.yVelocity) + 0.025) * yDirection;

            let x = p.x + xVelocity;
            let y = p.y + yVelocity;

            let stopX = false;
            let stopY = false;

            let currentX = p.currentX;
            let currentY = p.currentY;

            if (currentX == p.stopX) stopX = true;
            else currentX += 1;

            if (currentY == p.stopY) stopY = true;
            else currentY += 1;

            // if (stopX) y = p.y;
            // if (stopY) x = p.x;

            const name = p.text;
            let fontSize = p.fontSize;
            if (!stopX && !stopY) {
              fontSize += 0.5;
            }
            if (stopX || stopY) {
              const _opacity = p.transform ? p.opacity : Math.min(0.95, opacity * Math.random());
              const textOpacity = p.transform ? Math.max(0, p.textOpacity - 0.05) : 1;
              return {
                url: '/cross-med.png',
                text: p.text,
                x: x,
                y: y,
                xVelocity: xVelocity,
                yVelocity: yVelocity,
                currentX: currentX,
                currentY: currentY,
                stopX: p.stopX,
                stopY: p.stopY,
                opacity: _opacity,
                textOpacity: textOpacity,
                size: p.size || (Math.floor(p.fontSize) * 3),
                fontSize: p.fontSize,
                transform: true
              };
            }
            return {
              ...p,
              xVelocity: xVelocity,
              yVelocity: yVelocity,
              x: x,
              y: y,
              currentX: currentX,
              currentY: currentY,
              opacity: opacity,
              text: name,
              fontSize: fontSize,
            };
          });
        });
        frameCount = 0;
      }
    }, layerRef.current);

    animation.start();

    return () => {
      intervalRef.current = () => { };
      animation.stop();
    };
  }, []);

  useEffect(() => {
    const currentTime = Date.now();
    if(inputUsers && inputUsers[currentInputUserIndexRef.current] && currentTime - startTimeRef.current < maxTime) {
      const name = inputUsers[currentInputUserIndexRef.current++];
      setItemTexts(prev => {
        return [
          ...prev,
          generateName(name)
        ]
      });
    }
  }, [inputUsers]);

  return (
    <div className="wrapper">
      <video autoPlay muted loop className="video-background" src="/loop.mp4" ref={backgroundRef}></video>
      <video muted className="video-background" src="/finish.mp4" ref={finishRef}></video>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer ref={layerRef}>
          {itemTexts.map((t, index) => {
            if ((t.x > window.innerWidth || t.x < 0) && (t.y > window.innerHeight || t.y < 0)) return null;
            if (t.url) {
              return (
                <Fragment key={`key-${index}`}>
                  <Text
                    key={`text-${index}`}
                    text={t.text}
                    opacity={t.textOpacity}
                    fill="white"
                    fontSize={t.fontSize}
                    x={t.x}
                    y={t.y}
                    fontStyle="bold"
                    stroke={"#131313"}
                    strokeWidth={1}
                    shadowColor="#00ffcc"        // teal-cyan glow
                    shadowBlur={40}              // soft glow radius
                    shadowOffset={{ x: 0, y: 0 }}// centered glow
                    shadowOpacity={1}          // adjust glow strength
                    align="center"
                  />
                  <URLImage
                    key={`cross-${index}`}
                    src={t.url}
                    width={t.size}
                    height={t.size}
                    x={t.x}
                    y={t.y}
                    opacity={t.opacity}
                    shadowColor="#00ffcc"        // teal-cyan glow
                    shadowBlur={40}              // soft glow radius
                    shadowOffset={{ x: 0, y: 0 }}// centered glow
                    shadowOpacity={1}          // adjust glow strength
                  />
                </Fragment>
              );
            }
            return (
              <Fragment key={`item-${index}`}>
                <Text
                  key={`text-${index}`}
                  text={t.text}
                  opacity={t.opacity}
                  fill="white"
                  fontSize={t.fontSize}
                  x={t.x}
                  y={t.y}
                  fontStyle="bold"
                  stroke={"#131313"}
                  strokeWidth={1}
                  shadowColor="#00ffcc"        // teal-cyan glow
                  shadowBlur={40}              // soft glow radius
                  shadowOffset={{ x: 0, y: 0 }}// centered glow
                  shadowOpacity={1}          // adjust glow strength
                  align="center"
                />
              </Fragment>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}

function Map() {
  const [demoMode, setDemoMode] = useState(false);
  const [lastSocketActivity, setLastSocketActivity] = useState<number>(Date.now());
  const [inputUsers, setInputUsers] = useState<string[]>([]);
  const handleUserJoined = useCallback(
    (data: UserJoinedEvent) => {
      // Update last socket activity timestamp
      setLastSocketActivity(Date.now());
      setInputUsers(users => [...users, data.username])
      // Use the new multiple usernames function for more interactive display
      // addMultipleUsernames(data.username, data.userId);
    },
    // [addMultipleUsernames]
    []
  );

  const handleConnected = useCallback(() => {
    console.log('Connected to live stream WebSocket');
    setLastSocketActivity(Date.now());
    setDemoMode(false); // Disable demo mode when real connection works
  }, []);

  const handleDisconnect = useCallback(() => {
    console.log('Disconnected from live stream WebSocket');
  }, []);

  const handleError = useCallback((error: string) => {
    console.error('Live stream WebSocket error:', error);
    console.log('Switching to demo mode...');
    setDemoMode(true); // Enable demo mode on connection error
  }, []);
  const { isConnected, connect, disconnect } = useWebSocket({
    onUserJoined: handleUserJoined,
    onConnected: handleConnected,
    onDisconnect: handleDisconnect,
    onError: handleError,
  });
  return (
    <div className="background">
      <div
        className="connection-status-indicator"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: isConnected
            ? 'rgba(40, 167, 69, 0.8)'
            : demoMode
            ? 'rgba(255, 193, 7, 0.8)'
            : 'rgba(220, 53, 69, 0.8)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 1000,
        }}
      >
        {isConnected ? '🟢 LIVE' : demoMode ? '🟡 DEMO' : '🔴 OFFLINE'}
      </div>
      {isConnected ?  <AnimationMap inputUsers={inputUsers}/> : null}
      {/* {showedAnimationMap ? <AnimationMap /> : <>
            <div className="text-box">
                <img src="/tu-nhung-nguoi-da-tien-phong.png" height={40} className="text" />
                <img src="/nhung-nguoi-dang-hanh-dong.png" height={40} className="text" />
                <img src="/nhung-nguoi-sap-bat-dau.png" height={210} className="text" />
            </div>
            <div className="map">
                <img src="/map-with-cross.png" height="99%"/>
            </div>
        </>} */}
    </div>
  );
}

export default Map;
