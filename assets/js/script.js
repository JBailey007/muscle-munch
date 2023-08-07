if (localStorage.getItem('plan') === null) {
  var plan = [{
    breakfast:null,
    lunch:null,
    dinner:null
  },
  {
    breakfast:null,
    lunch:null,
    dinner:null
  },
  {
    breakfast:null,
    lunch:null,
    dinner:null
  },
  {
    breakfast:null,
    lunch:null,
    dinner:null
  },
  {
    breakfast:null,
    lunch:null,
    dinner:null
  },
  {
    breakfast:null,
    lunch:null,
    dinner:null
  },
  {
    breakfast:null,
    lunch:null,
    dinner:null
  },
  {
    breakfast:null,
    lunch:null,
    dinner:null
  },
  {
    breakfast:null,
    lunch:null,
    dinner:null
  },
  {
    breakfast:null,
    lunch:null,
    dinner:null
  },
  {
    breakfast:null,
    lunch:null,
    dinner:null
  },
  {
    breakfast:null,
    lunch:null,
    dinner:null
  },
  {
    breakfast:null,
    lunch:null,
    dinner:null
  },
  {
    breakfast:null,
    lunch:null,
    dinner:null
  },
  ];
} else {
  var plan = JSON.parse(localStorage.getItem('plan'));
}
var dateEle = $('.date');
var appId = '41cf6aea';
var appKey = 'fab451270b4aaf6ddf1f9605a905ea73';
var selectedMealType = $('#meal-type').find(":selected").val();
//setting the week start in the local storage. 
if (localStorage.getItem('weekStart') === null) {
  localStorage.setItem('weekStart', dayjs().weekday(0).format('MM/DD/YYYY'));
}

//Tab Click Events
$('.tab-search').on('click', function(event) {
  $(this).addClass('is-active');
  $('.tab-calendar').removeClass('is-active');
  $('.tab-sd').removeClass('is-active');
  $('.section-calendar').addClass('hidden');
  $('.section-sd').addClass('hidden');
  $('.section-search').removeClass('hidden');
  $('.cnsa').removeClass('hidden');
  $('#results').removeClass('hidden');

});

$('.tab-sd').on('click', function(event) {
  $(this).addClass('is-active');
  $('.tab-calendar').removeClass('is-active');
  $('.tab-search').removeClass('is-active');
  $('.section-calendar').addClass('hidden');
  $('.section-search').addClass('hidden');
  $('.section-sd').removeClass('hidden');
  $('.cnsa').addClass('hidden');
  $('#results').addClass('hidden');
});

$('.tab-calendar').on('click', function(event) {
  $(this).addClass('is-active');
  $('.tab-search').removeClass('is-active');
  $('.tab-sd').removeClass('is-active');
  $('.section-search').addClass('hidden');
  $('.section-sd').addClass('hidden');
  $('.section-calendar').removeClass('hidden');
  $('.cnsa').addClass('hidden');
  $('#results').addClass('hidden');
});
document.addEventListener('DOMContentLoaded', () => {

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Add a click event on each of them
  $navbarBurgers.forEach( el => {
    el.addEventListener('click', () => {

      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');

    });
  });

});


//Search Event Listener
$('#run-search').on('click', function(event) {
  event.preventDefault();
  var card;
  var cardContainer = $('<div class="columns">');
  var url = "https://api.edamam.com/api/recipes/v2?type=public&app_id="+appId+"&app_key="+appKey+"&random=true&imageSize=SMALL&q="+$('#search-text').val()+"&mealType="+$('#meal-type').val();
  $('#results').html('');
  fetch(url)
    .then(function (response) {               
      return response.json();
    })
    .then(function (data) { 
      return data;
    }).then( function(recipeData) {
      var daySelect = getDaysSelect();
      var mealSelect = getMealSelect();
      selectedMealType = $('#meal-type').find(":selected").val();
      console.log(recipeData); 
      localStorage.setItem('searchResults', JSON.stringify(recipeData));
      recipeData.hits.forEach(function(value,key) {      
        card = $('<div class="card column m-2">');
        card.html('<div class="card-image"> \
                    <figure class="image is-4by3"> \
                      <img src="'+value.recipe.image+'" alt="Placeholder image"> \
                    </figure> \
                  </div> \
                  <div class="card-content"> \
                    <div class="media"> \
                      <div class="media-content"> \
                        <p class="title is-4">'+value.recipe.label+'</p> \
                        </div> \
                    </div> \
                    <div class="content"> \
                    Servings: '+value.recipe.yield+'<br/>\
                    Calories: '+Math.round(value.recipe.calories/value.recipe.yield)+'<br/>\
                    Carbs: '+Math.round(value.recipe.digest[1].total/value.recipe.yield)+value.recipe.digest[0].unit+'<br/>\
                    Protein: '+Math.round(value.recipe.digest[2].total/value.recipe.yield)+value.recipe.digest[0].unit+'<br/>\
                    Fat: '+Math.round(value.recipe.digest[0].total/value.recipe.yield)+value.recipe.digest[0].unit+'<br/>\
                    '+daySelect.outerHTML+'\
                    '+mealSelect.outerHTML+'\
                    <input type="hidden" id="key" name="key" value="'+key+'"> \
                    <div class="has-text-centered"> \
                      <button class="button is-link is-light add-meal">Add to Meal Plan</button> \
                    </div> \
                    </div> \
                  </div>');  
                  
          $(cardContainer)[0].append(card[0]);
          if((key+1) % 5 === 0) {
            $('#results')[0].append(cardContainer[0]);
            cardContainer = $('<div class="columns">');
          }
        });
        //remove any days already planned or that are in the past
        removeDaySelectOptions(selectedMealType);
        //add a change event listener to update the days select when the meal is changed
        $('.select.meals').on('change', function() {
          $(this).parents('.field').prev().find('select').html(daySelect.outerHTML);
          removeDaySelectOption(this.value, this);
        })
        $('.add-meal').on('click', function(event) {
          event.preventDefault();
          var selectedMeal =  $(this).parent().prev().prev().find('select').find(":selected").val();
          var selectedDate = $(this).parent().prev().prev().prev().find('select').find(":selected").val();
          var itemName = $(this).parent().parent().siblings('.media').find('p').html();
          var itemKey = $(this).parents('.card').find('#key').val();
          var recipeData = JSON.parse(localStorage.getItem('searchResults'));
          var itemPic = recipeData.hits[itemKey].recipe.image;
          var itemURL = recipeData.hits[itemKey].recipe.url;
          var itemIng = recipeData.hits[itemKey].recipe.ingredientLines;
          var itemIngItems = recipeData.hits[itemKey].recipe.ingredients;
          var liEle = [];

          switch (selectedMeal) {
            case 'breakfast':
              plan[selectedDate].breakfast = {label:itemName, ingredients:itemIng, img:itemPic, url:itemURL}
              document.querySelectorAll('.breakfast')[selectedDate].innerHTML = '<a target="_blank" href="'+itemURL+'">'+ itemName +'</a><i class="fa-solid fa-trash"></i>';
              break;
            case 'lunch':
              plan[selectedDate].lunch = {label:itemName, ingredients:itemIng, img:itemPic, url:itemURL};
              document.querySelectorAll('.lunch')[selectedDate].innerHTML = '<a target="_blank" href="'+itemURL+'">'+ itemName +'</a><i class="fa-solid fa-trash"></i>';
              break;
            case 'dinner':
              plan[selectedDate].dinner = {label:itemName, ingredients:itemIng, img:itemPic, url:itemURL};
              document.querySelectorAll('.dinner')[selectedDate].innerHTML = '<a target="_blank" href="'+itemURL+'">'+ itemName +'</a><i class="fa-solid fa-trash"></i>';
              break;               
          }
          itemIngItems.forEach(function(value) {
            var listItem = document.createElement('li');
            var currentListItems = document.querySelectorAll('#shopping-list li');
            var itemCheck = false;
            
            currentListItems.forEach(function(listValue, listkey) {
              if (listValue.textContent.toLowerCase() === value.food.toLowerCase()) {
                itemCheck = true;
              }
            });
            
            if (itemCheck === false) {              
              listItem.textContent = value.food;
              document.querySelector('#shopping-list').appendChild(listItem); 
            }

          });
          currentListItems = document.querySelectorAll('#shopping-list li');
          currentListItems.forEach(function(value) {
            liEle.push(value.innerHTML);
          });

          localStorage.setItem('plan', JSON.stringify(plan));
          localStorage.setItem('shoppingList', JSON.stringify(liEle));
          
        });

  });
});

//Create the calendar
for(var i=0;i<dateEle.length;i++) {
  $(dateEle[i]).html(dayjs().weekday(i).format('ddd MMM D'));
}

//Set the current week food schedule
setWeek();

//Fill in the Meal Plan
setCalendarInit();

// fill in the joke
getChuckJoke();

//set the shopping list
setShoppingList();

//Function to get the Chuck Joke
function getChuckJoke() {
  fetch("https://api.chucknorris.io/jokes/random?category=food")
  .then(function (response) {               
    return response.json();
  })
  .then(function (data) {  
    $(".title").html(data.value);
  });
}

//Function to create the days select element
function getDaysSelect() {
  var optionEle = '';
  var selectEle = document.createElement('select');
  var fieldEle = document.createElement('div');
  var controlEle = document.createElement('div');
  var labelEle = document.createElement('label');
  selectEle.setAttribute("class", "select days");
  fieldEle.setAttribute("class", "field mt-1");
  controlEle.setAttribute("class", "control");
  labelEle.setAttribute("class", "label");
  labelEle.textContent = 'Add To Meal Plan On: ';
  for(var i=0;i<=13;i++) {

    optionEle += '<option value="'+i+'">'+dayjs().weekday(i).format('ddd MMM D')+'</option>';
  }
  selectEle.innerHTML = optionEle;
  controlEle.appendChild(selectEle);
  fieldEle.appendChild(labelEle);  
  fieldEle.appendChild(controlEle);

  return fieldEle;
}

//Function to create the neal select element
function getMealSelect() {
  var optionEle = '';
  var selectEle = document.createElement('select');
  var fieldEle = document.createElement('div');
  var controlEle = document.createElement('div');
  var labelEle = document.createElement('label');
  var breakfastSelected = "";
  var lunchSelected = "";
  var dinnerSelected = "";
  //Select the meal that was searched for
  switch (selectedMealType) {
    case 'breakfast':
      breakfastSelected = 'selected';
      break;
    case 'lunch':
      lunchSelected = 'selected';
      break;
    case 'dinner':
      dinnerSelected = 'selected';
      break;
  }

  selectEle.setAttribute("class", "select meals");
  fieldEle.setAttribute("class", "field mt-1");
  controlEle.setAttribute("class", "control");
  labelEle.setAttribute("class", "label");
  labelEle.textContent = 'Meal: ';
  optionEle += '<option value="breakfast" '+breakfastSelected+'>Breakfast</option>\
  <option value="lunch" '+lunchSelected+'>Lunch</option>\
  <option value="dinner" '+dinnerSelected+'>Dinner</option>';
  selectEle.innerHTML = optionEle;
  controlEle.appendChild(selectEle);
  fieldEle.appendChild(labelEle);  
  fieldEle.appendChild(controlEle);

  return fieldEle;
}

//Function to remove ALL day options that are in the past or already have a meal planned
function removeDaySelectOptions(selectedMealType) {
  for (var i=0;i<plan.length;i++) {
    //remove if day is in the past
    if(dayjs().weekday(i) < dayjs()) {
      $("option[value='"+i+"']").remove();
    //remove if already a meal has been planned
    } else if(selectedMealType === 'breakfast') {
      if(plan[i].breakfast !== null) {
        $("option[value='"+i+"']").remove();
      }
    } else if (selectedMealType === 'lunch') {
      if(plan[i].lunch !== null) {
        $("option[value='"+i+"']").remove();
      }
    } else {
      if(plan[i].dinner !== null) {
        $("option[value='"+i+"']").remove();
      }
    }
    
  }
}

//Function to remove day options for a single element that are in the past or already have a meal planned
function removeDaySelectOption(selectedMealType, mealSelect) {
  var daySelect = $(mealSelect).parents('.field').prev().find('select');

  for (var i=0;i<plan.length;i++) {
    //remove if day is in the past
    if(dayjs().weekday(i) < dayjs()) {
      $(daySelect[0]).find("option[value='"+i+"']").remove();
    //remove if already a meal has been planned
    } else if(selectedMealType === 'breakfast') {
      if(plan[i].breakfast !== null) {
        $(daySelect[0]).find("option[value='"+i+"']").remove();
      }
    } else if (selectedMealType === 'lunch') {
      if(plan[i].lunch !== null) {
        $(daySelect[0]).find("option[value='"+i+"']").remove();
      }
    } else {
      if(plan[i].dinner !== null) {
        $(daySelect[0]).find("option[value='"+i+"']").remove();
      }
    }    
  }
}
// function to set the calendar items with a link to the recipe
function setCalendarInit() {
  plan.forEach(function(value, key) {
    if (value.breakfast !== null) {
      document.querySelectorAll('.breakfast')[key].innerHTML = '<a target="_blank" href="'+value.breakfast.url+'">'+ value.breakfast.label +'</a><i class="fa-solid fa-trash"></i>';
    } 
    if (value.lunch !== null) {
      document.querySelectorAll('.lunch')[key].innerHTML = '<a target="_blank" href="'+value.lunch.url+'">'+ value.lunch.label +'</a><i class="fa-solid fa-trash"></i>';
    } 
    if (value.dinner !== null) {
      document.querySelectorAll('.dinner')[key].innerHTML = '<a target="_blank" href="'+value.dinner.url+'">'+ value.dinner.label +'</a><i class="fa-solid fa-trash"></i>';             
    }
  });
  $('.fa-trash').on('click', function(event) {
    var meal = $(this).parent().attr('class');
    var day = $(this).parents('.column').data('day');
    switch (meal) {
      case 'breakfast':
        plan[day].breakfast = null;
        break;
      case 'lunch':
        plan[day].lunch = null;
        break;
      case 'dinner':
        plan[day].dinner = null;
        break;
    }
    localStorage.setItem('plan',JSON.stringify(plan));
    $(this).parent().html('');
    
  });
};
//function to set the week start so that it will go off of the day you are on
function setWeek() {
  if(localStorage.getItem('weekStart') !== dayjs().weekday(0).format('MM/DD/YYYY')) {
    for (var i=0;i>=6;i++) {
      plan[i].breakfast = plan[i+7].breakfast;
      plan[i].lunch = plan[i+7].lunch;
      plan[i].dinner = plan[i+7].dinner;
    }
    for (var i=7;i>=13;i++) {
      plan[i].breakfast = null;
      plan[i].lunch = null;
      plan[i].dinner = null;
    }
    localStorage.setItem('plan',JSON.stringify(plan));
  }
}
// function to set the shopping list items
function setShoppingList() {  
  var ulEle = document.querySelector('#shopping-list');
  var shoppingList = JSON.parse(localStorage.getItem('shoppingList'));
  if(shoppingList !== null) {
    shoppingList.forEach(function(value, key) {
      var liEle = document.createElement('li');
      liEle.textContent = value;
      ulEle.appendChild(liEle);
    });
  }

}