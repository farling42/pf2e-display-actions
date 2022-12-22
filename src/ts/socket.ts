import {DisplayActions2e} from './apps/displayActions';
import {moduleId} from './constants';
import {EmitData, MyModule} from './types';

export function handleShowToAll(data: EmitData) {
  const dialog = checkForApp(data);
  dialog.render(true, {id: `DisplayActions2e${data.user}`});
}

export function handleShowToSelection(data: EmitData) {
  if (data.userList?.includes(String((game as Game).userId))) {
    const dialog = checkForApp(data);
    dialog.render(true, {id: `DisplayActions2e${data.user}`});
  }
}

export function handleShowWithPermission(data: EmitData) {
  handleShowToSelection(data);
}

export function handleUpdate(data: EmitData) {
  let module = (game as Game).modules.get(moduleId) as MyModule;
  let nameInTitle = (game as Game).users?.find(user => {
    return user.id === data.state.sentFromUserId;
  })?.name;

  if (nameInTitle) {
    module.displayActions2e.forEach(app => {
      // check for title OR own application update
      // this is why checkForApp cannot be used
      if (app.title.includes(nameInTitle!) || data.state.sentFromUserId === (game as Game).userId) {
        app.setState(data.state);
        app.render(false, {id: `DisplayActions2e${data.user}`});
      }
    });
  }
}

/**
 * helper function to return the application from the modules or build a new one
 * immediatly pushes a new app into the list of modules
 * @param data data from emit
 * @returns either found DisplayActions2e or new DisplayActions2e with state
 */
function checkForApp(data: EmitData): DisplayActions2e {
  let module = (game as Game).modules.get(moduleId) as MyModule;
  let nameInTitle = (game as Game).users?.find(user => {
    return user.id === data.state.sentFromUserId;
  })?.name;
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

  return newApp;
}
