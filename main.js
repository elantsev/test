const result = document.getElementById("result");
let resultData = `
<div>
  <p> </p>
  <p>AUD</p>
  <p>USD</p>
  <p>NOK</p>
</div>`;

function addToResult(source, EURAUD, EURUSD, EURNOK) {
  resultData += `
      <div>
      <p>${source}</p>
      <p>${EURAUD}</p>
      <p>${EURUSD}</p>
      <p>${EURNOK}</p>
      </div>`;
  result.innerHTML = resultData;
}

function baseToEUR(USDAUD, USDEUR, USDNOK) {
  let EURAUD = (USDAUD / USDEUR).toFixed(2);
  let EURUSD = (1 / USDEUR).toFixed(2);
  let EURNOK = (USDNOK * USDEUR).toFixed(2);
  return { EURAUD, EURUSD, EURNOK };
}

fetch(
  "http://apilayer.net/api/live?access_key=c252f5f007e91fd07637e86c7e4cf324"
)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    const { USDAUD, USDEUR, USDNOK } = data.quotes;

    let { EURAUD, EURUSD, EURNOK } = baseToEUR(USDAUD, USDEUR, USDNOK);
    addToResult("apilayer.net", EURAUD, EURUSD, EURNOK);
  });

fetch(
  "https://openexchangerates.org/api/latest.json?app_id=e0562836e26b45d0bc184ccaa779cf5c"
)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    const { AUD, EUR, NOK } = data.rates;
    let { EURAUD, EURUSD, EURNOK } = baseToEUR(AUD, EUR, NOK);
    addToResult("openexchangerates.org", EURAUD, EURUSD, EURNOK);
  });

fetch("http://www.floatrates.com/daily/usd.xml")
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    let USDAUD, USDEUR, USDNOK;
    let items = data.querySelectorAll("item");
    for (let i = 0; i < items.length; i++) {
      if (items[i].querySelector("targetCurrency").innerHTML == "AUD") {
        USDAUD = items[i].querySelector("exchangeRate").innerHTML;
      }
      if (items[i].querySelector("targetCurrency").innerHTML == "EUR") {
        USDEUR = items[i].querySelector("exchangeRate").innerHTML;
      }
      if (items[i].querySelector("targetCurrency").innerHTML == "NOK") {
        USDNOK = items[i].querySelector("exchangeRate").innerHTML;
      }
    }

    let { EURAUD, EURUSD, EURNOK } = baseToEUR(USDAUD, USDEUR, USDNOK);
    addToResult("floatrates.com", EURAUD, EURUSD, EURNOK);
  });
