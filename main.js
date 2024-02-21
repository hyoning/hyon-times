let newsList = [];
const menus = document.querySelectorAll('.menus button');
let inputWrap = document.getElementById("searchInput--Wrap");

menus.forEach(menu => menu.addEventListener("click",(event) => getNewByCategory(event)))

let url = new URL(`https://joyful-starship-12eca1.netlify.app/top-headlines?`)
let totalResults = 0
let page = 1
let pageSize = 10 // 1개 페이지에 몇개씩 보여줄지
let groupSize = 5 //페이지 넘버를 몇개씩 보여줄지


const getNews = async() => {
    try{
        url.searchParams.set("page", page); // &page=page
        url.searchParams.set("pageSize", pageSize) //&pageSize=pageSize

        const response = await fetch(url); 
    
        console.log(response);
        const data = await response.json();
        console.log(data);
        if(response.status === 200){
            if(data.articles.length === 0){
                throw new Error("No result for this search")
            }
            newsList = data.articles;
            totalResults = data.totalResults;
            render();
            paginationRender();
        } else{
            throw new Error(data.message)
        }
    } catch(error){
        errorRender(error.message)
    }
}
const getLatesNews = async () => {
    page = 1;
    url = new URL(`https://joyful-starship-12eca1.netlify.app/top-headlines?`);
    getNews();
}
 
const getNewByCategory = async (event) => {
    page = 1;
    const category = event.target.textContent.toLowerCase();
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
    //totalResult
    //page
    //pageSize
    //groupSize
    //totalPages
    const totalPages = Math.ceil(totalResults / pageSize);
    //pageGroup
    const pageGroup = Math.ceil(page/groupSize);
    //lastPage

    const lastPage = pageGroup * groupSize;

    if(lastPage > totalPages){
        lastPage = totalPages;
    }

    //firstPage
    const firstPage = 
        lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1); 



    let paginationHTML = `<li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link" href="#">Previous</a></li>`;
    for(let i=firstPage; i<=lastPage; i++){
        paginationHTML += `<li class="page-item ${i===page? "active" : ""}" onclick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>`
    }
    paginationHTML+=`<li class="page-item" onclick="moveToPage(${page+1})"><a class="page-link" href="#">Next</a></li>`;
    document.querySelector('.pagination').innerHTML = paginationHTML
    
};

const moveToPage = (pageNum) => {
    page = pageNum;
    getNews();
};

getLatesNews();

const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
  };
  
const closeNav = () => {
document.getElementById("mySidenav").style.width = "0";
};

