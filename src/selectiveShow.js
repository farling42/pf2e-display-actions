/* original by FVTT-SelectiveShow */

import { moduleId, socketEvent } from './constants.js';
import { handleSendToChat } from './utils.js';

export class SelectiveShowApp extends FormApplication {
  #userNameList;
  #displayActionState;

  constructor(users, state) {
    super(users);
    this.#userNameList = users;
    this.#displayActionState = state;
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = 'DisplayActions2e-selective-show';
    options.template = `modules/${moduleId}/templates/selectiveshow.html`;
    options.classes?.push('selective-show');
    options.height = 265;
    options.width = 200;
    options.minimizable = true;
    options.resizable = true;
    options.title = game.i18n.localize('selectiveshow.SelectiveShow');
    return options;
  }

  async getData() {
    const data = await super.getData();
    // 👇️ ts-ignore ignores any ts errors on the next line
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data.users = game.users.filter(user => user.active && user.id != game.user.id);
    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find('.show').click(ev => {
      ev.preventDefault();
      this._updateObject();
      game.socket?.emit(socketEvent, {
        operation: 'showToSelection',
        state: this.#displayActionState,
        user: game.userId,
        userList: this.#userNameList,
      });
      this.close();
    });
    html.find('.show-all').click(ev => {
      ev.preventDefault();
      this._updateObject();

      game.socket?.emit(socketEvent, {
        operation: 'showToAll',
        state: this.#displayActionState,
        user: game.userId,
      });

      this.close();
    });

    html.find('.show-permissions').click(ev => {
      ev.preventDefault();
      this._updateObject();

      this.#displayActionState.userListPermissions = this.#userNameList;

      game.socket?.emit(socketEvent, {
        operation: 'showWithPermission',
        state: this.#displayActionState,
        user: game.userId,
        userList: this.#userNameList,
      });

      this.close();
    });

    html.find('.send-to-chat').click(ev => {
      ev.preventDefault();
      this._updateObject();

      handleSendToChat({
        operation: 'sendToChat',
        state: this.#displayActionState,
        user: game.userId,
      });

      this.close();
    });
  }

  _updateObject() {
    const selector = Array.from(
      document.getElementsByClassName('selective-show-form')[0].children[0].children[0].children[0].children,
    );
    this.#userNameList = selector.map((element) => {
      // 👇️ ts-ignore ignores any ts errors on the next line
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (element.selected) {
        return element.value;
      }
      return '';
    });

    // active User Id needs to be send always
    const activeUserId = game.userId;
    if (activeUserId) {
      if (!this.#userNameList.includes(activeUserId)) {
        this.#userNameList.push(activeUserId);
      }
    }
    return new Promise < unknown > (() => { });
  }

  _handleShowPlayers(state) {
    switch (game.settings.get(moduleId, 'DisplayActions2e.Settings.ShowPlayerId')) {
      case 'Normal':
        this.render(true, { focus: false });
        break;
      case 'Chat':
        handleSendToChat({
          operation: 'sendToChat',
          state: this.#displayActionState,
          user: game.userId,
        });
        break;
      case 'GM':
      // TODO: Only send to GameMaster
      default:
        break;
    }
    this.#displayActionState = state;
  }
}
