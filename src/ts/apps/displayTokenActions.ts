import {TokenDocumentPF2e} from '../../../types/src/module/token-document';
import {DisplayActions2eData} from '../types';
import {DisplayActions2e} from './displayActions';

export class DisplayTokenActions2e extends DisplayActions2e {
  private tokenId: string;

  constructor(tokenId: string, newState?: DisplayActions2eData) {
    super(newState);
    this.isLinkedToActor = true;
    this.tokenId = tokenId;
  }

  override get title(): string {
    let title = game.i18n.localize('DisplayActions2e.WindowTitle');
    if (this.state.sentFromUserId === game.userId) {
      return title;
    }

    let name = canvas.data.tokens.find((token: TokenDocumentPF2e) => {
      return token.data._id === this.tokenId;
    });

    return title.concat(' for ', String(name));
  }

  override activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html);
    // register events for all users with permission
    if (this.state.userListPermissions.includes(String(game.userId))) {
      html.find('img.symbol').on('click', this._onClickSymbolImage.bind(this));
      html.find('input.input-counter').on('change', this._onChangeCountNumber.bind(this));
    }
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
      isLinkedToActor: this.isLinkedToActor,
    };
  }
}
