import {moduleId} from '../constants';
import {DisplayActions2eData} from '../types';
import {SelectiveShowApp} from './selectiveShow';

export class DisplayActions2e extends Application {
  private clickString = 'symbolClick';
  private actionImage = '/systems/pf2e/icons/actions/OneAction.webp';
  private reactionImage = '/systems/pf2e/icons/actions/Reaction.webp';
  private defaultNumOfActions = 3;
  private defaultNumOfReactions = 1;

  private state: DisplayActions2eData = {
    numOfActions: this.defaultNumOfActions,
    numOfReactions: this.defaultNumOfReactions,
    classNameListActions: Array.from({length: this.defaultNumOfActions}, () => 'symbol'),
    classNameListReactions: Array.from({length: this.defaultNumOfReactions}, () => 'symbol'),
    sentFromUserId: String((game as Game).userId),
    userListPermissions: [String((game as Game).userId)],
  };

  private showPlayerHandler: SelectiveShowApp = new SelectiveShowApp([String((game as Game).user?.name)], this.state);

  constructor(newState?: DisplayActions2eData) {
    super();

    if (newState) {
      this.state = newState;
    }
  }

  override get title(): string {
    let title = (game as Game).i18n.localize('DisplayActions2e.WindowTitle');
    if (this.state.sentFromUserId === (game as Game).userId) {
      return title;
    }

    let name = (game as Game).users?.find(user => {
      return user.id === this.state.sentFromUserId;
    })?.name;
    console.log(name);

    return title.concat(' sent from ', String(name));
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
    this.updateState();

    return {
      numOfActions: this.state.numOfActions,
      numOfReactions: this.state.numOfReactions,
      actionImagePayload: this.buildHandlebarPayload(
        this.state.numOfActions,
        {actionImage: this.actionImage},
        this.state.classNameListActions,
      ),
      reactionImagePayload: this.buildHandlebarPayload(
        this.state.numOfReactions,
        {reactionImage: this.reactionImage},
        this.state.classNameListReactions,
      ),
    };
  }

  override activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html);
    // only register events for oneself
    // if (String((game as Game).userId) === this.state.sentFromUserId) {
    if (this.state.userListPermissions.includes(String((game as Game).userId))) {
      html.find('img.symbol').on('click', this._onClickSymbolImage.bind(this));
      html.find('input.input-counter').on('change', this._onChangeCountNumber.bind(this));
    }
  }

  private _onClickSymbolImage(event: Event) {
    event.preventDefault();
    // switch css classes of the images
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
    // save the state
    // all id begin with either a or r for action or reaction respectively
    const pos = parseInt(image.id.slice(1));
    switch (image.id.charAt(0)) {
      case 'a':
        this.state.classNameListActions[pos] = image.className;
        break;
      case 'r':
        this.state.classNameListReactions[pos] = image.className;
        break;
      default:
        console.error(`${moduleId} handled Image onClicks wrong.`);
    }
  }

  /**
   * Helper function to make Payload for Handlebars each loop to pass data
   * @param iterator array size
   */
  private buildHandlebarPayload(iterator: number, imageObj: any, state: string[]) {
    let payload = [];
    for (let index = 0; index < iterator; index++) {
      payload.push(foundry.utils.mergeObject({number: index, cssClass: state[index]}, imageObj));
    }
    return payload;
  }

  private _onChangeCountNumber(event: Event) {
    event.preventDefault();
    const input = event.currentTarget as HTMLInputElement;
    const value = parseInt(input.value);
    if (!isNaN(value)) {
      if (value >= 0) {
        switch (input.id) {
          case 'count-action':
            this.state.numOfActions = value;
            break;
          case 'count-reaction':
            this.state.numOfReactions = value;
            break;
          default:
            console.error(`${moduleId} incorrectly handled number of actions!`);
        }
        this.render();
      }
    }
  }

  protected override _getHeaderButtons(): Application.HeaderButton[] {
    const buttons = super._getHeaderButtons();

    const headerButton: Application.HeaderButton = {
      label: 'JOURNAL.ActionShow',
      class: 'share-image',
      icon: 'fas fa-eye',
      onclick: () => this.showPlayerHandler._handleShowPlayers(this.state),
    };

    buttons.unshift(headerButton);
    return buttons;
  }

  /**
   * Update internal state based on the size of the arrays
   */
  private updateState() {
    // case to few state elements
    if (this.state.classNameListActions.length < this.state.numOfActions) {
      const tmp = Array.from(
        {length: this.state.numOfActions - this.state.classNameListActions.length},
        () => 'symbol',
      );
      this.state.classNameListActions = this.state.classNameListActions.concat(tmp);
    }
    // too many elements,we remove the last elements
    else if (this.state.classNameListActions.length > this.state.numOfActions) {
      const cut_value = this.state.classNameListActions.length - this.state.numOfActions;
      this.state.classNameListActions = this.state.classNameListActions.slice(0, cut_value);
    }

    // other state same cases

    // case to few state elements
    if (this.state.classNameListReactions.length < this.state.numOfReactions) {
      const tmp = Array.from(
        {length: this.state.numOfReactions - this.state.classNameListReactions.length},
        () => 'symbol',
      );
      this.state.classNameListReactions = this.state.classNameListReactions.concat(tmp);
    }
    // too many elements, we remove the last elements
    else if (this.state.classNameListReactions.length > this.state.numOfReactions) {
      const cut_value = this.state.classNameListReactions.length - this.state.numOfReactions;
      this.state.classNameListReactions = this.state.classNameListReactions.slice(0, cut_value);
    }
  }
}
