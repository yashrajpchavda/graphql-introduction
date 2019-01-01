const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/';

module.exports = {
    fetchData: (resource) => {
        return fetch(`${API_URL}${resource}`)
            .then(res => res.json());
    }
}