var city = 'stockholm';
var apiKey = 'API-KEY';
var url = 'https://api.api-ninjas.com/v1/worldtime?city=' + city;

fetch(url, {
    method: 'GET',
    headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }
    return response.json();
})
.then(data => {
    document.getElementById('timeDisplay').innerHTML = `Today is ${data.day_of_week} ${data.date}.` +
    "<br>" + `The time is ${data.hour}:${data.minute}:${data.second}`; // Update the placeholder with the data
})
.catch(error => {
    document.getElementById('timeDisplay').innerHTML = 'Failed to fetch time data'; // Display error message if fetch fails
    console.error('Error:', error);
});