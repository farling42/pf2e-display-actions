import {ActorPF2e} from '../../types/src/module/actor';
import {ConditionPF2e} from '../../types/src/module/item';
import {TokenDocumentPF2e} from '../../types/src/module/token-document';
import {DisplayActions2e} from './apps/displayActions';
import {condtionModifierTable, moduleId} from './constants';
import {EmitData, MyModule} from './types';

export function handleShowToAll(data: EmitData) {
  const dialog = checkForApp(data);
  dialog.render(true, {id: `DisplayActions2e${data.user}`} as RenderOptions);
}

export function handleShowToSelection(data: EmitData) {
  if (data.userList?.includes(String(game.userId))) {
    const dialog = checkForApp(data);
    dialog.render(true, {id: `DisplayActions2e${data.user}`} as RenderOptions);
  }
}

export function handleShowWithPermission(data: EmitData) {
  handleShowToSelection(data);
}

export function handleUpdate(data: EmitData) {
  let module = game.modules.get(moduleId) as unknown as MyModule;
  let nameInTitle = game.users?.find(user => {
    return user.data._id === data.state.sentFromUserId;
  })?.data.name;

  if (nameInTitle) {
    module.displayActions2e.forEach(app => {
      // check for title OR own application update
      // this is why checkForApp cannot be used
      if (app.title.includes(nameInTitle!) || data.state.sentFromUserId === game.userId) {
        app.setState(data.state);
        app.render(false, {id: `DisplayActions2e${data.user}`} as RenderOptions);
      }
    });
  }
}

export function handleToken(data: EmitData) {
  console.log(data);
  const dialog = checkForApp(data);
  dialog.render(true, {id: `DisplayActions2e${data.user}`} as RenderOptions);
}

/**
 * helper function to return the application from the modules or build a new one
 * immediatly pushes a new app into the list of modules
 * @param data data from emit
 * @returns either found DisplayActions2e or new DisplayActions2e with state
 */
function checkForApp(data: EmitData): DisplayActions2e {
  let module = game.modules.get(moduleId) as unknown as MyModule;
  let nameInTitle = game.users?.find(user => {
    return user.data._id === data.state.sentFromUserId;
  })?.data.name;
  let newApp: DisplayActions2e = new DisplayActions2e(data.state);

  if (nameInTitle) {
    let app = module.displayActions2e.find(app => {
      return app.title.includes(nameInTitle!);
    });

    if (app) {
      newApp = app;
    } else {
      // push into list to wait for updates
      module.displayActions2e.push(newApp);
    }
  }

  if (data.state.isLinkedToToken && data.state.tokenId) {
    let tokenInTitle = (
      ((canvas as Canvas).tokens.get(data.state.tokenId)?.document as TokenDocumentPF2e).actor as ActorPF2e
    ).name;
    let app = module.displayActions2e.find(app => {
      return app.title.includes(tokenInTitle);
    });
    if (app) {
      newApp = app;
    } else {
      // push into list to wait for updates
      module.displayActions2e.push(newApp);
    }
  }

  return newApp;
}

export function actionsFromConditions(conditions: Map<string, ConditionPF2e>): [number, number] {
  let numOfActions = 3;
  let numOfReactions = 1;

  console.log(conditions);

  let stun = conditions.get('stunned');
  // stunned overwrites slow thus it must be handled first
  if (stun) {
    numOfActions = stun[0].value! * condtionModifierTable['stunned'];
  } else {
    conditions.forEach(condition => {
      let slug: string = condition.system.slug;
      if (condtionModifierTable[slug]) {
        let valMod = condition.system.value.isValued ? condition.value! : 1;
        numOfActions += condtionModifierTable[slug!] * valMod;
      }
    });
  }

  return [numOfActions, numOfReactions];
}
