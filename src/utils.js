import {DisplayActions2e} from './displayActions.js';
import {condtionModifierTable, moduleId} from './constants.js';

export function handleShowToAll(data) {
  const dialog = checkAndBuildApp(data);
  dialog.render(true, {id: `DisplayActions2e${data.user}`});
}

export function handleShowToSelection(data) {
  if (data.userList?.includes(String(game.userId))) {
    const dialog = checkAndBuildApp(data);
    dialog.render(true, {id: `DisplayActions2e${data.user}`});
  }
}

export function handleShowWithPermission(data) {
  handleShowToSelection(data);
}

export function handleUpdate(data) {
  let module = game.modules.get(moduleId);
  let nameInTitle = game.users?.find((user) => {
    return user.id === data.state.sentFromUserId;
  })?.name;

  if (nameInTitle) {
    module.displayActions2e.forEach(app => {
      // check for title OR own application update
      // this is why checkForApp cannot be used
      if (app.title.includes(nameInTitle) || data.state.sentFromUserId === game.userId) {
        app.setState(data.state);
        app.render(false, {id: `DisplayActions2e${data.user}`});
      }
    });
  }
}

export function handleToken(data) {
  const dialog = checkAndBuildApp(data);
  dialog.render(true, {id: `DisplayActions2e${data.user}`});
}

export function handleDuplication(data) {
  let newState = foundry.utils.deepClone(data.state);

  do {
    newState.duplicationNr += 1;
  } while (
    checkForApp({
      operation: data.operation,
      user: data.user,
      state: newState,
      userList: data.userList,
    })
  );

  const dialog = new DisplayActions2e(newState);
  const module = game.modules.get(moduleId);
  dialog.render(true, {id: `DisplayActions2e${data.user}${newState.duplicationNr}`});
  // push into list to wait for updates
  module.displayActions2e.push(dialog);
}

export function handleSendToChat(data) {
  let app = checkForApp(data);
  if (app) {
    if (app.rendered) {
      // find the actions html, then wrap it to create "outerHtml"
      let msg = app.element.find('.window-content').find('.flexbox-actions').wrapAll('<div>').parent();
      ChatMessage.create({
        content: msg.html(),
      });
    }
  }
}

/**
 * helper function to check if the wanted app already exists in the module
 * @param data data from emit
 * @returns either found DisplayActions2e or undefined
 */
function checkForApp(data) {
  let module = game.modules.get(moduleId);

  let app = module.displayActions2e.find(app => {
    let appState = app.getState();
    let control = appState.sentFromUserId === data.state.sentFromUserId;
    control = control && appState.duplicationNr.almostEqual(data.state.duplicationNr);
    control = control && appState.tokenId === data.state.tokenId;
    control = control && appState.isLinkedToToken === data.state.isLinkedToToken;

    return control;
  });

  return app;
}

/**
 * helper function to return the application from the modules or build a new one
 * immediatly pushes a new app into the list of modules
 * @param data data from emit
 * @returns either found DisplayActions2e or new DisplayActions2e with state
 */
function checkAndBuildApp(data) {
  let module = game.modules.get(moduleId);
  let newApp = new DisplayActions2e(data.state);
  let app = checkForApp(data);
  if (app) {
    return app;
  }
  // push into list to wait for updates
  module.displayActions2e.push(newApp);
  return newApp;
}

export function actionsFromConditions(conditions) {
  let numOfActions = 3;
  let numOfReactions = 1;

  let stun = conditions.get('stunned');
  // stunned overwrites slow thus it must be handled first
  if (stun) {
    numOfActions = stun[0].value * condtionModifierTable['stunned'];
  } else {
    conditions.active.forEach(condition => {
      let slug = condition.system.slug;
      if (condtionModifierTable[slug]) {
        let valMod = condition.system.value.isValued ? condition.value : 1;
        numOfActions += condtionModifierTable[slug] * valMod;
      }
    });
  }

  return [numOfActions, numOfReactions];
}
