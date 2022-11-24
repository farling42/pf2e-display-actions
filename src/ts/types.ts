import {ModuleData} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/packages.mjs';
import {DisplayActions2e} from './apps/displayActions';

export interface MyModule extends Game.ModuleData<ModuleData> {
  displayActions2e: DisplayActions2e;
}
