import {moduleId} from '../constants';

export class DisplayActions2e extends Application {
  private clickString = 'symbolClick';
  private actionImage = '/systems/pf2e/icons/actions/OneAction.webp';
  private reactionImage = '/systems/pf2e/icons/actions/Reaction.webp';
  private numOfActions = 3;
  private numOfReactions = 1;

  constructor() {
    super();
  }

  override get title(): string {
    return (game as Game).i18n.localize('DisplayActions2e.WindowTitle');
  }

  static override get defaultOptions(): ApplicationOptions {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'DisplayActions2e',
      template: `modules/${moduleId}/templates/result.hbs`,
      width: 600,
      height: 200,
      resizable: true,
      title: 'DisplayActions2e.WindowTitle',
    }) as ApplicationOptions;
  }

  override getData() {
    return {
      numOfActions: this.numOfActions,
      numOfReactions: this.numOfReactions,
      actionImagePayload: this.buildHandlebarPayload(this.numOfActions, {actionImage: this.actionImage}),
      reactionImagePayload: this.buildHandlebarPayload(this.numOfReactions, {reactionImage: this.reactionImage}),
    };
  }

  override activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html);
    html.find('img.symbol').on('click', this._onClickSymbolImage.bind(this));
    html.find('input.input-counter').on('change', this._onChangeCountNumber.bind(this));
  }

  private _onClickSymbolImage(event: Event) {
    event.preventDefault();
    const image = event.currentTarget as HTMLImageElement;
    if (image === undefined || image === null) {
      return;
    }
    if (image.className === undefined || image.className === null) {
      return;
    }
    if (image.className.includes(this.clickString)) {
      image.className = image.className.replace(this.clickString, '');
    } else {
      image.className = image.className.concat(' ', this.clickString);
    }
  }

  /**
   * Helper function to make Payload for Handlebars each loop to pass data
   * @param iterator array size
   */
  private buildHandlebarPayload(iterator: number, data: any) {
    let payload = [];
    for (let index = 0; index < iterator; index++) {
      payload.push(data);
    }
    return payload;
  }

  private _onChangeCountNumber(event: Event) {
    event.preventDefault();
    const input = event.currentTarget as HTMLInputElement;
    const value = parseInt(input.value);
    console.log(value);
    if (!isNaN(value)) {
      if (value >= 0) {
        switch (input.id) {
          case 'count-action':
            this.numOfActions = value;
            break;
          case 'count-reaction':
            this.numOfReactions = value;
            break;
          default:
            console.error(`${moduleId} incorrectly handled number of actions!`);
        }
        this.render();
      }
    }
  }
}
