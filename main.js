let newsList = [];
let menus = document.querySelectorAll('.menus button');
let sideMenus = document.querySelectorAll('.side-menu-list button');

let underLine = document.querySelector('.menus_line');
let inputWrap = document.getElementById('searchInput--Wrap');
let searchInput = document.getElementById('search-input')

menus.forEach(menu => menu.addEventListener("click",(event) => getNewByCategory(event)))
sideMenus.forEach(sideMenus => sideMenus.addEventListener("click",(event) => getNewBySideCategory(event)))
searchInput.addEventListener("keyup",(event) => getNewEnterKeyword(event))

let url = new URL(`https://joyful-starship-12eca1.netlify.app/top-headlines?`)
let page = 1;
let totalPage = 1;
let pageSize = 10;// 1개 페이지에 몇개씩 보여줄지
let groupSize = 5;

const getNews = async() => {
    try{
        url.searchParams.set("page", page); // &page=page
        url.searchParams.set("pageSize", pageSize) //&pageSize=pageSize

        const response = await fetch(url); 
        const data = await response.json();
        
        if(response.status === 200){
            if(data.totalResults === 0){
                page = 0;
                totalPage = 0;
                paginationRender();
                throw new Error("No result for this search")
            }
            newsList = data.articles;
            totalPage = Math.ceil(data.totalResults / pageSize);
            render();
            paginationRender();
        } else{
            page = 0;
            totalPage = 0;
            paginationRender();
            throw new Error(data.message)
        }
    } catch(error){
        page = 0;
        totalPage = 0;
        paginationRender();
        errorRender(error.message);
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

    underLine.style.left = event.currentTarget.offsetLeft + "px";
    underLine.style.width = event.currentTarget.offsetWidth + "px";

    getNews();
}
const getNewBySideCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
    page = 1;
    url = new URL(`https://joyful-starship-12eca1.netlify.app/top-headlines?category=${category}`);
    getNews();
    closeNav();
}

const openSearchBox = () => {

    if (inputWrap.style.display === "flex") {
        inputWrap.style.display = "none";x
    } else {
        inputWrap.style.display = "flex";
    }
};
const closeSearch = () => {
    inputWrap.style.display = "none";
}
const getNewsByKeyword = async () => {
    page = 1;
    const keyword = document.getElementById('search-input').value;
    url = new URL(`https://joyful-starship-12eca1.netlify.app/top-headlines?q=${keyword}`);
    getNews();
    inputWrap.style.display = "none";
}
const getNewEnterKeyword = async (event) => {
    if(event.key === 'Enter'){
        event.preventDefault();
        if(searchInput.value.trim() !== "") {
            page = 1;
            const keyword = searchInput.value;
            url = new URL(`https://joyful-starship-12eca1.netlify.app/top-headlines?q=${keyword}`);
            getNews();
        }
        searchInput.value = '';
        closeSearch();
    }
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
    let pageGroup = Math.ceil(page / groupSize);
    let lastPage = pageGroup * groupSize;

    // console.log(lastPage);
    // console.log(totalPage);
    if(lastPage > totalPage){
        lastPage = totalPage;
    }

    //firstPage
    let firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1); 

    if (firstPage >= 6) {
        paginationHTML = `<li class="page-item" onclick="moveToPage(1)"><a class="page-link">&lt&lt</a></li>
        <li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link">&lt</a></li>`;
    }
    for(let i=firstPage; i<=lastPage; i++){
        paginationHTML += `<li class="page-item ${i===page? "active" : ""}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
    }
    if (lastPage < totalPage)
    paginationHTML+=`<li class="page-item" onclick="moveToPage(${page+1})"><a class="page-link">&gt</a></li>
    <li class="page-item" onclick="moveToPage(${totalPage})"><a class="page-link" >&gt&gt</a></li>`;
    document.querySelector('.pagination').innerHTML = paginationHTML
    
};

const moveToPage = (pageNum) => {
    page = pageNum;
    window.scrollTo({ top: 0, behavior: "smooth" });
    getNews();
};

const openNav = () => {
    document.getElementById("mySidenav").style.width = "70%";
  };
  
const closeNav = () => {
document.getElementById("mySidenav").style.width = "0";
};


getLatesNews();
