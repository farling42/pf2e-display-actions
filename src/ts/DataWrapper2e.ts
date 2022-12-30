import {TokenDocumentPF2e} from '../../types/src/module/token-document';
import {DisplayActions2e} from './apps/displayActions';

export class DataWrapper2e {
  /*private conditions = {
    slowed: -1,
  };*/

  public static getData(): [number, number] {
    let numOfActions = 3;
    let numOfReactions = 1;

    canvas.tokens.controlled;

    return [numOfActions, numOfReactions];
  }

  public static createApplications() {
    canvas.tokens.controlled.forEach((token: TokenDocumentPF2e) => {
      // let app = new DisplayTokenActions2e(token.data._id);
      let app = new DisplayActions2e();
      app.render(true);
      console.log(token);
    });
  }
}
