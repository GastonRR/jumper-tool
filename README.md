# Jumper Tool

`Jumper` is a command line interface (CLI) tool created to move between git projects in a more fun and easy way, inspired by console aliases

## Features

- Scan git projects in a path or current path
- Create a reference to the project
- Move to project folder from anywhere
- List all project references

### Install

```bash
curl -sL https://raw.githubusercontent.com/GastonRR/jumper-tool/main/install.sh | bash
```

### Post-Installation Setup

After installation, you need to source your shell configuration file to use fnc immediately:

For Bash users:

```bash
source ~/.bashrc
```

For Zsh users:

```bash
source ~/.zshrc
```

### Usage

The basic syntax for using `Jumper` is:

```bash
jumper [options] [command]
or
jump <tag>
```

#### Example:

```bash
jumper init
or
jump example
```
