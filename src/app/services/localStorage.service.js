const TOKEN_KEY = "jwt-token",
  REFRESH_KEY = "jwt-refresh-token",
  EXPIRES_KEY = "jwt-expires",
  USERID_KEY = "user-local-id";

export function setTokents({
  refreshToken,
  idToken,
  localId,
  expiresIn = 3600,
}) {
  const expiresDate = new Date().getTime() + expiresIn * 1000;
  localStorage.setItem(USERID_KEY, localId);
  localStorage.setItem(TOKEN_KEY, idToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(EXPIRES_KEY, expiresDate);
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function getTokenExpiresData() {
  return localStorage.getItem(EXPIRES_KEY);
}

export function getUserId() {
  return localStorage.getItem(USERID_KEY);
}

const localStorageService = {
  setTokents,
  getAccessToken,
  getRefreshToken,
  getTokenExpiresData,
  getUserId,
};

export default localStorageService;
