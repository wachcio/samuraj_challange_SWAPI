/**
 * Get all people form the Starwars API
 */

function getAllStarwarsPeople() {
    let people = [];
    axios.defaults.baseURL = 'https://swapi.dev/api/people/';
    // first page
    return axios('/')
        .then((response) => {
            // collect people from first page
            people = response.data.results;
            return response.data.count;
        })
        .then((count) => {
            // exclude the first request
            const numberOfPagesLeft = Math.ceil((count - 1) / 10);
            let promises = [];
            // start at 2 as you already queried the first page
            for (let i = 2; i <= numberOfPagesLeft; i++) {
                promises.push(axios(`?page=${i}`));
            }
            return Promise.all(promises);
        })
        .then((response) => {
            //get the rest records - pages 2 through n.
            people = response.reduce(
                (acc, data) => [...acc, ...data.data.results],
                people
            );
            return people;
        })
        .catch((error) => console.log('Properly handle your exception here'));
}

const createTable = () => {
    let app = document.querySelector('#app');
    app.innerHTML = `
    <table class="table">
            <thead class="table_head">
                <tr class="table_head__tr">
                    <th class="table_head_th">Name</th>
                    <th class="table_head_th">Eye Color</th>
                    <th class="table_head_th">Gender</th>
                    <th class="table_head_th">Hair Color</th>
                    <th class="table_head_th">Height</th>
                    <th class="table_head_th">Mass</th>
                </tr>
            </thead>
            <tbody class="table_body">
                <tr class="table_body__tr">
                </tr>
            </tbody>
        </table>
    `;
    // console.log(app);
};

const sortTable = (table) => {
    return table.sort();
};

const addRowsToTable = (rows) => {
    let tbody = document.querySelector('.table_body');
    let lastLetter = 'a';
    let currentLetter = '';

    rows.map((e) => {
        currentLetter = e.name[0];

        if (currentLetter == lastLetter) {
            tbody.innerHTML += `
        <tr class="table_body__tr">
        <td class="table_head_tb">${e.name}</td>
        <td class="table_head_tb">${e.eye_color}</td>
        <td class="table_head_tb">${e.gender}</td>
        <td class="table_head_tb">${e.hair_color}</td>
        <td class="table_head_tb">${e.height}</td>
        <td class="table_head_tb">${e.mass}</td>
        </tr>
        `;
        } else {
            tbody.innerHTML += `
        <tr class="table_body__tr">
        <td class="table_head_tb">${currentLetter}</td>
        </tr>
        `;
            tbody.innerHTML += `
        <tr class="table_body__tr">
        <td class="table_head_tb">${e.name}</td>
        <td class="table_head_tb">${e.eye_color}</td>
        <td class="table_head_tb">${e.gender}</td>
        <td class="table_head_tb">${e.hair_color}</td>
        <td class="table_head_tb">${e.height}</td>
        <td class="table_head_tb">${e.mass}</td>
        </tr>
        `;
        }
        lastLetter = currentLetter;
    });
};

(async () => {
    const starwarsPeople = await getAllStarwarsPeople();
    createTable();

    addRowsToTable(
        _.sortBy(starwarsPeople, [
            function (o) {
                return o.name;
            },
        ])
    );
    console.log('starwarsPeople', starwarsPeople);
})();
