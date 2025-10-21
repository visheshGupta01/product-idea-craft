/**
 * Get initials from a name
 * @param name - Full name or first/last name
 * @returns Two character initials
 */
export const getInitials = (name?: string | null): string => {
  if (!name || typeof name !== 'string') return '??';
  
  const trimmed = name.trim();
  if (!trimmed) return '??';
  
  const parts = trimmed.split(' ').filter(part => part.length > 0);
  
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  
  // Take first letter of first and last part
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Get initials from firstName and lastName
 * @param firstName - First name
 * @param lastName - Last name
 * @returns Two character initials
 */
export const getInitialsFromNames = (firstName?: string | null, lastName?: string | null): string => {
  const first = firstName?.trim();
  const last = lastName?.trim();
  
  if (first && last) {
    return (first[0] + last[0]).toUpperCase();
  }
  
  if (first) {
    return first[0].toUpperCase();
  }
  
  if (last) {
    return last[0].toUpperCase();
  }
  
  return '??';
};
