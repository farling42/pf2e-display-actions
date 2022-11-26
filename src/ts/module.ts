// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import '../styles/module.css';
import {DisplayActions2e} from './apps/displayActions';
import {moduleId, socketEvent} from './constants';
import {EmitData, MyModule} from './types';
import './socket';
import {handleShowToAll, handleSocketlib} from './socket';

let module: MyModule;
let socket: any;

// Foundry Hooks
Hooks.once('init', () => {
  console.log(`Initializing ${moduleId}`);
});

Hooks.on('getSceneControlButtons', hudButtons => {
  let hud = hudButtons.find(value => {
    return value.name === 'token';
  });

  hud?.tools.push({
    name: 'DisplayActions2e.ButtonName',
    title: 'DisplayActions2e.ButtonHint',
    icon: 'fa fa-angle-double-right',
    button: true,
    onClick: async () => {
      module.displayActions2e.render(true);
      (game as Game).socket?.emit('module.DisplayActions2e', {event: 'DisplayActions2e'});
    },
  });
});

Hooks.once('socketlib.ready', () => {
  // 👇️ ts-ignore ignores any ts errors on the next line
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  socket = socketlib.registerModule(moduleId);
});

Hooks.on('ready', () => {
  module = (game as Game).modules.get(moduleId) as MyModule;
  module.displayActions2e = new DisplayActions2e();

  module.displayActions2e.setSocketlib(socket);
  socket.register('showToAll', handleSocketlib);

  // sockets
  (game as Game).socket?.on(socketEvent, (data: EmitData) => {
    // all my events
    switch (data.operation) {
      case 'showToAll':
        handleShowToAll(data);
        break;
      default:
        console.log(data);
        break;
    }
  });
});
