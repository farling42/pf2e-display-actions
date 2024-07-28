import {DisplayActions2e} from './displayActions.js';

export class DataWrapper2e {

  static getData() {
    let numOfActions = 3;
    let numOfReactions = 1;

    canvas.tokens.controlled;

    return [numOfActions, numOfReactions];
  }

  static createApplications() {
    canvas.tokens.controlled.forEach((token) => {
      let app = new DisplayActions2e();
      app.render(true);
      console.log(token);
    });
  }
}
