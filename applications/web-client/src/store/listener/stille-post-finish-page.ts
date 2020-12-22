import { finishPage } from '../../app/games/stille-post/stille-post-api';
import { stillePostFinishPage } from '../actions/stille-post';
import { ApplicationState } from '../index';

export function stillePostFinishPageListener(
  state: ApplicationState,
  action,
  previousState: ApplicationState
) {
  if (action.type !== stillePostFinishPage.type) {
    return;
  }
  finishPage(action.payload, previousState.stillePost.currentPage.bookId);
}
