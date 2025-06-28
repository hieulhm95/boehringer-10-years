import React, { useState, useCallback, useEffect } from 'react';
import '../App.css';
import LiveBackground from '../assets/live-background.png';
import { useWebSocket } from '../hooks/useWebSocket';
import { UserJoinedEvent, PositionedUser } from '../types/user.types';

const LivePage: React.FC = () => {
  const [positionedUsers, setPositionedUsers] = useState<PositionedUser[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [lastSocketActivity, setLastSocketActivity] = useState<number>(Date.now());

  // Vietnamese names list for interactive display
  const vietnameseNames = [
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

  // Generate random position within viewport
  const generateRandomPosition = (): { x: number; y: number } => {
    const padding = 100; // Keep usernames away from edges
    const maxX = window.innerWidth - padding;
    const maxY = window.innerHeight - padding;

    return {
      x: Math.random() * (maxX - padding) + padding,
      y: Math.random() * (maxY - padding) + padding,
    };
  };

  // Get random names from the Vietnamese names list
  const getRandomVietnameseNames = useCallback(
    (count: number, exclude?: string): string[] => {
      const availableNames = vietnameseNames.filter(name => name !== exclude);
      const shuffled = [...availableNames].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    },
    [vietnameseNames]
  );

  // Add username to display (works for both real WebSocket and demo)
  const addUsername = useCallback((username: string, userId?: string) => {
    const position = generateRandomPosition();
    const positionedUser: PositionedUser = {
      username,
      x: position.x,
      y: position.y,
      id: userId ? `${userId}-${Date.now()}` : `demo-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };

    setPositionedUsers(prev => [...prev, positionedUser]);

    // Remove username after 30 seconds
    setTimeout(() => {
      setPositionedUsers(prev => prev.filter(user => user.id !== positionedUser.id));
    }, 30000);
  }, []);

  // Add multiple usernames for interactive effect
  const addMultipleUsernames = useCallback(
    (mainUsername: string, userId?: string) => {
      // Add the main username first
      addUsername(mainUsername, userId);

      // Add 1 random Vietnamese names with slight delay for better visual effect
      const randomNames = getRandomVietnameseNames(1, mainUsername);

      randomNames.forEach((name, index) => {
        setTimeout(() => {
          addUsername(name, `random-${index}-${Date.now()}`);
        }, (index + 1) * 800); // Stagger the appearance by 800ms each
      });
    },
    [addUsername, getRandomVietnameseNames]
  );

  // Auto-render names when no socket activity (for interactive experience)
  useEffect(() => {
    if (demoMode) return; // Don't run in demo mode

    const interval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastSocketActivity;

      // If no socket activity for more than 1500ms, add 1-2 random names
      if (timeSinceLastActivity >= 1500) {
        const namesToAdd = Math.random() < 0.5 ? 1 : 2; // Randomly choose 1 or 2 names
        const randomNames = getRandomVietnameseNames(namesToAdd);

        randomNames.forEach((name, index) => {
          setTimeout(() => {
            addUsername(name, `auto-${index}-${Date.now()}`);
          }, index * 300); // Stagger by 300ms if adding 2 names
        });

        // Update last activity to prevent too frequent auto-additions
        setLastSocketActivity(Date.now());
      }
    }, 1500); // Check every 1500ms

    return () => clearInterval(interval);
  }, [demoMode, lastSocketActivity, getRandomVietnameseNames, addUsername]);

  const handleUserJoined = useCallback(
    (data: UserJoinedEvent) => {
      // Update last socket activity timestamp
      setLastSocketActivity(Date.now());
      // Use the new multiple usernames function for more interactive display
      addMultipleUsernames(data.username, data.userId);
    },
    [addMultipleUsernames]
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

  // Auto-connect on component mount
  useEffect(() => {
    console.log('LivePage: Attempting to connect to WebSocket...');
    connect();

    return () => {
      disconnect();
    };
  }, []); // Remove dependencies to prevent reconnection loop

  // Handle demo mode activation separately
  useEffect(() => {
    let demoTimer: number;

    if (!isConnected) {
      // Enable demo mode after 5 seconds if not connected
      demoTimer = setTimeout(() => {
        console.log('WebSocket connection failed after 5 seconds, enabling demo mode');
        setDemoMode(true);
      }, 5000);
    } else {
      // Disable demo mode when connected
      setDemoMode(false);
    }

    return () => {
      if (demoTimer) {
        clearTimeout(demoTimer);
      }
    };
  }, [isConnected]); // Only depend on isConnected, not connect/disconnect

  // Handle window resize to recalculate positions if needed
  useEffect(() => {
    const handleResize = () => {
      setPositionedUsers(prev =>
        prev.map(user => ({
          ...user,
          ...generateRandomPosition(),
        }))
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="live-page"
      style={{
        background: `url(${LiveBackground})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Connection status indicator */}
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

      {/* Render positioned usernames */}
      {positionedUsers.map(user => (
        <div
          key={user.id}
          className="positioned-username"
          style={{
            position: 'absolute',
            left: `${user.x}px`,
            top: `${user.y}px`,
            background: 'linear-gradient(135deg, #a8e6cf 0%, #7dd3c7 40%, #5bc0be 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'BoehringerForwardHead, Arial, sans-serif',
            fontSize: '32px', // Increased from 24px to 32px
            fontWeight: '600', // Slightly lighter than bold
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)', // Lighter shadow
            animation: 'fadeInUsernameScale 0.8s ease-out',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 10,
            letterSpacing: '0.5px', // Better letter spacing
            lineHeight: 1.2,
          }}
        >
          {user.username}
        </div>
      ))}
    </div>
  );
};

export default LivePage;
