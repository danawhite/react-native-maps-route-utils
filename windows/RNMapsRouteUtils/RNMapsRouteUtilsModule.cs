using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Com.Reactlibrary.RNMapsRouteUtils
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNMapsRouteUtilsModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNMapsRouteUtilsModule"/>.
        /// </summary>
        internal RNMapsRouteUtilsModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNMapsRouteUtils";
            }
        }
    }
}
