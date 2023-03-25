import View from './views.js';
import icons from 'url:../../img/icons.svg';
import previewViews from './previewViews.js';

class ResultsViews extends View {
  _perentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again';
  _message = '';

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkup() {
    return this._data
      .map(result => previewViews.render(result, false))
      .join('');
  }
}

export default new ResultsViews();

// <div class="preview__user-generated">
//                   <svg>
//                     <use href=${icons}#icon-user"></use>
//                   </svg>
//                 </div>
