({
    doInit : function(component, event) {
        //歌リストを取得する
        var action = component.get("c.setSongList");
		action.setCallback(this, function(response) {
            var state = response.getState();
			if (state === "SUCCESS") {
                //私の歌リストに値をセット
                component.set("v.songs", response.getReturnValue());
            }
		});
		$A.enqueueAction(action);
	},
    doShuffle : function(component, event) {
        //歌予約リストを取得
        var action = component.get("c.createPlaySongList");
        action.setParams({ "songCopyList" : component.get("v.songs") });
		action.setCallback(this, function(response) {
            var state = response.getState();
			if (state === "SUCCESS") {
				var songsCopyList = component.get("v.songs");
                var songsPlayingList = response.getReturnValue();
                component.set("v.nextSong", songsPlayingList[0]);
                component.set("v.songsPlaying", songsPlayingList);
                component.set("v.isPlaying", true);
                
                //私の歌リストから歌予約リストを除外する処理
                songsCopyList = songsCopyList.filter( function( el ) {
                  return songsPlayingList.indexOf( el ) < 0;
                } );
                component.set("v.songsCopy", songsCopyList);
            }
        });
        $A.enqueueAction(action);
	},
    doNextSong : function(component, event) {
        //再生中歌を取得
        var nextSong = component.get("v.nextSong");
        //歌予約リストを取得
        var songsPlayList = component.get("v.songsPlaying");
        //歌予約リストから再生中歌を削除
        for(var i=0; i<songsPlayList.length; i++){
            if(songsPlayList[i] == nextSong){
                songsPlayList.splice(i--, 1);
            }
        }
        //歌予約リストが空ではない場合、歌予約リストから歌を取得
        if(songsPlayList.length >0){
            component.set("v.nextSong", songsPlayList[0]);            
        }else{        
            //歌シャッフルリストを取得
            var songsCopyList = component.get("v.songsCopy");
            //歌シャッフルリストが空の場合
            if(songsCopyList.length == 0){
                alert("もう一回シャッフルしてください");
                component.set("v.isPlaying", false);
            }else{
                //歌予約リストを取得
                var action = component.get("c.createPlaySongList");
                action.setParams({ "songCopyList" : component.get("v.songsCopy") });
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var songsPlayingList = response.getReturnValue();
                        component.set("v.nextSong", songsPlayingList[0]);
                        component.set("v.songsPlaying", songsPlayingList);
                        
                        songsCopyList = songsCopyList.filter( function( el ) {
                          return songsPlayingList.indexOf( el ) < 0;
                        } );
                        component.set("v.songsCopy", songsCopyList);
                    }
                });
                $A.enqueueAction(action);
        	}
        }
	}
})