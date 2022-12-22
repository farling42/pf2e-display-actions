/* original by FVTT-SelectiveShow */

import {moduleId, socketEvent} from '../constants';
import {DisplayActions2eData, EmitData} from '../types';

export class SelectiveShowApp extends FormApplication {
  private userNameList: string[];
  private displayActionState: DisplayActions2eData;

  constructor(users: string[], state: DisplayActions2eData) {
    super(users);
    this.userNameList = users;
    this.displayActionState = state;
  }

  static override get defaultOptions() {
    const options = super.defaultOptions;
    options.id = 'DisplayActions2e-selective-show';
    options.template = `modules/${moduleId}/templates/selectiveshow.html`;
    options.classes.push('selective-show');
    options.height = 300;
    options.width = 250;
    options.minimizable = true;
    options.resizable = true;
    options.title = (game as Game).i18n.localize('selectiveshow.SelectiveShow');
    return options;
  }

  override async getData() {
    let data = await super.getData();
    // 👇️ ts-ignore ignores any ts errors on the next line
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data.users = game.users.filter(u => u.active && u.data.id != game.user.id);
    return data;
  }

  override activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    html.find('.show').click(ev => {
      ev.preventDefault();
      this._updateObject();
      // let selector = $(ev.currentTarget).parents('form').find('select');
      (game as Game).socket?.emit(socketEvent, {
        operation: 'showToSelection',
        state: this.displayActionState,
        user: (game as Game).userId,
        userList: this.userNameList,
      } as EmitData);
      this.close();
    });
    html.find('.show-all').click(ev => {
      ev.preventDefault();
      this._updateObject();

      (game as Game).socket?.emit(socketEvent, {
        operation: 'showToAll',
        state: this.displayActionState,
        user: (game as Game).userId,
      } as EmitData);

      this.close();
    });

    html.find('.show-permissions').click(ev => {
      ev.preventDefault();
      this._updateObject();

      this.displayActionState.userListPermissions = this.userNameList;

      (game as Game).socket?.emit(socketEvent, {
        operation: 'showWithPermission',
        state: this.displayActionState,
        user: (game as Game).userId,
        userList: this.userNameList,
      } as EmitData);

      this.close();
    });
  }

  protected override _updateObject(): Promise<unknown> {
    let selector = Array.from(
      document.getElementsByClassName('selective-show-form')[0].children[0].children[0].children[0].children,
    ) as HTMLOptionElement[];
    this.userNameList = selector.map((element: HTMLOptionElement) => {
      // 👇️ ts-ignore ignores any ts errors on the next line
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (element.selected) {
        return element.value;
      }
      return '';
    });

    // active User Id needs to be send always
    let activeUserId = (game as Game).userId;
    if (activeUserId) {
      if (!this.userNameList.includes(activeUserId)) {
        this.userNameList.push(activeUserId);
      }
    }

    console.log(this.userNameList);
    return new Promise<unknown>(() => {
      console.log('In the Promise');
    });
  }

  _handleShowPlayers(state: DisplayActions2eData) {
    this.render(true);
    this.displayActionState = state;
    console.log(this.displayActionState);
    console.log(this.userNameList);
  }
}
