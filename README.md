# hyperledgerFabric_UniApp

To be able to use this app you need the binaries, config and docker images from hyperledger fabric. Follow [these instructions](https://hyperledger-fabric.readthedocs.io/en/latest/install.html) to download them. After you installed them you have to create softlinks to these folders or change all references in all relevant files.

To create the necessary softlinks you need use:

```
ln -s *path_to_bin_folder* bin
ln -s *path_to_config_folder* config
```