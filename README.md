# Pf2e Display Actions

![GitHub Releases](https://img.shields.io/badge/dynamic/json?label=Downloads@latest&query=assets%5B1%5D.download_count&url=https%3A%2F%2Fapi.github.com%2Frepos%2FMoonIsFalling%2Fpf2e-display-actions%2Freleases%2Flatest)
![GitHub All Releases](https://img.shields.io/github/downloads/MoonIsFalling/pf2e-display-actions/total?label=Downloads+total)

Displays Pathfinder2e action and reaction buttons.

This module supports [Bug Reporter](https://github.com/League-of-Foundry-Developers/bug-reporter).

## Usage

Click on this Button in the actors tab. ![Button in the actors tab](usage.png)

This should get you your action display ![action display dialog](dialog.png)

Simply change the number in the fields to the desired amount.

### Duplicate
creates a copy of your window, maybe useful for saving configurations.
### Show Players
Opens another another dialog inwhich you can send your dialog to another player at the table. Or send it straight into the chat
### Link to Actor
Fixes your Actions to that of the actor linked to the window. (Influenced by slowed, quickened, ...)
Currently WIP I may have missed many interactions.

## Changelog
#### v 1.5.0
- added Show woth Permissions button for colaboration 
#### v 1.6.0
- added ability to connect a app window with a token
- added basic handling of conditions related to actions
##### v 1.6.1
- some small improvements to title logic
#### v 1.7.0
- added Duplication button in the header
##### v 1.7.1
- more responsive application
  - fixed [#8](https://github.com/MoonIsFalling/pf2e-display-actions/issues/8)
#### v 1.8.0
- discontinued support for v9 of Foundry
  - fixed V10 manifest warnings [#10](https://github.com/MoonIsFalling/pf2e-display-actions/issues/10)
#### v 1.9.0
- added a Send To Chat Button to the Show Players Dialog
##### v 1.9.1
- updated the sidebar icon to pf2e action symbol
  
## Roadmap
- make the amount of actions and reactions based on the selected token
    - include better handling
- beautify the Dialog
- better titles

## Credits
- I used BringingFire's [Blog](https://bringingfire.com/blog/intro-to-foundry-module-development) and respective [template](https://github.com/BringingFire/foundry-module-ts-template)

- Module [FVTT-SelectiveShow](https://github.com/moo-man/FVTT-SelectiveShow) under is of the MIT License

- thanks for [tehguitarist](https://github.com/tehguitarist) for contributing CSS
