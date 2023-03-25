import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeViews from './views/recipeViews.js';
import searchViews from './views/searchViews.js';
import resultsViews from './views/resultsViews.js';
import paginationViews from './views/paginationViews.js';
import bookmarksViews from './views/bookmarksViews.js';
import addRecipeViews from './views/addRecipeViews.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

if (module.hot) {
  module.hot.accept();
}
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeViews.renderSpinner();

    // 0 update results view to mark secelted search result
    resultsViews.update(model.getSearchResultsPage());
    bookmarksViews.update(model.state.bookmarks);

    // 1 loading recipe
    await model.loadRecipe(id);

    // 2 rendering recipe
    recipeViews.render(model.state.recipe);
  } catch (err) {
    recipeViews.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsViews.renderSpinner();
    // 1 get search query
    const query = searchViews.getQuery();
    if (!query) return;

    // 2 load search results
    await model.loadSearchResults(query);

    // 3 render results
    // resultsViews.render(model.state.search.results);
    resultsViews.render(model.getSearchResultsPage());

    // 4 render initial pagination buttons
    paginationViews.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const contorlPagination = function (goToPage) {
  // 1 render NEW results

  resultsViews.render(model.getSearchResultsPage(goToPage));

  // 2 render NEW pagination buttons
  paginationViews.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings ( in state)
  model.updateServings(newServings);

  // update the recipe view
  // recipeViews.render(model.state.recipe);
  recipeViews.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add/ remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //update recipe view
  recipeViews.update(model.state.recipe);

  // render bookmarks
  bookmarksViews.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksViews.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeViews.renderSpinner();

    // upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // render recipe
    recipeViews.render(model.state.recipe);

    //success message
    addRecipeViews.renderMessage();

    // render bookmark view
    bookmarksViews.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeViews.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('**', err);
    addRecipeViews.renderError(err.message);
  }
};

const init = function () {
  bookmarksViews.addhandlerRender(controlBookmarks);
  recipeViews.addHandlerRender(controlRecipes);
  recipeViews.addHandlerUpdateServings(controlServings);
  recipeViews.addHandlerAddBookmark(controlAddBookmark);
  searchViews.addHandlerSearch(controlSearchResults);
  paginationViews.addHandlerClick(contorlPagination);
  addRecipeViews.addHandlerUpload(controlAddRecipe);
};
init();
