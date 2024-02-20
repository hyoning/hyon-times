let newsList = [];
const menus = document.querySelectorAll('.menus button');

menus.forEach(menu => menu.addEventListener("click",(event) => getNewByCategory(event)))

const getLatesNews = async () => {
    const url = new URL(`https://joyful-starship-12eca1.netlify.app/top-headlines?`);
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
}
 
const getNewByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
    const url = new URL(`https://joyful-starship-12eca1.netlify.app/top-headlines?category=${category}`);
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
}

const getNewsByKeyword = async () => {
    const keyword = document.getElementById('search-input').value;
    const url = new URL(`https://joyful-starship-12eca1.netlify.app/top-headlines?q=${keyword}`);
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
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
    `).join('');
    document.getElementById('news-board').innerHTML = newsHTML
}
getLatesNews();


