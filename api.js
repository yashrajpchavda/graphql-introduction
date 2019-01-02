const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/';

module.exports = {
    fetchData: (resource) => {
        return fetch(`${API_URL}${resource}`)
            .then(res => res.json());
    },

    postData: (resource, body) => {
        return fetch(`${API_URL}${resource}`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json());
    },

    deleteData: (resource) => {
        return fetch(`${API_URL}${resource}`, {
            method: 'delete'
        }).then(res => res.json());
    }
}