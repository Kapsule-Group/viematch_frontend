let BASE_URL, SECOND_URL;

if(window.location.host === 'localhost:3000') {
    BASE_URL = 'https://api.viebeg.co.uk/api/v0';
} else {
    BASE_URL = 'https://api.viebeg.co.uk/api/v0';
}

SECOND_URL = '';
export const API_BASE_URL = BASE_URL;
export const API_SECOND_URL = SECOND_URL;
