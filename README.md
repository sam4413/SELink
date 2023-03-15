# AMPLink
## (Advanced Moderation Panel Linker)
 AMPLink is a powerful tool that allows Administrators easy access to their Space Engineers servers through an easy to use webpanel.
 
 AMPLink relies on a RestAPI plugin for Torch called "TorchRemote." 
 https://torchapi.com/plugins/view/284017F3-9682-4841-A544-EB04DB8CB9BA
 
 ## ROADMAP:
- [ ] Torch Configuration
  - [X] Configuring Plugins
  - [X] Torch Plugins Search
  - [ ] Post configuration to server
  - [ ] Upload new plugins
  - [ ] Automatic / Scheduled tasks
  
- [ ] Moderation
  - [X] Chat monitoring
  - [X] Kick, ban, promote, and demote players
  - [X] Send Messages through Panel
  - [ ] Entity list
  - [ ] Delete a grid
  
- [X] Server
  - [X] Console monitoring
  - [X] Start, restart, and stop server
  - [X] Send commands through console
  - [X] Copy console
  - [X] Server info and description
  
- [ ] World
  - [ ] Basic world info
  - [ ] World size
 
- [X] Users Management
  - [X] Create users
  - [X] Delete users
  - [X] User level management
  - [X] Login page
  
- [ ] VRageRemote API Integration
  - [ ] VRage Moderation
    - [ ] Banned players list
    - [ ] Unban players
  - [ ] Create a new save
  - [ ] Delete planets
  - [ ] Delete asteroids
  
- [ ] Other
  - [X] Configuratable .env
  - [X] Configuratable style.css
  - [ ] Automatic Updates
  - [ ] Restart AMPLink server
  
- [ ] Discord Bot Integration (This is far off, so this might change)
  [ ] Chat monitoring
  [ ] Console monitoring
  [ ] Send server commands through discord bot
  [ ] Send chat messages through discord bot

## NEW: Staging branch:
 - I have recently added the new staging branch onto AMPLink. Here you can see what the latest new features are. Once all the features from the staging branch are deemed to be stable, and mostly bug free, it will move to the main branch. 
- Some features im working on are: auto-updates, plugin configuration, and a dedicated Chat/Players page. Keep in mind, however, because it is a staging branch, bugs will be present, as well as missing features. Make a backup of your config and use with caution!
- Have any more questions? Visit the AMPLink Discord: https://discord.gg/nVxAgZ3P
 
 ## Users system:

One unique thing about AMPLink is that you can give your users certain features. For instance, User A is registered as a Normal User, and can only:
 - restart the server
 - stop the server
 - start the server
 - view console
As well as:
 - Promote/Demote users in game
 - Kick/Ban users in game.

But on the other hand, User B, which is a superuser can:

 - Do everything a Normal User can with the addition of:
 - Add/Remove other users in AMPLink
 - Add/Remove mods from the Steam Workshop
 - Configure the Torch Instance and World Settings
 - Add/Remove Plugins from Torch as well as uploading your own plugin
 - Allow for the configuration of said plugins as well.
 
Clearly everything isnt added at the moment, but this is what I plan to add.<br>

## Compatibility
AMPLink can be ran from any box. For instance: AMPLink can run on box 123.456.789:5000 but the server is on 888.888.888:27016.

It is not recommended to run AMPLink if you are running it through a server host and already have a control panel to control your SE Server.<br>
<b>Anything using TCPanel will cause conflicts with both panels and if your running a server and the provider already has a control panel to control your SE Server from, it's recommended to just stick with the provided panel from the provider.</b><br>
This program is to allow servers that are running Space Engineers Torch on a Dedicated box, or their own server. On which they dont have their own panel.<br>

Message sam44#9932 on discord if you have any questions.

<b>AMPLink is currently in BETA, and several features don't work, or are unstable! </b>

<br>Main (Stable branch): AMPLink v0.1-beta Build
<br>Staging (Unstable branch): AMPLink v0.1-beta Build
