import {ModuleData} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/packages.mjs';
import {DisplayActions2e} from './apps/displayActions';

export interface MyModule extends Game.ModuleData<ModuleData> {
  displayActions2e: DisplayActions2e;
}

export interface EmitData {
  operation: String;
  user: String;
  state: DisplayActions2eData;
}

export interface DisplayActions2eData {
  numOfActions: number;
  numOfReactions: number;
  classNameListActions: string[];
  classNameListReactions: string[];
  sentFromName: string;
}
