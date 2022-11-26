import {DisplayActions2e} from './apps/displayActions';
import {EmitData} from './types';

export function handleShowToAll(data: EmitData) {
  const dialog = new DisplayActions2e(data.state);
  dialog.render(true, {id: `DisplayActions2e${data.user}`});
}

export function handleShowToSelection(data: EmitData) {
  if (data.userList?.includes(String((game as Game).userId))) {
    const dialog = new DisplayActions2e(data.state);
    dialog.render(true, {id: `DisplayActions2e${data.user}`});
  }
}
