let newsList = [];
const menus = document.querySelectorAll('.menus button');
let inputWrap = document.getElementById("searchInput--Wrap");

menus.forEach(menu => menu.addEventListener("click",(event) => getNewByCategory(event)))

let url = new URL(`https://joyful-starship-12eca1.netlify.app/top-headlines?`)
let totalResults = 0
let page = 1
let totalPages = 1
let pageSize = 10 // 1개 페이지에 몇개씩 보여줄지


const getNews = async() => {
    try{
        url.searchParams.set("page", page); // &page=page
        url.searchParams.set("pageSize", pageSize) //&pageSize=pageSize

        const response = await fetch(url); 
    
        console.log(response);
        const data = await response.json();
        console.log(data);
        if(response.status === 200){
            if(data.totalResults === 0){
                page = 0;
                totalResults = 0;
                paginationRender();
                throw new Error("No result for this search")
            }
            newsList = data.articles;
            totalPages = Math.ceil(data.totalResults / pageSize);
            render();
            paginationRender();
        } else{
            // page = 0;
            // totalResults = 0;
            paginationRender();
            // throw new Error(data.message)
        }
    } catch(error){
        // page = 0;
        // totalResults = 0;
        paginationRender();
        // errorRender(error.message);
    }
}
const getLatesNews = async () => {
    page = 1;
    url = new URL(`https://joyful-starship-12eca1.netlify.app/top-headlines?`);
    getNews();
}
 
const getNewByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
    page = 1;
    url = new URL(`https://joyful-starship-12eca1.netlify.app/top-headlines?category=${category}`);
    getNews();
}

const openSearchBox = () => {

    if (inputWrap.style.display === "flex") {
        inputWrap.style.display = "none";
    } else {
        inputWrap.style.display = "flex";
    }
  };

const getNewsByKeyword = async () => {
    page = 1;
    const keyword = document.getElementById('search-input').value;
    url = new URL(`https://joyful-starship-12eca1.netlify.app/top-headlines?q=${keyword}`);
    getNews();
    inputWrap.style.display = "none";
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

const errorRender = (errorMessage) => {
    const errorHTML = `
    <div class="alert alert-danger" role="alert">
        ${errorMessage}
     </div> `;
     document.getElementById('news-board').innerHTML = errorHTML
 }

 const paginationRender = () => {
    let paginationHTML = ``;

    const pageGroup = Math.ceil(page/5);
    const lastPage = pageGroup * 5;

    if(lastPage > totalPages){
        lastPage = totalPages;
    }

    //firstPage
    const firstPage = lastPage - 4 <= 0 ? 1 : lastPage - 4; 



    if (firstPage >= 6) {
        paginationHTML = `<li class="page-item" onclick="moveToPage(1)"><a class="page-link" href="#">&lt&lt</a></li>
        <li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link" href="#">&lt</a></li>`;
    }
    for(let i=firstPage; i<=lastPage; i++){
        paginationHTML += `<li class="page-item ${i===page? "active" : ""}" onclick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>`
    }
    if (lastPage < totalPages)
    paginationHTML+=`<li class="page-item" onclick="moveToPage(${page+1})"><a class="page-link" href="#">&gt</a></li>
    <li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link" href="#">&gt&gt</a></li>`;
    document.querySelector('.pagination').innerHTML = paginationHTML
    
};

const moveToPage = (pageNum) => {
    page = pageNum;
    window.scrollTo({ top: 0, behavior: "smooth" });
    getNews();
};

getLatesNews();

const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
  };
  
const closeNav = () => {
document.getElementById("mySidenav").style.width = "0";
};

