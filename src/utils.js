import { DisplayActions2e } from './displayActions.js';
import { condtionModifierTable, moduleId } from './constants.js';

export function handleShowToAll(data) {
  const app = checkAndBuildApp(data);
  app.render(true, { id: `DisplayActions2e${data.user}`, focus: false });
}

export function handleShowToSelection(data) {
  if (data.userList?.includes(game.userId)) {
    const app = checkAndBuildApp(data);
    app.render(true, { id: `DisplayActions2e${data.user}`, focus: false });
  }
}

export function handleShowWithPermission(data) {
  handleShowToSelection(data);
}

export function handleUpdate(data) {
  // Not an actor-specific update, so ignore it
  if (!data.state.actorUuid) return;

  // There might be more than one, so don't use checkForApp
  const module = game.modules.get(moduleId);
  for (const app of module.displayActions2e.filter(app => app.getState().actorUuid === data.state.actorUuid)) {

    // On a simple update, don't modify the sentFromUserId field
    data.state.sentFromUserId = app.state.sentFromUserId;

    app.setState(data.state);
    app.render(true, { focus: false });
  }
}

export function handleToken(data) {
  const app = checkAndBuildApp(data);
  app.render(true, { id: `DisplayActions2e${data.user}`, focus: false });
}

export function handleDuplication(data) {
  const newState = foundry.utils.deepClone(data.state);

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

  const app = new DisplayActions2e(newState);
  app.render(true, { id: `DisplayActions2e${data.user}${newState.duplicationNr}`, focus: false });
  // push into list to wait for updates
  game.modules.get(moduleId).displayActions2e.push(app);
}

export function handleSendToChat(data) {
  const app = checkForApp(data);
  if (app?.rendered) {
    // find the actions html, then wrap it to create "outerHtml"
    const msg = app.element.find('.window-content').find('.flexbox-actions').wrapAll('<div>').parent();
    ChatMessage.create({
      content: msg.html(),
    });
  }
}

/**
 * helper function to check if the wanted app already exists in the module
 * @param data data from emit
 * @returns either found DisplayActions2e or undefined
 */
function checkForApp(data, ignoreUser = false) {
  const module = game.modules.get(moduleId);

  const app = module.displayActions2e.find(app => {
    const appState = app.getState();
    return (ignoreUser || appState.sentFromUserId === data.state.sentFromUserId) &&
      appState.duplicationNr.almostEqual(data.state.duplicationNr) &&
      appState.actorUuid === data.state.actorUuid;
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
  const module = game.modules.get(moduleId);
  const app = checkForApp(data);
  if (app) {
    return app;
  }
  // push into list to wait for updates
  const newApp = new DisplayActions2e(data.state);
  module.displayActions2e.push(newApp);
  return newApp;
}

export function actionsFromConditions(conditions) {
  let numOfActions = 3;
  let numOfReactions = 1;

  const stun = conditions.get('stunned');
  // stunned overwrites slow thus it must be handled first
  if (stun) {
    numOfActions = stun[0].value * condtionModifierTable['stunned'];
  } else {
    conditions.active.forEach(condition => {
      const slug = condition.system.slug;
      if (condtionModifierTable[slug]) {
        const valMod = condition.system.value.isValued ? condition.value : 1;
        numOfActions += condtionModifierTable[slug] * valMod;
      }
    });
  }

  return [numOfActions, numOfReactions];
}
