import {ActorPF2e} from '../../../types/src/module/actor';
import {ConditionPF2e} from '../../../types/src/module/item';
import {TokenDocumentPF2e} from '../../../types/src/module/token-document';
import {moduleId, socketEvent} from '../constants';
import {actionsFromConditions, handleToken} from '../utils';
import {DisplayActions2eData, EmitData} from '../types';
import {SelectiveShowApp} from './selectiveShow';

export class DisplayActions2e extends Application {
  protected clickString = 'symbolClick';
  protected actionImage = '/systems/pf2e/icons/actions/OneAction.webp';
  protected reactionImage = '/systems/pf2e/icons/actions/Reaction.webp';
  protected defaultNumOfActions = 3;
  protected defaultNumOfReactions = 1;
  protected isLinkedToActor = false;

  protected state: DisplayActions2eData = {
    numOfActions: this.defaultNumOfActions,
    numOfReactions: this.defaultNumOfReactions,
    classNameListActions: Array.from({length: this.defaultNumOfActions}, () => 'symbol'),
    classNameListReactions: Array.from({length: this.defaultNumOfReactions}, () => 'symbol'),
    sentFromUserId: String(game.userId),
    userListPermissions: [String(game.userId)],
    tokenId: undefined,
    isLinkedToToken: this.isLinkedToActor,
  };

  protected showPlayerHandler: SelectiveShowApp = new SelectiveShowApp([String(game.user?.data.name)], this.state);

  constructor(newState?: DisplayActions2eData) {
    super();

    if (newState) {
      this.state = newState;
    }
  }

  override get title(): string {
    if (this.state.isLinkedToToken) {
      return this.getTitleToken();
    } else {
      return this.getTitlePlayer();
    }
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
      isLinkedToActor: this.state.isLinkedToToken,
    };
  }

  override activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html);
    // register events for all users with permission
    if (this.state.userListPermissions.includes(String(game.userId))) {
      html.find('img.symbol').on('click', this._onClickSymbolImage.bind(this));
      html.find('input.input-counter').on('change', this._onChangeCountNumber.bind(this));
      // html.find('button.actorLink').on('click', DataWrapper2e.createApplications);
      html.find('button.actorLink').on('click', this._onButtonClickSelectedActors.bind(this));
      html.find('button.actorUpdate').on('click', this._onButtonClickUpdateActors.bind(this));
    }
  }

  protected _onClickSymbolImage(event: Event) {
    event.preventDefault();
    // switch css classes of the images
    const image = event.currentTarget as HTMLImageElement;
    if (image === undefined || image === null) {
      return;
    }
    image.classList.toggle(this.clickString);
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

    this.emitUpdate();
  }

  /**
   * Helper function to make Payload for Handlebars each loop to pass data
   * @param iterator array size
   */
  protected buildHandlebarPayload(iterator: number, imageObj: any, state: string[]) {
    let payload = [];
    for (let index = 0; index < iterator; index++) {
      payload.push(foundry.utils.mergeObject({number: index, cssClass: state[index]}, imageObj));
    }
    return payload;
  }

  protected _onChangeCountNumber(event: Event) {
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
        this.emitUpdate();
      }
    }
  }

  protected override _getHeaderButtons(): ApplicationHeaderButton[] {
    const buttons = super._getHeaderButtons();

    const headerButton: ApplicationHeaderButton = {
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
  protected updateState() {
    // case to few state elements
    if (this.state.classNameListActions.length < this.state.numOfActions) {
      const tmp = Array.from(
        {length: this.state.numOfActions - this.state.classNameListActions.length},
        () => 'symbol',
      );
      this.state.classNameListActions = this.state.classNameListActions.concat(tmp);
    }
    // too many elements, we remove the last elements
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

  protected emitUpdate() {
    game.socket?.emit(socketEvent, {
      operation: 'update',
      state: this.state,
      user: game.userId,
    } as EmitData);
  }

  public setState(newState: DisplayActions2eData) {
    this.state = newState;
  }

  /**
   * The following functions are only done because transpilation is bullying me and thus i cannot do an child of this class
   */

  private getTitlePlayer(): string {
    let title = game.i18n.localize('DisplayActions2e.WindowTitle');
    if (this.state.sentFromUserId === game.userId) {
      return title;
    }

    let name = game.users?.find(user => {
      return user.data._id === this.state.sentFromUserId;
    })?.data.name;

    return title.concat(' sent from ', String(name));
  }

  private getTitleToken(): string {
    let title = game.i18n.localize('DisplayActions2e.WindowTitle');

    let name = (canvas as Canvas).tokens.get(this.state.tokenId as string);
    title = title.concat(' for ', String(name?.data.name));

    if (this.state.sentFromUserId === game.userId) {
      return title;
    }

    name = game.users?.find(user => {
      return user.data._id === this.state.sentFromUserId;
    })?.data.name;

    return title.concat(' sent from ', String(name));
  }

  private _onButtonClickSelectedActors(event: Event) {
    console.log(event);

    canvas.tokens.controlled.forEach((token: TokenDocumentPF2e) => {
      // let app = new DisplayTokenActions2e(token.data._id);

      let newState = foundry.utils.deepClone(this.state);
      newState.isLinkedToToken = true;
      newState.tokenId = token.data._id;
      newState = this.generateActionsFromConditions(newState);

      handleToken({
        operation: 'token',
        state: newState,
        user: game.userId,
      } as EmitData);
    });
  }

  private _onButtonClickUpdateActors(event: Event) {
    console.log(event);

    this.state = this.generateActionsFromConditions(this.state);
    this.render();
  }

  private generateActionsFromConditions(oldState: DisplayActions2eData): DisplayActions2eData {
    let newState = oldState;

    let actor = ((canvas as Canvas).tokens.get(oldState.tokenId!)?.document as TokenDocumentPF2e).actor as ActorPF2e;
    // let actor = game.actors.tokens[oldState.tokenId!] as ActorPF2e;
    console.log(actor);
    console.log(oldState);

    let conditions = actor.conditions as Map<string, ConditionPF2e>;

    let [numOfActions, numOfReactions] = actionsFromConditions(conditions);

    newState.numOfActions = numOfActions;
    newState.numOfReactions = numOfReactions;

    return newState;
  }
}
