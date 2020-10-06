import { elements } from "./base";

export const getInput = ()=> elements.searchField.value;

export const clearSearchFields = ()=>{
     elements.searchField.value = '';
}

export const clearResults = ()=>{
    elements.searchList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
}


export const highlightSelected = id =>{

    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
}

export const limitRecipeTitle = (title, limit=17) =>{
        
       const newArr = [];
       if(title.length > limit){
          
        title.split(' ').reduce((acc,cur)=>{
              if(acc+cur.length <= limit){
                newArr.push(cur);
              }
              return acc+cur.length;
        },0)
        return `${newArr.join(' ')}...`;
       }
       return title;
     
}

const renderRecipe = (recipe) =>{
    const markup = `
               <li>
                   <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">T${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
                   `;
    elements.searchList.insertAdjacentHTML('beforeend',markup);
               
}

const createButton = (page,type)=>
     `
      <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page+1}>
         <svg class="search__icon">
             <use href="img/icons.svg#icon-triangle-${type ==='prev'? 'left': 'right'}"></use>
         </svg>
         <span>Page ${type === 'prev' ? page-1 : page+1 }</span>
      </button>
      `;




const renderButtons = (page,numOfResults,restPerPage)=>{
     const pages = Math.ceil(numOfResults/restPerPage);
     let button;

     if(page ===1 && pages>1){
         //Next Button
         button= createButton(page,'next')
     }else if (page < pages){
         // Both Buttons
        button = `${createButton(page,'prev')}
                  ${createButton(page,'next')}
                 `;

     } else if(page===pages && pages>1) {
          // Prev Button
          button = createButton(page,'prev');
     }
     
     if(pages>1)
     elements.searchResultPages.insertAdjacentHTML('afterbegin',button);

}


export const renderResults = (recipes,page=1,restPerPage=10) =>{
    // render results for current pages

    const start = (page-1)*restPerPage;
    const end  = page*restPerPage;
    recipes.slice(start,end).forEach(renderRecipe);

    // render results for pagination
    renderButtons(page,recipes.length,restPerPage);
}