# Version Manager for Cordova* Software

This tool will help you install and use multiple versions of Cordova.  We create a folder .cvm and install the versions in there.

<img src="http://i.imgur.com/MjWq3aO.gif">

## Installation

Use NPM* for installation

```

npm install -g version-manager-cordova-software

```


## Commands
```
./bin/cvm

       list - list available covdova versions installed
       install [5.1.1] - Install a cordova version
       uninstall [5.1.1] - Uninstall a cordova version
       use [5.1.1] - Switch to a specific version of cordova
       version - List current version of Cordova
       remote - List available remote versions of cordova to install
```


```
cvm install 5.1.1  # install 5.1.1
cvm use 5.1.1      # use 5.1.1
cvm use system     # use the version installed via npm
```


## shell profile entry

You must add an entry to your shell so our Cordova script is called *before* the Cordova commands installed by npm.

Please add the following to your shell profile (e.g .bash_profile) and then run 'source .bash_profile'

```
export PATH="$HOME/.cvm:$PATH"
```

## Windows users

If you are using a tool like cygwin* or gitbash* follow the above instructions. If you are using the windows* command prompt, add an entry to your system  path variable.  Make sure it is *before* your entry to node_modules

```
c:\users\myaccount\.cvm;c:\users\myaccount\AppData\roaming\npm

```

## How it works

We create a $HOME/.cvmrc file that stores the Cordova version you want to use.  All the versions are installed in $HOME/.cvm/_version_ so they can be run.

We also have a new Cordova file that intercepts any calls and dispatches it to the correct version you've chosen in cvm.  All arguments are passed through, we simply pick a different install of Cordova to execute.


*Other names and brands may be claimed as the property of others

