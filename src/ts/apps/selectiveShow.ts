/* original by FVTT-SelectiveShow */

import {moduleId} from '../constants';

export class SelectiveShowApp extends Application {
  private selection: any;

  constructor(resolve: any) {
    super();
    this.selection = resolve;
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
      let selector = $(ev.currentTarget).parents('form').find('select');
      this.selection(selector.val());
      this.close();
    });
    html.find('.show-all').click(ev => {
      ev.preventDefault();
      // 👇️ ts-ignore ignores any ts errors on the next line
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.selection((game as Game).users?.filter(u => u.active && u.data.id != game.user.id).map(u => u.id));
      this.close();
    });
  }
}
