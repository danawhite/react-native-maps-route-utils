
# react-native-maps-route-utils

## Getting started

`$ npm install react-native-maps-route-utils --save`

### Mostly automatic installation

`$ react-native link react-native-maps-route-utils`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-maps-route-utils` and add `RNMapsRouteUtils.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNMapsRouteUtils.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNMapsRouteUtilsPackage;` to the imports at the top of the file
  - Add `new RNMapsRouteUtilsPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-maps-route-utils'
  	project(':react-native-maps-route-utils').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-maps-route-utils/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-maps-route-utils')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNMapsRouteUtils.sln` in `node_modules/react-native-maps-route-utils/windows/RNMapsRouteUtils.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Cl.Json.RNMapsRouteUtils;` to the usings at the top of the file
  - Add `new RNMapsRouteUtilsPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNMapsRouteUtils from 'react-native-maps-route-utils';

// TODO: What do with the module?
RNMapsRouteUtils;
```
  