import {moduleId} from './constants.js';

export function settingSetup() {
  game.settings.register(moduleId, 'DisplayActions2e.Settings.DuplicateId', {
    name: 'DisplayActions2e.Settings.DuplicateSetting',
    hint: 'DisplayActions2e.Settings.DuplicateHint',
    config: true,
    scope: 'client',
    type: Boolean,
    default: false,
  });
  game.settings.register(moduleId, 'DisplayActions2e.Settings.LinkActorId', {
    name: 'DisplayActions2e.Settings.LinkActorSetting',
    hint: 'DisplayActions2e.Settings.LinkActorHint',
    config: true,
    scope: 'client',
    type: Boolean,
    default: false,
  });
  game.settings.register(moduleId, 'DisplayActions2e.Settings.UpdateTurnStart', {
    name: 'DisplayActions2e.Settings.UpdateTurnStart',
    hint: 'DisplayActions2e.Settings.UpdateTurnStartHint',
    config: true,
    scope: 'client',
    type: Boolean,
    default: false,
  });
  game.settings.register(moduleId, 'DisplayActions2e.Settings.ShowPlayerId', {
    name: 'DisplayActions2e.Settings.ShowPlayerSetting',
    hint: 'DisplayActions2e.Settings.ShowPlayerHint',
    config: true,
    scope: 'client',
    type: String,
    choices: {
      Hide: 'DisplayActions2e.Settings.ShowPlayerChoices.Hide',
      Normal: 'DisplayActions2e.Settings.ShowPlayerChoices.Normal',
      Chat: 'DisplayActions2e.Settings.ShowPlayerChoices.Chat',
      // TODO enable GM: 'DisplayActions2e.Settings.ShowPlayerChoices.GM',
    },
    default: 'Normal',
  });
}
