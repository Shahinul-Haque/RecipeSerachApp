import axios from "axios";

export default class Recipe {

    constructor(id){
        this.id=id;
    }

    async getRecipe(){
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        try{

            const res = await axios (`${proxy}https://recipesapi.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img =  res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        }catch(error){
          console.log(error);
          alert('Something went wrong here !');
        }
    }

    calcTime (){
        // Assuming we need 15 mints for each 3 ingredients
        const numIng = this.ingredients.length;
        const period = Math.ceil(numIng/3);
        this.time = period*15;

    }

    parseIngredients(){
       const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
       const unitShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
       const units = [...unitShort,'kg','g'];

       const newIngredients = this.ingredients.map((el)=>{
            let ingredient = el.toLowerCase();

            unitsLong.forEach((unit,i)=>{
                ingredient = ingredient.replace(unit,unitShort[i]);
            });

            //Remove parentheses

            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3. Parse Ingredients into count,unit and ingredient
           
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex((el2) => units.includes(el2));
            let objIng;

            if(unitIndex > -1){
                // There is a count
                const arrCount= arrIng.slice(0,unitIndex);

                let count;

                if(arrCount.length ===1){
                   count = eval(arrIng[0].replace('-','+'));
                }else{
                   count = eval(arrIng.slice(0,unitIndex).join('+'));

                }

                objIng={
                    count,
                    unit:arrIng[unitIndex],
                    ingredient:arrIng.slice(unitIndex+1).join(' ')
                };
            } else if (parseInt(arrIng[0],10)){
                // There is NO Unit but 1st element is Number in 1st position
                objIng = {
                    count:1,
                    unit:'',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if( unitIndex === -1){
                // There is No Unit and No Number in 1st position
                objIng ={
                    count:1,
                    unit:'',
                    ingredient
                }
            }


            return objIng;
       });

       this.ingredients = newIngredients;
    }

    calcServings (){
        this.servings = 4;
    }


    updateServings(type){
        //Servings
        const newServings = type === 'dec' ? this.servings-1 : this.servings+1;
        //ingredients
        this.ingredients.forEach(ing=> {
            ing.count *= (newServings/this.servings)
        });
           
        this.servings = newServings;
    }
}