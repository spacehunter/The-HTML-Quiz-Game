/* Main App Controller
 */

MainCtrl = function($route, $location) { this.$route = $route; this.$location = $location }
MainCtrl.prototype = {

	name:"MainCtrl",
	template: 'intro.html',

	init: function(){
		this.$route.when('/:cat');
		this.$route.otherwise({redirectTo: '/'});
		
		this.$route.onChange(function(){

			this.$route.current.template = this.template;
			var hash = this.$location.hash;

			if( hash == "/play" ){
				this.$route.current.template = 'play.html';
			} 
		});

		this.$route.parent(this);
	}
}

PlayCtrl = function(){}
PlayCtrl.prototype = {
	name: "PlayCtrl",
	elementList: 'data,html,head,title,base,link,meta,style,script,noscript,body,article,nav,aside,section,header,footer,h1,h2,h3,h4,h5,h6,hgroup,address,p,hr,pre,blockquote,ol,ul,li,dl,dt,dd,figure,figcaption,div,table,caption,thead,tbody,tfoot,tr,th,td,col,colgroup,form,fieldset,legend,label,input,button,select,datalist,optgroup,option,textarea,keygen,output,progress,meter,details,summary,command,menu,del,ins,img,iframe,embed,object,param,video,audio,source,canvas,track,map,area,a,em,strong,i,b,u,s,small,abbr,q,cite,dfn,sub,sup,time,code,kbd,samp,var,mark,bdi,bdo,ruby,rt,rp,span,br,wbr',
    second: 1000,
    timeLeft: 300000,
    elements: null,
    solvedList: null,
    timer: null,
    finish: false,
    formattedTime: null,
    warning: null,

	init: function(){
		this.solvedList = [];
		this.elements = this.elementList.split(',');
		this.timer = setInterval(this.tick, this.second);
	},

	onInputChange: function(){
		var val = this.input;
		var index = this.elements.indexOf(val);

        if (index !== -1) {
            this.elements.splice(index, 1);
            this.solvedList.push(val);
            this.input = null;
        }
	},

	tick: function () {
	    this.timeLeft -= this.second;

	    if (this.timeLeft <= 0) {
	        this.stopQuiz();
	    }

	    this.formatTime(this.timeLeft);
	    this.$root.$eval();	    
	},

	formatTime: function(ms) {
	    var x,
	        seconds,
	        minutes,
	        number;

	    x = ms / 1000;
	    seconds = x % 60;
	    x /= 60;
	    minutes = Math.floor(x % 60);

	    if (seconds < 10) {
	    	seconds = '0' + seconds;
	    }

	    if (minutes < 1) {
	        this.warning = 'warning';
	    }

	    this.formattedTime = [minutes, seconds].join(':');
	},
	
	stopQuiz: function() {
		clearInterval(this.timer);
		this.finish = true;
	}
}
