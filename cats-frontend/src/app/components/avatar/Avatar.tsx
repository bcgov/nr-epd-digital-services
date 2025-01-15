import React from 'react';
import './Avatar.css';

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  customImageCss?: string;
  customTextCss?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  firstName,
  lastName,
  customImageCss,
  customTextCss,
}) => {
  // Function to get initials
  const getInitials = (): string => {
    if (!firstName && !lastName) return '?';
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <div
      className={`d-flex align-items-center justify-content-center ${customImageCss ?? 'avatar-image'}`}
      aria-label="User profile image"
    >
      <span className={`${customTextCss ?? 'avatar-txt'}`}>
        {getInitials()}
      </span>
    </div>
  );
};

export default Avatar;
