# mp3length

[![Join the chat at https://gitter.im/yuchuan1/mp3length](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/yuchuan1/mp3length?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Get the length of mp3 files utilizing OS built in functions for windows and OSX

## Install

```
$ npm install --save mp3length
```
## Usage

```javascript
var mp3Length = require('mp3Length');
mp3Length('test.mp3', function (err, length) {
  console.log('The estimated length test.mp3 is ' + length + ' secs');
});


```

## API

## mp3Length(filepath, callback) 

### filepath

Type: `string`

Path to the file

### callback(error, length)

Type: `function`

Callback to be called once mp3 length (in seconds) is retrieved
