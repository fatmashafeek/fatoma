"use strict"
//-----------Loading Screen
$(function () {
    $(".loading").fadeOut(600, function () {
      $("body").css("overflow", "auto");
    });
//   ------------------------const---------------------------//
    const sideBar = $(".sideBar");
    const innerBar = $(".innerBar");
    let innerWidth = innerBar.innerWidth();
    sideBar.css("left", -innerWidth);
    const navLinks = $(".navLinks li");
    const dataContainer = $("#mealsData");
    const searchContainer = $("#searchBox");
    const contactContainer = $("#contactBox");
  
    //------------- open && close nav
    function openNav() {
      sideBar.animate({ left: "0 "}, 500);
      $(".open-close i").attr("class", "fa-solid fa-xmark fa-2x");
      for (let i = 0; i < navLinks.length; i++) {
        navLinks.animate({ top: 0 }, 500);
      }
    }
  
    function closeNav() {
      sideBar.animate({ left: -innerWidth}, 500);
      $(".open-close i").attr("class", "fa-solid fa-bars fa-2x");
      navLinks.animate({ top: "300px" }, 500);
    }
  
    $(".open-close").on("click", function () {
      if (sideBar.css("left") == "0px") {
        closeNav();
      } else {
        openNav();
      }
    });
  
  
    let meals = [];
    async function getMeals() {
      let linkAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
      let response = await linkAPI.json();
      meals = response.meals;
      displayMeals();
    }
  
    getMeals();
  
    function displayMeals() {
      let mealsData = ``;
      for (let i = 0; i < meals.length; i++) {
        let hemo = meals[i].idMeal;
        mealsData += `
        <div class="col-md-3 ">
                      <div class="item ">
                          <img src="${meals[i].strMealThumb}" loading="lazy" class="w-100" alt="${meals[i].strMeal}">
                          <div class="layer">
                          <h3 class="text-black" data="${meals[i].idMeal}">${meals[i].strMeal}</h3>
                          </div>
                      </div>
                  </div>`;
      }
      dataContainer.html(`${mealsData}`);
    
  
      $(".item").on("click", function () {
        let item = $(this);
        let hemo = item.find("h3").attr("data");
        getMealById(hemo);
      });
    }
  
    function displayInstructions(meal) {
      $("#mealsData").html("");
      let Ingredients = ``;
      for (let i = 0; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
          Ingredients += `<li class="alert alert-info m-2 p-1">${ meal[`strMeasure${i}`] } ${meal[`strIngredient${i}`]}</li>`;
        }
      }
      let mealTags = [];
      let tags = ``;
      for (let i = 0; i < mealTags.length; i++) {
        tags += `
          <li class=" alert-danger m-2 p-1">${mealTags[i]}</li>`;
      }
  
      let mealInfo = ` 
              <div class="col-lg-4">
                <img src="${meal.strMealThumb}" class="rounded-2 w-100 mb-3" alt=""/>
                <h3>${meal.strMeal}</h3>
              </div>
              <div class="col-lg-8">
                  <h3 class="fw-bold">Instructions</h3>
                  <p>${meal.strInstructions}</p>
                  <h3><span class="fw-bold">Area: </span>${meal.strArea}</h3>
                  <h3><span class="fw-bold">Category: </span>${meal.strCategory}</h3>
                  <h3><span class="fw-bold">Ingredients:</span></h3>
                  <ul class="d-flex flex-wrap g-3"> ${Ingredients}</ul>
                  <h3><span class="fw-bold">Tags:</span></h3>
                  <ul class="d-flex flex-wrap g-3">${tags}</ul>
                  <a href="${meal.strSource}" class="btn btn-success" target="_blank">Source</a>
                  <a href="${meal.strYoutube}" class="btn btn-danger" target="_blank">Youtube</a>
              </div>`;
  
      dataContainer.html(`${mealInfo}`);
    }
  
    async function getMealsByName(meal) {
      $(".loading").fadeIn(200);
      let linkAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`);
      let response = await linkAPI.json();
      meals = response.meals;
      displayMeals();
      $(".loading").fadeOut(200);
    }
  
    async function getMealsByFirstLetter(letter) {
      $(".loading").fadeIn(200);
      let linkAPI = await fetch( `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
      let response = await linkAPI.json();
      meals = response.meals;
      displayMeals();
      $(".loading").fadeOut(200);
    }
  
    $(navLinks).on('click', function () {
      dataContainer.html("");
      contactContainer.html("");
      closeNav();
      searchMealInputs();
      sideBar.css("z-index", 99999);
    });
  
    function searchMealInputs() {
      let searchInputs = `
        <div class="col-md-6 batoot">
                <input type="text" class="inputByName form-control bg-transparent text-white" placeholder="Search By Name"/>
              </div>
              <div class="col-md-6 batoot">
                <input type="text" class="inputByLetter form-control bg-transparent text-white" placeholder="Search By First Letter"/>
              </div>`;
      searchContainer.html(`${searchInputs}`);
  
      $(".inputByName").on("input", function () {
        let searchInput = $(this).val();
        getMealsByName(searchInput);
      });
      $(".inputByLetter").on("input", function () {
        let searchInputLetter = $(this).val();
        getMealsByFirstLetter(searchInputLetter);
      });
    }
  
    $(navLinks).eq(1).on('click', function () {
      dataContainer.html("");
      searchContainer.html("");
      contactContainer.html("");
      closeNav();
      getCategories();
    });
  //--------------------------------------------section categpries--------------------------------------//
    let categories = [];
    async function getCategories() {
      $(".loading").fadeIn(200);
      let linkAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
      let response = await linkAPI.json();
      categories = response.categories;
      displayCategories();
      $(".loading").fadeOut(200);
    }
  
    function displayCategories() {
      let categoryData = ``;
      for (let i = 0; i < categories.length; i++) {
        let imgSrc = categories[i].strCategoryThumb;
        let category = categories[i].strCategory;
        categoryData += `
        <div class="col-sm-6 col-md-4 col-lg-3">
                      <div class="item">
                          <img src="${imgSrc}" class="w-100" loading="lazy" alt="${category}">
                          <div class="layer d-flex flex-column text-black">
                          <h3 class="text-center text-black">${category}</h3>
                           <p>${categories[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                          </div>
                      </div>
                  </div>`;
      }
      dataContainer.html(`${categoryData}`);
  
      $(".item").on("click", function () {
        let item = $(this);
        let category = item.find("h3").html();
  
        displayMealsByCategory(category);
      });
    }
  
    let filteredMeals = [];
  
    async function displayMealsByCategory(category) {
      $(".loading").fadeIn(200);
      let linkAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      let response = await linkAPI.json();
      filteredMeals = response.meals;
      displayFilteredMeals();
      $(".loading").fadeOut(200);
    }
  
    function displayFilteredMeals() {
      let mealsData = ``;
      for (let i = 0; i < filteredMeals.length; i++) {
        let mealId = filteredMeals[i].idMeal;
        mealsData += `
        <div class="col-md-3">
                      <div class="item">
                          <img src="${filteredMeals[i].strMealThumb}" class="w-100" loading="lazy" alt="${filteredMeals[i].strMeal}">
                          <div class="layer">
                          <h3 data="${mealId}">${filteredMeals[i].strMeal}</h3>
                          </div>
                      </div>
                  </div>`;
      }
      dataContainer.html(`${mealsData}`);
  
      $(".item").on("click", function () {
        let item = $(this);
        let mealId = item.find("h3").attr("data");
        getMealById(mealId);
      });
    }
  
    async function getMealById(mealId) {
      $(".loading").fadeIn(200);
      let linkAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      let response = await linkAPI.json();
      const meal = response.meals[0];
      displayInstructions(meal);
      $(".loading").fadeOut(200);
    }
  
    $(navLinks).eq(2).on("click", function () {
      dataContainer.html("");
      searchContainer.html("");
      contactContainer.html("");
      closeNav();
      getAreas();
    });
   //------------------------------------------section area---------------------------------------------//
    let areas = [];
    async function getAreas() {
      $(".loading").fadeIn(200);
      let linkAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
      let response = await linkAPI.json();
      areas = response.meals;
      displayAreas();
      $(".loading").fadeOut(200);
    }
    function displayAreas() {
      let areaInfo = ``;
      for (let i = 0; i < areas.length; i++) {
        areaInfo += `
          <div class="col-sm-6 col-md-4 col-lg-3 text-center area">
                <i class="fa-solid fa-house fa-4x mb-2"></i>
                <h3>${areas[i].strArea}</h3>
              </div>`;}
  
      dataContainer.html(`${areaInfo}`);
  
      $(".area").on("click", function () {
        let item = $(this);
        let area = item.find("h3").html();
        getMealsByArea(area);
      });
    }
  
    async function getMealsByArea(area) {
      $(".loading").fadeIn(200);
      let linkAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
      let response = await linkAPI.json();
      filteredMeals = response.meals;
      displayFilteredMeals();
      $(".loading").fadeOut(200);
    }
  
    $(navLinks).eq(3).on("click", function () {
      dataContainer.html("");
      searchContainer.html("");
      contactContainer.html("");
      closeNav();
      getIngredients();
    });
  //-----------------------------------section ingredient-------------------------------------//
    let mealIngredients = [];
  
    async function getIngredients() {
      $(".loading").fadeIn(200);
      let linkAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
      let response = await linkAPI.json();
      mealIngredients = response.meals;
      displayingredients();
      $(".loading").fadeOut(200);
    }
  
    function displayingredients() {
      let ingredientsInfo = ``;
      for (let i = 0; i < 20; i++) {
        ingredientsInfo += `
          <div class="col-sm-6 col-md-4 col-lg-3 text-center ingredient">
                <i class="fa-solid fa-bowl-rice fa-4x"></i>
                <h3>${mealIngredients[i].strIngredient}</h3>
                <p>${mealIngredients[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
              </div>
        `;
      }
  
      dataContainer.html(`${ingredientsInfo}`);
  
      $(".ingredient").on("click", function () {
        let item = $(this);
        let ingredient = item.find("h3").html();
  
        getMealsByingredient(ingredient);
      });
    }
  
    async function getMealsByingredient(ingredient) {
      $(".loading").fadeIn(200);
      let linkAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
      let response = await linkAPI.json();
      filteredMeals = response.meals;
      displayFilteredMeals();
      $(".loading").fadeOut(200);
    }
  
    $(navLinks).eq(4).on("click", function () {
      dataContainer.html("");
      searchContainer.html("");
      closeNav();
      getContactInputs();
    });
//  ------------------------------------------- section contact------------------------------//
    function getContactInputs() {
      let contactInputs = `
         <div class="container min-vh-100 d-flex flex-column justify-content-center align-items-center">
                <div class="row g-3">
                  <div class="col-md-6">
                    <input type="text" placeholder="Enter Your Name" class="nameInput form-control  text-white text-black"/>
                  </div>
                  <div class="col-md-6">
                    <input
                      type="email" placeholder="Enter Your Email" class="emailInput form-control bg-white text-black"/>
                  </div>
                  <div class="col-md-6">
                    <input
                      type="text" placeholder="Enter Your Phone" class="phoneInput form-control bg-white text-black" />
                  </div>
                  <div class="col-md-6">
                    <input type="number" placeholder="Enter Your Age" class="ageInput form-control bg-white text-black"/>
                  </div>
                  <div class="col-md-6">
                    <input type="password" placeholder="Enter Your Password"class="passwordInput form-control bg-white text-black"/>
                  </div>
                  <div class="col-md-6">
                    <input type="password" placeholder="Repassword" class="repasswordInput form-control bg-white text-black"/>
                  </div>
                </div>
                 <button disabled="true" id="submitBtn" class="btn btn-outline-danger mt-3 px-4"> Submit</button>
              </div>`;
  
      contactContainer.html(`${contactInputs}`);
  
      //-----------------------------------------vaild-----------------------------------//
  
      const usernameInput = $(".nameInput");
      const emailInput = $(".emailInput");
      const phoneInput = $(".phoneInput");
      const ageInput = $(".ageInput");
      const passwordInput = $(".passwordInput");
      const repasswordInput = $(".repasswordInput");
      const submitBtn = $("#submitBtn");

      usernameInput.on("input", function () {
        if (nameValidation(usernameInput.val())) {
          enableBtn();
        } 
          else {
          submitBtn.attr("disabled", true);
        }
      });
  
      emailInput.on("input", function () {
        if (emailValidation(emailInput.val())) {
          enableBtn();
        }
           else {
          submitBtn.attr("disabled", true);
        }
      });
  
      phoneInput.on("input", function () {
        if (phoneValidation(phoneInput.val())) {
          enableBtn();
        } 
        else {
          submitBtn.attr("disabled", true);
        }
      });
  
      ageInput.on("input", function () {
        if (ageValidation(ageInput.val())) {
          enableBtn();
        } 
        else {
          submitBtn.attr("disabled", true);
        }
      });
  
      passwordInput.on("input", function () {
        if (passwordValidation(passwordInput.val())) {
          enableBtn();
        } 
        else {
          submitBtn.attr("disabled", true);
        }
      });
  
      repasswordInput.on("input", function () {
        if (repasswordValidation(repasswordInput.val())) {
          enableBtn();
        }
         else {
          submitBtn.attr("disabled", true);
        }
      });
  
      function nameValidation(userName) {
        const nameRegex = /^[a-zA-Z ]+$/;
        return nameRegex.test(userName);
      }
  
      function emailValidation(email) {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(email);
      }
  
      function phoneValidation(phone) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone)
      }
  
      function ageValidation(age) {
        const ageRegex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
        return ageRegex.test(age);
      }
  
      function passwordValidation(password) {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
        return passwordRegex.test(password);
      }
  
      function repasswordValidation(repassword) {
        return repassword == passwordInput.val();
      }
  
      function enableBtn() {
      }
    }
  });