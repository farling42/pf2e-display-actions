import {DisplayActions2e} from './apps/displayActions';
import {EmitData} from './types';

export function handleShowToAll(data: EmitData) {
  const dialog = new DisplayActions2e(data.state);
  dialog.render(true);
}
