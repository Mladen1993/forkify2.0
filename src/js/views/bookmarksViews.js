import View from './views.js';
import icons from 'url:../../img/icons.svg';
import previewViews from './previewViews.js';

class bookmarksView extends View {
  _perentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. find a nice recipe and bookmark it';
  _message = '';

  addhandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(result => previewViews.render(result, false))
      .join('');
  }
}

export default new bookmarksView();
