import { moduleId, socketEvent } from './constants.js';
import { handleShowToAll, handleShowToSelection, handleShowWithPermission, handleUpdate } from './utils.js';
import { DisplayActions2e } from './displayActions.js';
import { settingSetup } from './settings.js';

let homeDisplayActions;

// Foundry Hooks
Hooks.once('init', () => {
  console.log(`Initializing ${moduleId}`);
});

Hooks.on('getSceneControlButtons', (hudButtons) => {
  const hud = hudButtons.find((value) => {
    return value.name === 'token';
  });

  const tool = {
    name: 'DisplayActions2e.ButtonName',
    title: 'DisplayActions2e.ButtonHint',
    icon: 'pf2-icon icon-action',
    button: true,
    visible: true,
    onClick: async () => {
      homeDisplayActions.render(true, { focus: false });
      game.socket?.emit('module.DisplayActions2e', { event: 'DisplayActions2e' });
    },
  };

  hud?.tools?.push(tool);
});

Hooks.on('ready', () => {
  const module = game.modules.get(moduleId);
  settingSetup();
  homeDisplayActions = new DisplayActions2e();

  module.displayActions2e = [homeDisplayActions];
  // sockets
  game.socket?.on(socketEvent, (data) => {
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
