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
    let title = game.i18n.localize('DisplayActions2e.WindowTitle');
    canvas.tokens.controlled.forEach((token: any) => {
      let app = new DisplayActions2e(undefined, true);
      title.concat(`for ${token.name}`);
      app.render(true, {id: `DisplayActions2e${game.userId}`, title: title} as RenderOptions);
    });
  }
}
