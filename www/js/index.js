/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        $("#urlInput").hide();
        $('#submit_btn').hide();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        var networkState = navigator.connection.type;
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';
        console.log('Connection type: ' + states[networkState]);
        
    },
    // Update DOM on a Received Event
    receivedEvent: function() {
     window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.onFileSystemSuccess, app.fail);
        // add music drop down
        $(".addMusic").on('click', function(){
            $("#urlInput").show();
            $('#submit_btn').show();
        })
        // back button
        $(".backButton").on('click', function(){
           $('#musicPage').hide();
           $('#home').show();
       })
        // load music
        $(".loadedMusicList").on('click', function(){
            $('#home').hide();
            $('#musicPage').show();
        })
        // when url podcast is entered and submit is clicked 
        document.getElementById('submit_btn').addEventListener('click', this.downloadMusic, false);
    },
    downloadMusic: function(){
       
// are you online...if you are, run this: (if your not error mesg)
        var request = new XMLHttpRequest();
        request.open("GET", (urlInput.value));
        //console.log(request);
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                if (request.status == 200 || request.status == 0) {
                    var music = request.responseXML;
                    console.log(music);
            // loop through entries and add 1 podcast if less then 2
            for(var m = 0; m <2; m++ ){
                    var transfer = new FileTransfer();
                      // display file name without ascii stuff
                      //var weirdChar = "#@{}><?:!;123456789."
                      var title=$(music).find('item>enclosure').eq(m).attr('url');
                      
                     console.log("THIS IS THE Title: " + title);
                      // for(var i = 0; i < weirdChar.length; i++){
                      //   console.log(weirdChar[i]);
                      //   console.log($(music).find('item>title').eq(m).text().indexOf(weirdChar[i]));
                        
                        // if($(music).find('item>title').eq(m).text().indexOf(weirdChar[i])>-1){
                        //     title=title.replace(weirdChar[i], ' ')
                        //     console.log(title);
                        // }
                    
                    var tempName = title;
                     var tempName = tempName.substring(tempName.lastIndexOf("/")+1);
                     // temp folder, change to local??
                     var fileURL = cordova.file.externalRootDirectory + '/' + tempName;
                    console.log("fileURL: " + fileURL);
                     
                     // MP3 music here
                     var uri = encodeURI($(music).find("item>enclosure").eq(m).attr('url'));
                     transfer.download(uri, fileURL, function(entry) {
                        console.log("download complete: " + entry.toURL() );
                        },
                        function(error) {
                            console.log(error.code);
                            console.log("download error code" + error.source);
                            console.log("download error code" + error.target);
                        },
                        false,
                        {
                            headers: { "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                        }
                    });
}// end of crazy 2 pod casts loop
                 }
             }
             alert("you are not online");
         }
         request.send();
    },// end of downloadMusic
    onFileSystemSuccess: function(fileSystem) {
        fileSystem.root.getDirectory("", {create: false, exclusive: false}, app.getDirSuccess, app.fileSystemFail);
        console.log(fileSystem.name);
        console.log(fileSystem.root.name);
        // if user enters wrong 
        $("#urlInput").blur(function() {
            if($(this).val() == ''){
                alert('Please Enter a valid URL'); 
            }else{
               $("#submit_btn").on('click', function(){
                $("#urlInput").hide();
                     //$('#inputButton').closest('submit_btn').show();
                     $('#submit_btn').hide();
                 })
           }
       });
    },
    fileSystemFail: function(){
        console.log("filesystem failed")
    },
    fail: function(evt) {
        console.log(evt.target.error.code);
    },
    getDirSuccess: function(dirEntry) {
    // Get a directory reader
    var directoryReader = dirEntry.createReader();
        // Get a list of all the entries in the directory
        directoryReader.readEntries(app.readerSuccess,app.readerDirectoryFail);
    },
    readerDirectoryFail:function(){
        console.log("readerDirectoryFail")
    },
    readerSuccess: function(entries) {
        var mp3File = [];
        
        for (var i=0; i<entries.length; i++) {
            var fileName = entries[i].name;
            if(fileName.indexOf(".mp3") == (fileName.length - 4))
            {
                mp3File.push(fileName );
                console.log(fileName);
            }
        }
        if(mp3File.length>0){
            for(var m=0; m<mp3File.length; m++){
                $(".loadedMusicList").append("<li>" + mp3File[m] + "</li>" );
            }
            
        }
        
        $('.loadedMusicList li').bind('click', app.whatEverPlayFunciton);
    },






whatEverPlayFunciton: function(){
    
    var secondsPosition = 0;




    console.log("played DUDE");   
    console.log( $(this).text());
    //app.audioControls();
     var my_media = new Media( cordova.file.externalRootDirectory +$(this).text(),
    //successcallback
    function(){
        console.log("playAudio():AudioSuccess");
    },
    //errorcallback
    function(err){
        console.log("playAudio():AudioError:"+err);
    }
    );        

 $('#audioPlay').off('click');
    $('#audioPlay').click(function(){
     
        my_media.play();
        console.log("media play");
    });

    $('#audioPause').click(function(){

        my_media.pause();
        console.log("media pause");

    });


    console.log("THIS IS THE PLAY");



    $('#mediaPosition').click(function(){ 
   
    console.log("Media position function");    


  //  var mediaTimer = setInterval (function(){
  //      console.log("media position next:")
        my_media.getCurrentPosition(
            function(position){
                if(position >-1){
                    console.log((position)+" sec");
                }
            },
            function(e){
                console.log("Errorgettingpos="+e);
            }
            );

    

    //}, 10000);
    
    //clearInterval(mediaTimer);

    });


    $('#forwardSkip').click(function(){

        // this is the amount to skip forward
        var z = 30000;
        // this is the current position
        var y = 0;

        my_media.getCurrentPosition(
            function(position){
                if(position >-1){
                    y = position;
                }
            },
            function(e){
                console.log("Errorgettingpos="+e);
            }
        );

        // console.log(y);
        // secondsPosition = my_media.getCurrentPosition();
        //my_media.seekTo(my_media.getCurrentPosition() + 15000);
        y = y * 1000;
        my_media.seekTo(z + y);

    });
 
    $('#backSkip').click(function(){

        // this is the amount to skip forward
        var z = -15000;
        // this is the current position
        var y = 0;

        my_media.getCurrentPosition(
            function(position){
                if(position >-1){
                    y = position;
                }
            },
            function(e){
                console.log("Errorgettingpos="+e);
            }
        );

        // console.log(y);
        // secondsPosition = my_media.getCurrentPosition();
        //my_media.seekTo(my_media.getCurrentPosition() + 15000);
        y = y * 1000;

        if (y < 15000){
            my_media.seekTo(0);
        } else{

        my_media.seekTo(z + y);

        }


    });


    $(".backButton").on('click', function(){
        my_media.release();
    });
    

    /*

    podcast kill function

    so if you set the get duration and get position and if it one second to ending you would delete it from the system.
    now the question is how do you call it.

    you could call the get position at an interval, that interval could be the length of the time.
    have function here that would 

    what if you called it right here for the get durcation then had the fuction right under it to release 



    */




    $('#audioPlay').click(function(){
     
        my_media.play();
        console.log("media play");
 


        // get duration function

        var mediaDuration = my_media.getDuration();

        var mediaPositionCalc = 0; 
        var currentStuff = 0;


        // this might need to be an interval.
        currentStuff = my_media.getCurrentPosition(
            function(position){
                if(position >-1){


                    // might need to convert to milliseconds
                     mediaPositionCalc = position ;


                }
            },
            function(e){
                console.log("Errorgettingpos="+e);
            }
        );


        console.log(mediaDuration);

        console.log(mediaPositionCalc);

        console.log("This is the duration minus the position: ", (mediaDuration - mediaPositionCalc) );



        // subtract mediaPositionCalc from the total time and if it is within 5 seconds or something
        if ( (mediaDuration - mediaPositionCalc) < 10  ){
            // set it to do the math to distroy it between a seond and a tenth of a second of the end.
            //shut down function
            console.log("IF YOU SEE THIS THIS IS WITHIN THE IF STATEMENT!!!!!!!!!!!!!!!");            


            //Updatemediapositioneverysecond
            varmediaTimer=setInterval(function(){
            
            //getmediaposition
            
            my_media.getCurrentPosition(
            function(position){
                if( (mediaDuration - position) < 2){
                    console.log("podcast is kill"); 

                    // killing the podcast
                    my_media.release();




                }
            },
            function(e){
                console.log("Errorgettingpos="+e);
            }
            );
            },1);
            




        }

   });


        $(".backButton").click(function(){

            my_media.release();

        });


        


}


}


app.initialize();











