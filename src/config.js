let BASE_URL, SECOND_URL;

if (
  window.location.host === "localhost:3000" ||
  window.location.host === "admin.viebeg.4-com.pro"
) {
  BASE_URL = "http://api.viebeg.4-com.pro/api/v0/";
} else {
  BASE_URL = "https://viebeg.vieprocure.com/api/v0/";
}

SECOND_URL = "";

export const API_BASE_URL = BASE_URL;
export const API_SECOND_URL = SECOND_URL;
