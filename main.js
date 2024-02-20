let newsList = [];

const getLatesNews = async () => {
    const url = new URL(
        `https://joyful-starship-12eca1.netlify.app/top-headlines` 
    );
    const response = await fetch(url.href);
    const data = await response.json();
    newsList = data.articles;
    render();
    console.log('dd', newsList);
}

const render = () => {
    const newsHTML = newsList.map(
        (news) => ` 
        <div class="row news">
            <div class="col-lg-4">
                <img class="news-img-size" src=${news.urlToImage}>
            </div>
            <div class="col-lg-8">
                <h2>${news.title}</h2>
                <p>
                   ${news.description}
                </p>
                <div>
                    ${news.source.name} ${news.publishedAt}
                </div>
            </div>
        </div>
    `);
    document.getElementById('news-board').innerHTML = newsHTML
}
getLatesNews();