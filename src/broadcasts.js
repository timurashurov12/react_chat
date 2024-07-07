import Echo from 'laravel-echo';

import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    authEndpoint: 'http://localhost/broadcasting/auth',
    broadcaster: 'pusher',
    key: 'a8ef5544cd4cef58820a',
    cluster: 'us3',
    forceTLS: true,
    auth: {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token')
        }
    }
});

