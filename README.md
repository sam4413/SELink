# AMPLink
## (Advanced Moderation Panel Linker)
 AMPLink is a powerful tool that allows Administrators easy access to their Space Engineers servers through an easy to use webpanel.
 
 AMPLink relies on a RestAPI plugin for Torch called "TorchRemote." 
 https://torchapi.com/plugins/view/284017F3-9682-4841-A544-EB04DB8CB9BA
 
 ## ROADMAP:
 - Torch Installation / Uninstallation of Plugins [WORKING]
 - Torch Instance Configuration [WORKING]
 - Server Grid List [WORKING]

 - Server Mods Management [PLANNED] (when zznty adds it)
 - Server Scheduled Actions (AutoRestart, etc) [PLANNED]
 - Redo UI [DONE]
 - Workshop Browser [PLANNED]
 - Add more ranks for Users management. (ex: Normal User, Admin User, Superuser)
 
##NEW: Staging branch:
 - I have recently added the new staging branch onto AMPLink. Here you can see what the latest new features are happening for Beta I. Once all the features from the staging branch are deemed to be stable, and mostly bug free, it will move to the main branch. Some features im working on are: auto-updates, plugin configuration, and a dedicated Chat/Players page. Keep in mind, however, because it is a staging branch, bugs will be present, as well as missing features. Make a backup of your config and use with caution!
 
 ## Features and planned features:
Here is a long list of what I plan to add to or already added to AMPLink.<br>

Users System:<br>
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

<b>AMPLink is currently in ALPHA, and many features are either planned, don't work, or are unstable! Production use at the current moment is not recommended.</b>
<br>AMPLink Alpha Version 0.0.5
