let currentStocks = [];
let allStocks = [];

const runQuery = function (event) {

  event.preventDefault();

  // Here we grab the text from the input box
  // The trim() method removes any leading or trailing spaces around our input
  const stock = $('#stock-input').val().trim().toUpperCase();
  const stockExists = search(stock, allStocks);
  console.log(stockExists);

  if (stockExists === undefined) {
    alert("This stock does not exist. Please enter a valid stock symbol.")
  } else {
    if (currentStocks.indexOf(stock) === -1) {
      currentStocks.push(stock);
      createStockButton(stock);
      console.log(currentStocks);
    }

    renderStockData(stock);
  }
}

const pullAllStocks = function () {
  const queryURL = `https://api.iextrading.com/1.0/ref-data/symbols`;

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function (response) {
    allStocks = response;
    console.log(response);
  });
}

function search(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].symbol === nameKey) {
      return myArray[i];
    }
  }
}

// creates button for stock
const createStockButton = function (stockSymbol) {
  $(`#stockButtons`).append(`<button type="button" class="btn-primary" onclick="renderStockData('${stockSymbol}');">${stockSymbol.toUpperCase()}</button>`);
}


// renders stock info for specified stock
const renderStockData = function (stock) {
  const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news,logo&range=1m&last=10`;
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function (response) {

    resultsArray(response);
  });
}


const resultsArray = function (response) {
  let resultArray = [];
  resultArray.push({
    companyName: response.quote.companyName,
    logo: response.logo.url,
    price: response.quote.latestPrice,
    news: response.news
  })
  console.log(resultArray);
  render(resultArray);
}



const render = function (resultArray) {
  $("#resultsSection").empty();

  let newsText = '<h4>Recent News:</h4>';
  for (let i = 0; i < resultArray[0].news.length; i++) {
    var date = new Date(resultArray[0].news[i].datetime);
    newsText = newsText + `
      <h5>${resultArray[0].news[i].headline}</h5>
      <h6>${(date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()}</h6>
      <p class="card-text">${resultArray[0].news[i].summary}</p>
      <a href="${resultArray[0].news[i].url}" class="btn btn-primary">Go to Article</a></br></br>`
  }

  $('#resultsSection').append(`
  <div class="card" style="width: 95%">
  <div class="card-body">
      <h3 class="card-title">${resultArray[0].companyName}</h3>
      <img id="image" src="${resultArray[0].logo}" atl="logo"/>
      <p class="card-text">Latest Price: $${resultArray[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
      ${newsText}
  </div>
  </div>`);

  // for (let i = 0; i < resultArray.news.length; i++) {
  //   var date = new Date(resultArray[i].news.Date);
  //   $('#resultsSection').append(`
  //         <div class="card" style="width: 50%">
  //         <div class="card-body">
  //             <h5 class="card-title">${resultArray[i].Headline}</h5>
  //             <p class="card-text">${(date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()}</p>
  //             <p class="card-text">${resultArray[i].Snippet}</p>
  //             <a href="${resultArray[i].URL}" class="btn btn-primary">Go to Article</a>
  //         </div>
  //         </div>`);
  // }
}

pullAllStocks();
$('#find-stock').on('click', runQuery);

