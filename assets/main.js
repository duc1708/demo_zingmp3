const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const btnPlay = $('.btn-toggle-play')
const player = $('.player')
const progress = $("#progress")
const btnNext = $(".btn-next")
const btnPrev = $(".btn-prev")
const randomBtn = $(".btn-random")
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
// Dữ liệu của bài hát 

const app = {

    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat: false,
    songs :[
        {
            name: "Âm thầm bên em",
            singer: " Son Tung",
            path: 'assets/audio/y2mate.com - Âm Thầm Bên Em.mp3',
            image: 'assets/images/img1.jpg'
        },
        {
            name: "Nơi này có anh",
            singer: " Sơn Tùng",
            path: 'assets/audio/y2mate.com - NƠI NÀY CÓ ANH  OFFICIAL MUSIC VIDEO  SƠN TÙNG MTP.mp3',
            image: 'assets/images/img2.jpg'
        },
        {
            name: "Chúng ta của hiện tại",
            singer: " Sơn Tùng",
            path: 'assets/audio/y2mate.com - Chúng Ta Của Hiện Tại.mp3',
            image: 'assets/images/img3.jpg'
        },
        {
            name: "Muộn rồi mà sao còn",
            singer: " Sơn Tùng",
            path: 'assets/audio/y2mate.com - SƠN TÙNG MTP  MUỘN RỒI MÀ SAO CÒN  OFFICIAL MUSIC VIDEO.mp3',
            image: 'assets/images/img4.jpg'
        },
        {
            name: "Hãy trao cho anh",
            singer: " Sơn Tùng",
            path: 'assets/audio/y2mate.com - SƠN TÙNG MTP  HÃY TRAO CHO ANH ft Snoop Dogg  Official MV.mp3',
            image: 'assets/images/img5.jpg'
        },
        {
            name: "khuôn mặt đáng thương",
            singer: " Sơn Tùng",
            path: 'assets/audio/y2mate.com - Khuôn mặt đáng thương  Sơn Tùng MTP.mp3',
            image: 'assets/images/img6.jpg'
        },


    ],

    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return `
                <div class="song ${index === this.currentIndex ? 'active': ''} " data-index = "${index}" >
                    <div class = "thumb"
                        style ="background-image:url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class= "option">
                        <i class = "fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get:function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents : function(){
        const cdWidth = cd.offsetWidth;
        const _this = this

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate(
            [
                { transform: 'rotate(0deg)' },
                { transform: 'rotate(360deg)' }
            ],
            {
                duration: 20000, // thay đổi duration thành 20000 để quay trong vòng 20 giây
                iterations: Infinity
            }
        );
        cdThumbAnimate.pause()


        // Xử lý phóng to thu nhỏ phần Cd
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop;
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0;
            cd.style.opacity =  newcdWidth /  cdWidth 
        }

        // Xử lý khi play bài hát
        btnPlay.onclick = function(){

            if (_this.isPlaying) {
                audio.pause();
                
            } else {
                audio.play();
            }
        }

        // 
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing');
            cdThumbAnimate.play()

        }

        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing');
            cdThumbAnimate.pause()
            
        }

        // Khi tiến độ  bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent;
            }
        }

        // Xử lý khi tua nhạc
        progress.onchange = function(e){
           audio.currentTime = e.target.value * audio.duration / 100
        }

        // Next song
        btnNext.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
        }

        // Prev song
        btnPrev.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }

        randomBtn.onclick = function(){
            randomBtn.classList.add('active')
        }

        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active',_this.isRandom)
        }

        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }

        // Xử lý khi hết bài
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                btnNext.click()
            }
        }

        // Xử lý khi click vào bài hát 
        playlist.onclick = function(e){

            const songNode = e.target.closest('.song:not(.active')
            if(songNode|| e.target.closest('.option')){
             
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }

                if(e.target.closest('.option')){

                }
            }
        }
    },

    loadCurrentSong : function(){
       
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong : function(){
        this.currentIndex++
        if(this.currentIndex>= this.songs.length){
            this.currentIndex = 0
        }

        this.loadCurrentSong()
    },

    prevSong : function(){
        this.currentIndex--
        console.log(this.currentIndex,this.songs.length)
        if(this.currentIndex <0 ){
            this.currentIndex = this.songs.length-1
        }

        this.loadCurrentSong()
    },

    randomSong : function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex ===this.currentIndex)
        this.currentIndex = newIndex

        this.loadCurrentSong()
    },

    start : function(){
        this.handleEvents()
        this.defineProperties()
        this.loadCurrentSong()
        this.render()
    }

    
};

app.start();
