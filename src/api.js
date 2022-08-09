/*
    OMdb API: https://www.omdbapi.com/

*/
const key = require('./config.json')

// Function to generate URL
function generateURL(data) {
    // Format of URL: http://www.omdbapi.com/?apikey=[key]&t=movie+title&y=yyyy&plot=full
    let URL;
    try {
        if (typeof(data) != "object") {
            throw new Error(`Couldn't retreive data!`)
        }
        // To run this project on your own, create a config.json file outside of the src director, and generate an api key from the OMdb website, add it to the config.json file as follows
        /*{
            "key" : [your_api_key]
           }*/
        if (data.title_ID.startsWith("tt")) { // Generate URL with ID
            return `https://www.omdbapi.com/?apikey=${config.key}&i=${data.title_ID}&plot=full`;
        } else { // Generate URL with title
            return `https://www.omdbapi.com/?apikey=${config.key}&t=${data.title_ID}&y=${data.year}&plot=full`
        }
    } catch (err) {
        console.log(err);
    }

}

// Getting data from the form

const submit = document.getElementById("sub-btn").addEventListener("click", (val) => {
    let URL;
    val.preventDefault();
    const title = document.getElementById("titleID").value;
    const year = document.getElementById("year").value;
    const inp_type = document.getElementById("type").value;

    const slate = document.getElementById("output");
    slate.innerHTML = null;
    try {
        if (title === "") { // Title is empty
            throw new Error('Please enter a title/ID!');
        }

        if (inp_type === "title") {
            if (title.startsWith("tt")) {
                throw new Error(`Please switch to ID!`);
            }
        } else {
            if (!title.startsWith("tt")) {
                throw new Error(`ID must start with tt!`);
            } else if (!parseInt(title.substring(2))) {
                throw new Error('Please enter valid ID!')
            }
        }

        let date = new Date().getFullYear();
        if (inp_type === "title") { // Year is needed only for Title
            if (year === "") { // Year is empty
                throw new Error('Please enter the year of release!');
            } else if (!parseInt(year)) { // If year is NAN
                throw new Error('Please enter valid year!');
            }
            if (parseInt(year) < 1920 || parseInt(year) > date + 3) { // Start and End Date
                throw new Error(`Year should be from 1920 to ${date+3}!`);
            }
        }

    } catch (err) {
        alert(err);
    }

    document.getElementById('output').scrollIntoView()

    // Input is correct -> generate URL to get data
    let formatTitle = title.replaceAll(" ", "+");
    const data = {
        "title_ID": formatTitle,
        "year": year,
        "inp_type": inp_type
    };
    URL = generateURL(data);
    fetch(URL)
        .then(response => response.json())
        .then((movieData) => {
            if (movieData.Response === "False") {
                alert(`${movieData.Error}`);
            } else {

                const outer = document.getElementById("output");
                const bre = document.createElement("br");

                // Title
                const mName = document.createElement("h1");
                mName.setAttribute("id", "movie-title");
                mName.innerText = `${movieData.Title}`
                outer.appendChild(mName);

                // Image
                const poster = document.createElement("img");
                poster.setAttribute("src", `${movieData.Poster}`);
                poster.setAttribute("id", "movie-poster-img");
                outer.appendChild(poster);
                outer.appendChild(bre);

                // Plot
                const plot = document.createElement("p");
                plot.innerHTML = `${movieData.Plot}`
                plot.setAttribute("id", "movie-plot");
                outer.appendChild(bre);
                outer.appendChild(plot);

                // Meta Data
                const metaData = document.createElement("div");
                metaData.setAttribute("id", "movie-meta-data");
                const metaID = ["Rated", "Released", "Runtime", "Genre", "Language", "Country",
                    "imdbID", "DVD", "BoxOffice"
                ];
                metaID.forEach(element => {
                    const metaDeets = document.createElement("p");
                    metaDeets.setAttribute("id", "movie-plot");
                    metaDeets.style.textAlign = "center";
                    metaDeets.innerHTML = `${element}  :  ${movieData[element]}`;
                    metaData.appendChild(metaDeets);
                });
                outer.appendChild(bre);
                outer.appendChild(metaData);



                // Credits & awards
                const credData = document.createElement("div");
                credData.setAttribute("id", "movie-meta-data");
                const credID = ["Director", "Writer", "Actors", "Awards"];
                credID.forEach(element => {
                    const credDeets = document.createElement("p");
                    credDeets.setAttribute("id", "movie-plot");
                    credDeets.style.textAlign = "center";
                    credDeets.innerHTML = `${element} : ${movieData[element]}`;
                    credData.appendChild(credDeets);
                });
                outer.appendChild(bre);
                outer.appendChild(credData);


                // Ratings
                const rateData = document.createElement("div");
                rateData.setAttribute("id", "movie-meta-data");
                (movieData.Ratings).forEach(element => {
                    const rating = document.createElement("p");
                    rating.setAttribute("id", "movie-plot");
                    rating.style.textAlign = "center";
                    var rateString = ``;
                    var flag = true;
                    for (let key in element) {
                        if (flag) {
                            rateString += `${element[key]}:`
                        } else {
                            rateString += `${element[key]}`
                        }

                    }
                    rating.innerHTML = rateString;
                    rateData.appendChild(rating);
                })
                outer.appendChild(rateData);


            }
        });

});
