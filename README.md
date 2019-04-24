# nwjs-tutorial

This tutorial shows how to create desktop programs with [NW.js](https://nwjs.io/). 

I'm a frontend developer with little experience in creating desktop applications and installers, so it took me some time find all the details of how to set this up. This tutorial is an overview of my findings. I hope it can help you to get started with NW.js.

### NW.js instead or Electron

[Electron](https://electronjs.org) is the better known of the frameworks for creating native apps. I also found it easier to use. My app however relies on `requestAnimationFrame` for timing, and I couldn't use Electron because of an [issue in Chromium](https://github.com/electron/electron/issues/9567) (the timer stops when the app window is hidden). In the end NW.js is not that hard to use however.

### The tutorial 'Metronome' project

The app for this tutorial is a simple metronome. Useful for for musical timekeeping. It uses `requestAnimationFrame` and it makes sound, so it will be easy to demonstrate that with NW.js the `requestAnimationFrame` timer will keep going even if the app's window is hidden behind others. See a demo of the app here: https://hisschemoller.github.io/nwjs-tutorial/src/.

### Tutorial overview

There's quite a lot to go through, so here's an overview of what's included in the tutorial:

- [Project setup to run it in the browser](setup_app)
- [Run NW.js directly from the command line](setup_nw)
- [Create a Mac desktop program (.app file)](mac_app)
- Create a Linux desktop program
- Create a Windows desktop program (.exe file)
- Create a Mac installer (.dmg file)
- Create a Linux installer (.deb file)
- Create a Windows installer (.exe file)


## <a href="setup_app"></a>Project setup to run it in the browser

Clone the Git repository for the tutorial at https://github.com/hisschemoller/nwjs-tutorial.

Install the dependencies as usual and start as defined in `package.json`. 

```bash
yarn install
yarn start
```

The app will now be available at http://localhost:3000

Open the URL in a browser and you'll see a small counter display. Click Start and the counter increase and hear a short blip each time the counter increases.

Note that the metronome stops if you switch to another browser tab, or if the browser is completely hidden by other windows.

## <a href="setup_nw"></a>Run NW.js directly from the command line

During development an app can easily be tested within the NW framework from the command line. Setting this up requires just a few steps:

- Add the NW package as a dependency using NPM
- Create a manifest file
- Run the app in the NW framework

### Add NW as an NPM package

To do this add NW as an NPM package to `package.json`.

Two flavors of NW exist: For development purposes there's an SDK version which contains the Chrome inspector. The regular version lacks the developer tools and because of that results in a smaller file size. To use the SDK version add `-sdk` to the version string.

```json
"devDependencies": {
    //...
    "nw": "0.36.4-sdk"
  }
```

### Create a manifest file

NW needs a manifest file to run. The manifest file is a JSON file called `package.json`. So confusingly it's named exactly the same as NPM's `package.json`. The difference however is that the manifest file is located in the same directory as the app's source files, while NPM's `package.json` is at the root of the project.

```
.
+-- package.json (NPM)
+-- src
|   +-- index.html
|   +-- package.json (NW manifest file)
```

As a bare minimum the manifest just needs the fields `name` and `main` for NW to run. The `main` field points NW to the app's entry, which in this case is `index.html`.

A lot more settings are possible however. a reference of all possible fields can be found at http://docs.nwjs.io/en/latest/References/Manifest%20Format/

This is the manifest for the Metronome app:

```json
{
  "name": "nwjs-tutorial",
  "main": "index.html",
  "chromium-args": "--disable-raf-throttling",
  "window": {
    "icon": "../assets/icons/512x512.png",
    "min_height": 500,
    "min_width": 400,
    "title": "Metronome"
  }
}
```

### Run the app in the NW framework

I've added a script in `package.json` to run NW, but it could as easily be started by just typing `yarn nw` in the command line. 

Once started, NW looks for the `"main"` field in `package.json` to find the app's entry point, and then looks for the manifest file in the same directory as the entry point. It then has all the data it needs to run the app.

Try running NW with and without the `--disable-raf-throttling` command line option and notice that with the option the metronome keeps running when the app is hidden.

```json
"scripts": {
  //...
  "start-nw": "nw --disable-raf-throttling"
},
```

## Creating a desktop program with NW.js

To create a desktop program a build of NW can be downloaded from the nwjs.io download page at https://nwjs.io/downloads/. Builds are available in different flavors, for Mac Linux and Windows, 32 or 64 bit, with or without the SDK option.

[nwjs download page screenshot]

In general the project's source files are added to the downloaded NW build, and the resulting package is the program to distribute. There are differences however between Mac, Linux and Windows.

## <a href="mac_app"></a>Create a Mac desktop program (.app file)

1. Download a Mac release from https://nwjs.io/downloads/ and unzip the download. The unzipped folder contains the file `nwjs.app` (among others).
2. Package all the files in the project's `/src` directory into a zip file and rename the zip to `app.nw`. So, to be clear, the file extension will be `.nw` instead of `.zip`, and it will contain `index.html`, the `css` and `js` directories and the `package.json` manifest file.
3. Put `app.nw` inside the downloaded Mac release, in the `nwjs.app/Contents/Resources/` directory. (right click on nwjs.app and choose 'Show Package Contents' to open it)
4. To add the app icons, rename `/assets/icons/metronome.icns` to `app.icns` and paste it into `nwjs.app/Contents/Resources/`. The file must replace the existing default icons. See below to create an `.icns` file.
5. Also overwrite `nwjs.app/Contents/Resources/documents.icns` with the `metronome.icns` file.
6. `nwjs.app/Contents/Info.plist`?

The file `nwjs.app` is now an executable that runs the app. Rename it to Metronome.app. Doubleclick the app to run it.

### Mac .icns file

On a Mac you can create an `.icns` file with the `iconutil` command line utility. Here are two tutorials:

1. https://retifrav.github.io/blog/2018/10/09/macos-convert-png-to-icns/
2. https://elliotekj.com/2014/05/27/how-to-create-high-resolution-icns-files/

On MacOS Mojave I created the icon files as described in the first tutorial and ran `iconutil` as described in the second one. That worked. A general overview of the steps:

1. Create all the required `png` images.
2. Put all files in a folder and rename the folder so the name ends with `.iconset`. In this case `metronome.iconset`.
3. Start Terminal and `cd` to the directory where the `.iconset` is.
4. Run `iconutil` to generate the `.icns` file, like this:

```bash
iconutil -c icns metronome.iconset
```



## Create a Linux desktop program

1. Download a Linux 32 or 64 bit release from https://nwjs.io/downloads/ and unzip the download.
2. Copy all files in the `/src` directory of the project into the root directory on the downloaded package. In my case it's called `nwjs-sdk-v0.37.0-linux-x64`. So your source files and `package.json` manifest file will be in the same directory as the downloaded `nw` file.
3. Copy the `/metronome.desktop` file to the root of the downloaded linux package. See below for the `.desktop` file.
4. Copy the `/assets/icons/icon.png` icon to the root of the downloaded linux package.

### Linux .desktop file

In GNOME and other freedesktop.org-compliant desktops, an application gets registered into the desktop's menus through a desktop entry, which is a text file with .desktop extension. This desktop file contains a listing of the configurations for your program.

- The file should have a unique descriptive filename without spaces. For this project I use `metronone.desktop`.
- The location should be:
  - `/usr/share/applications directory` to be accessible by everyone or
  - `/.local/share/applications` to be accessible to a single user.

Desktop file resources:

- https://wiki.archlinux.org/index.php/Desktop_entries
- https://developer.gnome.org/integration-guide/stable/desktop-files.html.en
- https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html

### Manually install on Linux

Download a Linux package and copy the source files and manifest file as in steps 1 and 2 of 'Package for Linux' above.

1. Rename the package to music-pattern-generator.
2. Copy the package to the `/opt` directory.
3. Copy the `music-pattern-generator.desktop` file to `/usr/share/applications`.

To copy to the source files directory and the desktop file use the `cp` command with administrator rights in a terminal:

```bash
$ sudo cp -r /path/to/music-pattern-generator /opt
$ sudo cp /path/to/music-pattern-generator.desktop /usr/share/applications
```

You will now be able to find and run the app just like any program you've installed. No restart or anything needed.

## Create a Windows desktop program (.exe file)

1. Download a Windows 32 or 64 bit release from https://nwjs.io/downloads/ and unzip the download.
2. Copy all files in the `/src` directory of the project into the root directory on the downloaded package. Your source files and `package.json` manifest file should be in the same directory as the `nw.exe` file.
3. (Icon for nw.exe can be replaced with tools like Resource Hacker, nw-builder and node-winresourcer.)

After step 2 nw.exe will run the app.

### Change the program's icon with Resourse Hacker

Windows uses icons of the ico file type. There are online converters to generate an ico file from another image type. For example https://icoconvert.com/.

1. Download Resource Hacker from http://angusj.com/resourcehacker/ and install.
2. Start the Resource Hacker program.
3. Select File > Open... and select the nw.exe
4. In the left pane right-click the Icon folder and select Replace Icon...
5. Click 'Open file with new icon...' and select the assets/icons/metronome.ico file.
6. In the right pane select the icon to be replaced, usually the top one in the list.
7. Click the Replace button.
8. Click File > Save... to save nw.exe with the new icon.

Resource Hacker resources

- http://angusj.com/resourcehacker/
- https://www.howtogeek.com/75983/stupid-geek-tricks-how-to-modify-the-icon-of-an-.exe-file/

## Installers

## Create a Mac installer (.dmg file)

1. On a Mac, create a new folder named `mpg-installer`.
2. Copy the app into the folder.
3. Start Disk Utility.
4. Go to File > New Image > Image from Folder... and choose the new folder.
5. Set the name to `music-pattern-generator_${version}.dmg`
6. Choose a destination folder where to save the installer.
7. Click the "Save" button.

### Create the template

1. Start Disk Utility.
2. Go to File > New Image > Blank Image...
3. Set the file name of the the image to `InstallerTemplate.dmg`.
4. Choose a destination folder where to save the installer.
5. Name the image 'InstallerTemplate'.
6. Select a size that's enough for the size of the app, 320MB.
7. Lease the other fields as they are.
8. Click 'Save' to create the dmg file.
9. Doubleclick `InstallerTemplate.dmg` to open it. It will show up in finder as a device.
10. In the Finder menu choose View > Show View Options.
11. Customize the look of the folder. Set it to Icon View, larger icons etc.
12. Drag the `music-pattern-generator.app` file into the folder.
13. Organize the icons within the folder.
14. Eject the disk image.

### Build the final DMG

1. Start Disk Utility.
3. Choose Images > Convert... from the menu.
2. Select `InstallerTemplate.dmg` just created.
4. Enter the name of the final image, `music-pattern-generator_${version}.dmg`.
5. Select Compressed as the Image Format.
6. Click 'Save' to create the dmg file.

DMG creation resources:

- https://kb.parallels.com/en/123895
- https://www.renedohmen.nl/blog/2012/04/building-fancy-dmg-images-on-mac-os-x/

## Create a Linux installer (.deb file)

- http://www.king-foo.com/2011/11/creating-debianubuntu-deb-packages/

## Create a Windows installer (.exe file)

INNO Setup is voted best at https://www.slant.co/topics/4794/versus/~inno-setup_vs_setup-factory_vs_advanced-installer.

- Download Inno Setup from http://www.jrsoftware.org/isdl.php (The current version is innosetup-5.6.1.exe)
- Install Inno Setup as usual for Windows applications.
- Launch Inno Setup.
- In the Welcome window select to "Create a new script file using the Script Wizard".
- The wizard opens with the Application Information screen:
  - The name of the application (Application name), 
  - its version (Application version), 
  - the company (or person) owner (Application publisher) 
  - the website of the application (Application website). 
  - Then click on next.
- Next is the Application Folder screen;
  - keep the destination base folder at "Program Files folder".
  - application folder name "Music Pattern Generator"
- Application Files
  - For "Application main executable file" browse to `nw.exe`.
  - For "Other application files" add the whole downloaded package with the source files and manifest file.
- Application Icons
  - "Start Menu folder name application": "Music Pattern Generator"
- Application Documentation
  - For "License file" choose the project's `/LICENSE` file.
- Setup Languages
  - Choose English, probably?
- Compiler Settings
  - For "Custom compiler output folder" choose some directory where to save the installer to create.
  - For "Compiler output base file name" use "music-pattern-generator_${version}".
- Click 'Finish'.
- Click 'Compile' to create the installer in the selected directory.


INNO Setup resources:

- http://www.jrsoftware.org/isinfo.php
- https://www.supinfo.com/articles/single/7176-create-installer-with-inno-setup

 











https://www.npmjs.com/package/nw

During development the whole NW package can be added to the project as an NPM module. That way the NW app can be easily started from the command line. To set this, NW is added as a dependency in `package.json`.


Note that the task `start-nw` has the option `--disable-raf-throttling` set. This ensures that requestAnimationFrame keeps running even if the App window is in the background, hidden by other windows.




https://www.npmjs.com/package/nw
https://github.com/nwjs/npm-installer
https://nwjs.io/
http://docs.nwjs.io/en/latest/For%20Users/Package%20and%20Distribute/
http://docs.nwjs.io/en/latest/References/Manifest%20Format/
https://www.sitepoint.com/cross-platform-desktop-app-nw-js/
https://strongloop.com/strongblog/creating-desktop-applications-with-node-webkit/
https://github.com/nwjs/nw.js/wiki/how-to-package-and-distribute-your-apps
