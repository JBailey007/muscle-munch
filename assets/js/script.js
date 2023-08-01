function getRecipe() {
  fetch("https://api.spoonacular.com/recipes/complexSearch?apiKey=1234c2cbbf8d49a9a999b19ab6a6581f&query=chicken")
    .then(function (response) {               
      return response.json();
    })
    .then(function (data) {  
      console.log(data);
    });
}

function getRecipeInfo(recipeId) {
  fetch("https://api.spoonacular.com/recipes/"+recipeId+"/information?apiKey=1234c2cbbf8d49a9a999b19ab6a6581f&query=chicken")
    .then(function (response) {               
      return response.json();
    })
    .then(function (data) {  
      console.log(data);
    });
}

function getChuckJoke() {
  fetch("https://api.chucknorris.io/jokes/random?category=food")
  .then(function (response) {               
    return response.json();
  })
  .then(function (data) {  
    console.log(data);
  });
}
