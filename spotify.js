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

/*

// Chained Promises
myFunction().then((data) => {
    return myOtherFunction(data)
}).then((response) => {
    return myThirdFunction(data)
}).then((whatever) => {
    console.log(whatever)
}).then((response) => {
    return myThirdFunction(data)
}).then((whatever) => {
    console.log(whatever)
})

myFunction().then(data => {
    return myOtherFunction.then(() => {
        return myThirdFunction().then(() => {
            return myOtherFunction.then(() => {
                
                return myThirdFunction().then(() => {
                    console.log(whatefver)
                })
            })
        })
    })
})

*/

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
    return getFromApi(`artists/${id}/related-artists`, query);
  }).then(response => {
    artist.related = response.artists;
    let allArtistID = [];
    for (let i=0; i<artist.related.length; i++){
      let artistID = artist.related[i].id;
      allArtistID.push(getFromApi(`artists/${artistID}/top-tracks?country=US`, query));
    }
    return Promise.all(allArtistID);
  }).then(responses => {
    for (let i=0; i<responses.length; i++){
      artist.related[i].tracks = responses[i].tracks;
    }
    return artist;
  });
};
      
/*.catch (err => {
    console.error(err);*/
//   });
// };

  
  
  
  
  
  
  


