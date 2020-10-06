import Search from "./models/Search";
import { elements,renderLoader,clearLoader } from "./views/base";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Like from "./models/Like";

const state = {};

/**
 * Globabl Search CONTROLER
 * 
 */

const controlSearch = async ()=>{
    //1. Get query from View
    const query = searchView.getInput();

    if(query){

         //2. New Search object and add it to state
         state.search = new Search(query);

         //3. Prepare UI for results
          searchView.clearSearchFields();
          searchView.clearResults();
          renderLoader(elements.searchResult);
 

        try{

        //4. search for recipies
        await state.search.getResuls();

        //5. Render results on UI
        clearLoader();
        searchView.renderResults(state.search.results);

        } catch(error){
            console.log('Error Search Processing!');
            clearLoader();
        }
       
    }


}


elements.searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    controlSearch();

})


elements.searchResultPages.addEventListener('click',(e)=>{
     const btn = e.target.closest('.btn-inline');
     if(btn){
         const gotoPage = parseInt(btn.dataset.goto,10);
         searchView.clearResults();
         searchView.renderResults(state.search.results,gotoPage);
     }
})

/**
 * Recipe  CONTROLER
 * 
 */

 const controlRecipe = async ()=>{
     //Get ID from URL
     const id = window.location.hash.replace('#','');
       
     if(id){

        // Prepare UI for Changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
       // Hightlight selected search item
       if(state.search) searchView.highlightSelected(id);

       //Create new recipe object
       state.recipe = new Recipe(id);

       try{
       //Get Recipe Data and parseIngredients
        await state.recipe.getRecipe();
       // console.log(state.recipe.ingredients)
        state.recipe.parseIngredients();
  
       // Calculate servings and time
       state.recipe.calcTime();
       state.recipe.calcServings();
  
       // Render recpie
       clearLoader();
       recipeView.renderRecpie(
            state.recipe,
            state.likes.isLiked(id)
         );
       //console.log(state.recipe);

       } catch(error){
           alert('Error processing recipe!');
           //console.log(error);
       }
      
     }
     
 }

 ['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));

/*
 List Controller
*/
const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
       
    });
  
}


/*
 Lieks Controller
*/


const controlLike = ()=>{
    if(!state.likes) state.likes = new Like();
    const currentID = state.recipe.id;

    //If User not yer liked it
    if(!state.likes.isLiked(currentID)){
        // Add like to state
        const newLike = state.likes.addLike(
                currentID,
                state.recipe.title,
                state.recipe.author,
                state.recipe.img
            );
        //Toggle the like button
        likesView.toggleLikedButton(true);

        // Add like to the UI list
        likesView.renderLike(newLike);
        
    } else{
         //Remove like to state
          state.likes.deleteLike(currentID);
        //Toggle the like button
          likesView.toggleLikedButton(false);
        // Remove like to the UI list
          likesView.deleteLike(currentID);
         
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());

}

// Restore likes recipe on page load
window.addEventListener('load', ()=>{
     state.likes = new Like();

     //Restore like
     state.likes.readStorage();

     //Toggle like menu button
     likesView.toggleLikeMenu(state.likes.getNumLikes());

     //Render the existing likes
     state.likes.likes.forEach(like => likesView.renderLike(like));
})


//Handle delete and update list item
elements.shopping.addEventListener('click',e =>{
     const id = e.target.closest('.shopping__item').dataset.itemid;

     if(e.target.matches('.shopping__delete, .shopping__delete *')){
         //Delete from State
         state.list.deleteItem(id);
         //Delete from ListView
        listView.deleteItem(id);
     } else if (e.target.matches('.shopping__count-value')){
            const val = parseInt(e.target.value);
            state.list.updateCount(id,val);
     }
    
})


elements.recipe.addEventListener('click', e=> {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //decrease button is clicked
        if(state.recipe.servings>1){
            state.recipe.updateServings('dec');
           recipeView.updateServingsIngredients(state.recipe)
        }
       
    }else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
    //console.log(state.recipe);
});

//window.l = new List();
