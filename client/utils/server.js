export function serverRequest(values, address, method, token) {
  return fetch(address, {
    method: method,
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(values)
  }).then(response => Promise.all([response, response.json()]));
}