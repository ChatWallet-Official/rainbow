fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios refresh_dsyms

```sh
[bundle exec] fastlane ios refresh_dsyms
```

Refresh dSYMs

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Submit a new Beta build to Apple TestFlight

### ios register_devices

```sh
[bundle exec] fastlane ios register_devices
```

Register new devices

### ios distribute

```sh
[bundle exec] fastlane ios distribute
```

Distribute a build to firebase

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
