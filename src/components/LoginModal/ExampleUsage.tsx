'use client';

import { useAuth } from '@/src/context/AuthContext';
import LoginModal from '@/src/components/LoginModal/LoginModal';
import { COLORS } from '@/shared/constants/colors';

/**
 * Example component demonstrating Auth + LoginModal usage
 * Can be used in any page (admin, client, employee)
 */
export default function ExampleAuthUsage() {
  const { user, isAuthenticated, openLoginModal, isLoginModalOpen, closeLoginModal, logout } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Authentication Example</h1>

      {isAuthenticated ? (
        <div>
          <h2>Welcome, {user?.fullName}!</h2>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role.roleName}</p>
          
          <button
            onClick={logout}
            style={{
              backgroundColor: COLORS.primary,
              color: COLORS.textWhite,
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p>You are not logged in</p>
          <button
            onClick={openLoginModal}
            style={{
              backgroundColor: COLORS.primary,
              color: COLORS.textWhite,
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </div>
      )}

      {/* LoginModal - only shows when isLoginModalOpen is true */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
}
