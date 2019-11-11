const continentSelect = document.querySelector("#continent-select");
const countryList = document.querySelector("#countries-list");

queryFetch(`
query {
  continents {
    name
    code
  }
}
`).then(res => {
  console.log(res.data.continents);
  res.data.continents.forEach(continent => {
    const option = document.createElement("option");
    option.value = continent.code;
    option.innerText = continent.name;
    continentSelect.append(option);
  });
});

continentSelect.addEventListener("change", async e => {
  console.log(e.target.value);
  let countries = await getContinentCountries(e.target.value);
  countryList.innerHTML = "";
  countries.forEach(country => {
    const element = document.createElement("li");
    element.innerText = country.name;
    countryList.append(element);
  });
});

function getContinentCountries(continentCode) {
  return queryFetch(
    `
  query getCountries($code: String) {
    continent(code: $code) {
      countries {
        name
      }
    }
  }  
  `,
    { code: continentCode }
  ).then(res => res.data.continent.countries);
}

function queryFetch(query, variables) {
  return fetch("https://countries.trevorblades.com/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  }).then(res => res.json());
}
