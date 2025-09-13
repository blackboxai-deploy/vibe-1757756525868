export interface User {
  id: number;
  email: string;
  anonymousId: string;
  joinDate?: string;
}

export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  
  try {
    const userData = localStorage.getItem("confess_user");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: User): void => {
  if (typeof window === "undefined") return;
  
  localStorage.setItem("confess_user", JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("confess_user");
};

export const generateAnonymousName = (): string => {
  const adjectives = [
    "Brave", "Kind", "Wise", "Gentle", "Strong", "Peaceful", "Hopeful", 
    "Caring", "Thoughtful", "Quiet", "Bold", "Sincere", "Honest", "True",
    "Deep", "Bright", "Calm", "Free", "Open", "Pure"
  ];
  
  const nouns = [
    "Heart", "Soul", "Mind", "Spirit", "Voice", "Light", "Hope", "Dream",
    "Journey", "Path", "Story", "Truth", "Seeker", "Wanderer", "Explorer",
    "Guardian", "Healer", "Listener", "Friend", "Companion"
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  
  return `${adjective}${noun}${number}`;
};

export const validateEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};