/* global AFRAME */
var utils = AFRAME.utils;

/**
 * Set properties if headset is not connected by checking getVRDisplays().
 */
AFRAME.registerComponent('if-no-vr-headset', {
  schema: {
    default: {},
    parse: utils.styleParser.parse
  },

  update: function () {
    var self = this;

    // Don't count mobile as VR.
    if (this.el.sceneEl.isMobile) {
      this.setProperties();
      return;
    }

    // Check VRDisplays to determine if headset is connected.
    navigator.getVRDisplays().then(function (displays) {
      // Special case for WebVR emulator.
      if (displays.length && displays[0].displayName !== 'Emulated HTC Vive DVT') { return; }
      self.setProperties();
    });
  },

  setProperties: function () {
    var data = this.data;
    var el = this.el;
    Object.keys(data).forEach(function set (component) {
      el.setAttribute(component, data[component]);
    });
  }
});
