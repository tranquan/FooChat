# FooChat
---
A chat application using Firebase & React Native
(under construction)

## Installation
```
yarn install
react-native link
```

## Usage
```
yarn start
```

## Chat Logic
- Thread & Message is not actually deleted, but set `isDeleted` status to `true`. If later, you want to delete the databse to keep it light, you can write a function to run daily (or monthly) to find all Thread or Message which isDeleted status = true & remove it


## License
MIT

