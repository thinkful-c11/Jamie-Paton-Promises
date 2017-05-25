'use strict';

const getFromApi = function(endpoint, query={}) {
  const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
  Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
  return fetch(url).then(function(response) {
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    return response.json();
  });
};


let artist = null;
const getArtist = function(name) {
  const query = {
    q: name,
    limit: 1,
    type: 'artist'
  };
  return getFromApi('search', query).then(response => {
    artist = response.artists.items[0];
    const id = artist.id;
    return getFromApi(`artists/${id}/related-artists`, query).then(response => {
      artist.related = response.artists;
      return artist;
    });
  }).catch (err => {
    console.error(err);
  });
};

  
  
  
  
  
  
  


