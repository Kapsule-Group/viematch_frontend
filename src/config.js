let BASE_URL, SECOND_URL;
if (window.location.host === "localhost:3000" || window.location.host.includes("4-com")) {
    BASE_URL = "http://api.viebeg.4-com.pro/api/v0/"; //https://viebeg.vieprocure.com/api/v0/
} else {
    BASE_URL = "https://viebeg.vieprocure.com/api/v0/"; //'http://localhost:8000/api/v0
}
// prod: https://viebeg.vieprocure.com/api/v0/
// dev: http://api.viebeg.4-com.pro/api/v0/
SECOND_URL = "";
export const API_BASE_URL = BASE_URL;
export const API_SECOND_URL = SECOND_URL;
//Corona2020!
//nekhesaharriet@gmail.com
