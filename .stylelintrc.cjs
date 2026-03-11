module.exports = {
  extends: ["stylelint-config-standard"],
  rules: {
    /* ❌ Disallow hardcoded colors */
    "color-no-hex": true,
    "color-named": "never",

    /* ❌ Disallow raw numbers for spacing/sizing */
    "declaration-property-value-disallowed-list": {
      "/^margin|padding|gap|top|left|right|bottom|width|height|font-size$/": [
        "/^[0-9]+(px|rem|em|%)$/",
      ],
    },

    /* ✅ Enforce CSS variables */
    "declaration-property-value-allowed-list": {
      "/.*/": ["/var\\(--.*/"],
    },

    /* ❌ No animations outside motion tokens */
    "rule-disallowed-list": [
      {
        name: "keyframes",
        message: "Keyframes only allowed in tokens.motion.css",
      },
    ],

    /* ❌ Prevent accidental !important */
    "declaration-no-important": true,
  },
  overrides: [
    {
      files: ["styles/tokens*.css", "styles/themes.css", "styles/utilities*.css"],
      rules: {
        "color-no-hex": null,
        "declaration-property-value-disallowed-list": null,
        "declaration-property-value-allowed-list": null,
      },
    },
  ],
}
