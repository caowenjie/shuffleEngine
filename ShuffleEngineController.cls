public class ShuffleEngineController {
	//上限値を設定
    public static Integer PEEKMAX = 5; 
    
    @AuraEnabled
    public static List<String> setSongList() {
        //私の歌リストを作成して返す
        List<String> songList = new List<String> {
            'song1',
            'song2',
            'song3',
            'song4',
            'song5',
            'song6',
            'song7',
            'song8',
            'song9',
            'song10',
            'song11',
            'song12'
        };
        return songList;
    }

    @AuraEnabled
    public static List<String> createPlaySongList(List<String> songCopyList) {
        //上限値より少ない場合、歌リストを返す
        if (songCopyList.size() <= PEEKMAX) return songCopyList;
        
        //PEEKMAXの数を上限として歌予約リストを作成して返す
        List<String> songCopys = new List<String>();
        while (songCopys.size() < PEEKMAX){
                Integer index = (Math.random() * (songCopyList.size() - 1)).intValue();
                songCopys.add(songCopyList.remove(index));
        }
    	return songCopys;
    }
}