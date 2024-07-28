import {moduleId, socketEvent} from './constants.js';
import {actionsFromConditions, handleDuplication, handleToken} from './utils.js';
import {SelectiveShowApp} from './selectiveShow.js';

export class DisplayActions2e extends Application {
  clickString = 'symbolClick';
  actionImage = 'systems/pf2e/icons/actions/OneAction.webp';
  reactionImage = 'systems/pf2e/icons/actions/Reaction.webp';
  defaultNumOfActions = 3;
  defaultNumOfReactions = 1;
  isLinkedToActor = false;

  state = {
    numOfActions: this.defaultNumOfActions,
    numOfReactions: this.defaultNumOfReactions,
    classNameListActions: Array.from({length: this.defaultNumOfActions}, () => 'symbol'),
    classNameListReactions: Array.from({length: this.defaultNumOfReactions}, () => 'symbol'),
    sentFromUserId: String(game.userId),
    userListPermissions: [String(game.userId)],
    tokenId: undefined,
    isLinkedToToken: this.isLinkedToActor,
    duplicationNr: 0,
  };

  showPlayerHandler = new SelectiveShowApp([game.user.name], this.state);

  constructor(newState) {
    super();

    if (newState) {
      this.state = newState;
    }
  }

  get title() {
    let title = game.i18n.localize('DisplayActions2e.WindowTitle');

    if (this.state.isLinkedToToken) {
      title = title.concat(this.#getTitleToken());
    }

    title = title.concat(this.#getTitleSentFrom());
    title = title.concat(this.#getTitleDuplication());
    return title;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'DisplayActions2e',
      template: `modules/${moduleId}/templates/result.hbs`,
      width: 270,
      height: 140,
      resizable: true,
      title: 'DisplayActions2e.WindowTitle',
    });
  }

  getData() {
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
      isLinkActorButtonHidden: !game.settings.get(moduleId, 'DisplayActions2e.Settings.LinkActorId'),
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    // register events for all users with permission
    if (this.state.userListPermissions.includes(String(game.userId))) {
      html.find('img.symbol').on('click', this._onClickSymbolImage.bind(this));
      html.find('input.input-counter').on('change', this._onChangeCountNumber.bind(this));
      html.find('button.actorLink').on('click', this.#_onButtonClickSelectedActors.bind(this));
      html.find('button.actorUpdate').on('click', this.#_onButtonClickUpdateActors.bind(this));
    }
  }

  _onClickSymbolImage(event) {
    event.preventDefault();
    // switch css classes of the images
    const image = event.currentTarget;
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
  buildHandlebarPayload(iterator, imageObj, state) {
    let payload = [];
    for (let index = 0; index < iterator; index++) {
      payload.push(foundry.utils.mergeObject({number: index, cssClass: state[index]}, imageObj));
    }
    return payload;
  }

  _onChangeCountNumber(event) {
    event.preventDefault();
    const input = event.currentTarget;
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

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();

    const headerButton = {
      label: 'JOURNAL.ActionShow',
      class: 'share-image',
      icon: 'fas fa-eye',
      onclick: () => this.showPlayerHandler._handleShowPlayers(this.state),
    };

    const headerButtonDuplication = {
      label: 'DisplayActions2e.Duplication',
      class: 'duplicate-app',
      icon: 'fa fa-clone',
      onclick: () => this.#_onHeaderDuplication(),
    };

    if (game.settings.get(moduleId, 'DisplayActions2e.Settings.ShowPlayerId') !== 'Hide') {
      buttons.unshift(headerButton);
    }
    if (game.settings.get(moduleId, 'DisplayActions2e.Settings.DuplicateId')) {
      buttons.unshift(headerButtonDuplication);
    }

    return buttons;
  }

  /**
   * Update internal state based on the size of the arrays
   */
  updateState() {
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

  emitUpdate() {
    game.socket?.emit(socketEvent, {
      operation: 'update',
      state: this.state,
      user: game.userId,
    });
  }

  setState(newState) {
    this.state = foundry.utils.deepClone(newState);
  }

  /**
   * returns a clone of the state not a reference
   */
  getState() {
    return foundry.utils.deepClone(this.state);
  }

  /**
   * The following functions are only done because transpilation is bullying me and thus i cannot do an child of this class
   */
  #getTitleToken() {
    let title = '';

    let name = canvas.tokens.get(this.state.tokenId);
    title = title.concat(' for ', String(name?.name));
    return title;
  }

  #getTitleSentFrom() {
    if (this.state.sentFromUserId === game.userId) {
      return '';
    }
    let title = ' sent from ';
    let name = game.users?.find((user) => {
      return user.id === this.state.sentFromUserId;
    })?.name;
    return title.concat(name);
  }

  #getTitleDuplication() {
    let title = '';
    if (this.state.duplicationNr > 0) {
      title = title.concat(' (', String(this.state.duplicationNr), ')');
    }
    return title;
  }

  #_onButtonClickSelectedActors() {
    canvas.tokens.controlled.forEach((token) => {
      let newState = foundry.utils.deepClone(this.state);
      newState.isLinkedToToken = true;
      newState.tokenId = token.id;
      newState = this.#generateActionsFromConditions(newState);

      handleToken({
        operation: 'token',
        state: newState,
        user: game.userId,
      });
    });
  }

  #_onButtonClickUpdateActors() {
    this.state = this.#generateActionsFromConditions(this.state);
    this.render();
  }

  #_onHeaderDuplication() {
    const newState = foundry.utils.deepClone(this.state);

    handleDuplication({
      operation: 'duplication',
      state: newState,
      user: game.userId,
    });
  }

  #generateActionsFromConditions(oldState) {
    let newState = foundry.utils.deepClone(oldState);

    const actor = canvas.tokens.get(oldState.tokenId)?.document.actor;

    const [numOfActions, numOfReactions] = actionsFromConditions(actor.conditions);

    newState.numOfActions = numOfActions;
    newState.numOfReactions = numOfReactions;

    return newState;
  }
}
