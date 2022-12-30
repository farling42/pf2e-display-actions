import {name} from '../module.json';
import {ConditionModifierDictionary} from './types';

export const moduleId = name;
export const moduleName = 'DisplayActions2e';
export const socketEvent = `module.${moduleId}`;
export const condtionModifierTable: ConditionModifierDictionary = {
  slowed: -1,
  quickened: 1,
  stunned: 1,
};
