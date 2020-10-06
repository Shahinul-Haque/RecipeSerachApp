import axios from "axios";

export default class Search {
     constructor(query){
         this.query = query;
     }

     async getResuls (){
        const proxy = 'https://cors-anywhere.herokuapp.com/';
         
        try{
            const res = await axios(`${proxy}https://recipesapi.herokuapp.com/api/search?q=${this.query}`)
            this.results = res.data.recipes;
            //console.log(this.results);
    
        }catch(error){
           alert(error);
        }
    
    }

}
