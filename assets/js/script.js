console.log(localStorage.getItem('plan'));
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
  var plan = localStorage.getItem('plan');
}
var dateEle = $('.date');
var appId = '41cf6aea';
var appKey = 'fab451270b4aaf6ddf1f9605a905ea73';
var selectedMealType = $('#meal-type').find(":selected").val();

//Tab Click Events
$('.tabSearch').on('click', function(event) {
  $(this).addClass('is-active');
  $('.tabCalendar').removeClass('is-active');
  $('.tabSd').removeClass('is-active');
  $('.section-calendar').addClass('hidden');
  $('.sectionSd').addClass('hidden');
  $('.sectionSearch').removeClass('hidden');
});

$('.tabSd').on('click', function(event) {
  $(this).addClass('is-active');
  $('.tabCalendar').removeClass('is-active');
  $('.tabSearch').removeClass('is-active');
  $('.section-calendar').addClass('hidden');
  $('.sectionSearch').addClass('hidden');
  $('.sectionSd').removeClass('hidden');
});

$('.tabCalendar').on('click', function(event) {
  $(this).addClass('is-active');
  $('.tabSearch').removeClass('is-active');
  $('.tabSd').removeClass('is-active');
  $('.sectionSearch').addClass('hidden');
  $('.sectionSd').addClass('hidden');
  $('.section-calendar').removeClass('hidden');
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
      recipeData.hits.forEach(function(value,key) {      
        card = $('<div class="card column m-2" data-ing="'+JSON.stringify(value.recipe.ingredientLines)+'>');        
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
                    <div class="has-text-centered"> \
                      <button class="button is-link is-light">Add to Meal Plan</button> \
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
  });
});

//Create the calendar
for(var i=0;i<dateEle.length;i++) {
  $(dateEle[i]).html(dayjs().weekday(i).format('ddd MMM D'));
}

//Fill in the meal plan
for(var i=0;i<plan.length;i++) {

}

// fill in the joke
getChuckJoke();

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