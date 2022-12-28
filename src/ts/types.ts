import {ModuleData} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/packages.mjs';
import {DisplayActions2e} from './apps/displayActions';
import {DisplayTokenActions2e} from './apps/displayTokenActions';

export interface MyModule extends ModuleData {
  displayActions2e: DisplayActions2e[];
  displayTokenActions2e: DisplayTokenActions2e[];
}

export interface EmitData {
  operation: String;
  user: String;
  state: DisplayActions2eData;
  userList?: String[];
}

export interface DisplayActions2eData {
  numOfActions: number;
  numOfReactions: number;
  classNameListActions: string[];
  classNameListReactions: string[];
  sentFromUserId: string;
  userListPermissions: string[];
  tokenId?: string;
  isLinkedToToken?: boolean;
}
