// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import '../styles/module.css';
import {moduleId, socketEvent} from './constants';
import {EmitData, MyModule} from './types';
import './socket';
import {handleShowToAll, handleShowToSelection, handleShowWithPermission, handleUpdate} from './socket';
import {DisplayActions2e} from './apps/displayActions';

let module: MyModule;
let homeDisplayActions: DisplayActions2e;

// Foundry Hooks
Hooks.once('init', () => {
  console.log(`Initializing ${moduleId}`);
});

Hooks.on('getSceneControlButtons', (hudButtons: SceneControl[]) => {
  let hud = hudButtons.find((value: any) => {
    return value.name === 'token';
  });

  let tool: SceneControlTool = {
    name: 'DisplayActions2e.ButtonName',
    title: 'DisplayActions2e.ButtonHint',
    icon: 'fa fa-angle-double-right',
    button: true,
    visible: true,
    onClick: async () => {
      homeDisplayActions.render(true);
      game.socket?.emit('module.DisplayActions2e', {event: 'DisplayActions2e'});
    },
  };

  hud?.tools?.push(tool);
});

Hooks.on('ready', () => {
  module = game.modules.get(moduleId) as unknown as MyModule;
  homeDisplayActions = new DisplayActions2e();

  module.displayActions2e = [homeDisplayActions];
  // sockets
  game.socket?.on(socketEvent, (data: EmitData) => {
    // all my events
    switch (data.operation) {
      case 'showToAll':
        handleShowToAll(data);
        break;
      case 'showToSelection':
        handleShowToSelection(data);
        break;
      case 'showWithPermission':
        handleShowWithPermission(data);
        break;
      case 'update':
        handleUpdate(data);
        break;
      default:
        console.log(data);
        break;
    }
  });
});
