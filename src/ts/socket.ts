import {moduleId} from './constants';
import {EmitData, MyModule} from './types';

export function handleShowToAll(data: EmitData) {
  console.log(data);
}

export function handleSocketlib() {
  const module = (game as Game).modules.get(moduleId) as MyModule;
  module.displayActions2e.render(true);
}
