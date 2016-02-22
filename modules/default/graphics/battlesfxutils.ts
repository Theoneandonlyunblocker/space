module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module BattleSFXFunctions
      {
        // export function makeVideo(videoSrc: string, props: Rance.Templates.SFXParams)
        // {
        //   var video = document.createElement("video");

        //   var canvas = document.createElement("canvas");
        //   var ctx = canvas.getContext("2d");

        //   var maskCanvas = document.createElement("canvas");
        //   var mask = maskCanvas.getContext("2d");
        //   mask.fillStyle = "#000";
        //   mask.globalCompositeOperation = "luminosity";


        //   var onVideoLoadFN = function()
        //   {
        //     canvas.width = video.videoWidth;
        //     canvas.height = video.videoHeight;
        //     maskCanvas.width = canvas.width;
        //     maskCanvas.height = canvas.height;

        //     props.onLoaded(canvas);
        //     video.play();
        //   }

        //   var _: any = window;
        //   if (!_.abababa) _.abababa = {};
        //   if (!_.abababa[videoSrc]) _.abababa[videoSrc] = {}
        //   var computeFrameFN = function(frameNumber: number)
        //   {
        //     if (!_.abababa[videoSrc][frameNumber])
        //     {
        //       var c3 = document.createElement("canvas");
        //       c3.width = canvas.width;
        //       c3.height = canvas.height;
        //       var ctx3 = c3.getContext("2d");

        //       ctx3.drawImage(video, 0, 0, c3.width, c3.height);

        //       var frame = ctx3.getImageData(0, 0, c3.width, c3.height);

        //       mask.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        //       mask.drawImage(video, 0, 0, c3.width, c3.height);

        //       var maskData = mask.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;

        //       var l = frame.data.length / 4;
        //       for (var i = 0; i < l; i++)
        //       {
        //         frame.data[i * 4 + 3] = maskData[i * 4];
        //       }

        //       ctx3.putImageData(frame, 0, 0);
        //       _.abababa[videoSrc][frameNumber] = c3;
        //     }

        //     ctx.clearRect(0, 0, canvas.width, canvas.height);
        //     if (!props.facingRight)
        //     {
        //       ctx.scale(-1, 1);
        //     }
        //     ctx.drawImage(_.abababa[videoSrc][frameNumber], 0, 0, canvas.width, canvas.height);
        //   }
        //   var previousFrame: number;

        //   var playFrameFN = function()
        //   {
        //     if (video.paused || video.ended) return;
        //     var currentFrame = Math.round(roundToNearestMultiple(video.currentTime, 1 / 25) / (1 / 25));
        //     if (isFinite(previousFrame) && currentFrame === previousFrame)
        //     {
              
        //     }
        //     else
        //     {
        //       previousFrame = currentFrame;
        //       computeFrameFN(currentFrame);
        //     }
        //     window.requestAnimationFrame(playFrameFN);
        //   }

        //   video.oncanplay = onVideoLoadFN;
        //   video.onplay = playFrameFN;

        //   video.src = videoSrc;

        //   if (video.readyState >= 4)
        //   {
        //     onVideoLoadFN();
        //   }

        //   return canvas;
        // }
      }
    }
  }
}
