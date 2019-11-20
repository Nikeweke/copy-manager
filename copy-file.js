
const progress = require('progress-stream');
const fs       = require('fs')
const ncp      = require('ncp').ncp;
const crimsonProgressBar = require("crimson-progressbar");
const getFolderSize      = require('get-folder-size');

module.exports = {
  copyFile
}

function copyFile ({index, from: fromPath, to: toPath}) {
  return new Promise((res) => {
    getFilesizeInBytes(fromPath).then((fileSize) => {
      const str = progress({ time: 100 });
  
      // wathc for progress and show progress bar in console
      console.log('Task #' + (Number(index)+1))
      str.on('progress', (progress) => {
        const percentage = ((progress.transferred*100) / fileSize).toFixed(0)
        showProgressBar(percentage)
      });
      
      const options = {
        transform(read, write) {
          read.pipe(str).pipe(write)
          write.on('close', () => {
            res('success')
          })
        }
      }
  
      ncp(fromPath, toPath, options, function (err) {
        if (err) {
          return console.error(err);
        }
      });
    })
  })
}

function getFilesizeInBytes(filename) {
  return new Promise((res) => {
    const stats = fs.statSync(filename)
  
    if (stats.isDirectory()) {
      getFolderSize(filename, (err, size) => {
        if (err) { console.log(err); }
        res(size)
      });

    } else if(stats.isFile()) {
      res(stats["size"])
    }
  })
}

function showProgressBar(currentValue) {
  crimsonProgressBar.renderProgressBar(
    currentValue, 
    100, 
    "green", 
    "red", 
    "■", 
    "□", 
    false
  );  
}



