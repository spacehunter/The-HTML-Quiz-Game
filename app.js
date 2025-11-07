/**
 * HTML5 Elements Quiz - Modern ES6+ Version
 * Modernized from legacy AngularJS/jQuery codebase
 */

class QuizApp {
  constructor() {
    this.elements = 'data,html,head,title,base,link,meta,style,script,noscript,body,article,nav,aside,section,header,footer,h1,h2,h3,h4,h5,h6,hgroup,address,p,hr,pre,blockquote,ol,ul,li,dl,dt,dd,figure,figcaption,div,table,caption,thead,tbody,tfoot,tr,th,td,col,colgroup,form,fieldset,legend,label,input,button,select,datalist,optgroup,option,textarea,keygen,output,progress,meter,details,summary,command,menu,del,ins,img,iframe,embed,object,param,video,audio,source,canvas,track,map,area,a,em,strong,i,b,u,s,small,abbr,q,cite,dfn,sub,sup,time,code,kbd,samp,var,mark,bdi,bdo,ruby,rt,rp,span,br,wbr'.split(',');
    this.solvedList = [];
    this.timeLeft = 300000; // 5 minutes in milliseconds
    this.timer = null;
    this.finished = false;
    this.currentView = 'intro';

    this.init();
  }

  init() {
    this.setupRouting();
    this.renderView();
    window.addEventListener('hashchange', () => this.handleRouteChange());
  }

  setupRouting() {
    if (!window.location.hash) {
      window.location.hash = '#/';
    }
  }

  handleRouteChange() {
    const hash = window.location.hash;

    if (hash === '#/play') {
      this.currentView = 'play';
      this.startQuiz();
    } else {
      this.currentView = 'intro';
      this.resetQuiz();
    }

    this.renderView();
  }

  renderView() {
    const appContainer = document.getElementById('app-container');

    if (this.currentView === 'intro') {
      appContainer.innerHTML = this.getIntroHTML();
    } else if (this.currentView === 'play') {
      appContainer.innerHTML = this.getPlayHTML();
      this.setupPlayView();
    }
  }

  getIntroHTML() {
    return `
      <div id="intro">
        <h2>How To Play</h2>
        <p>On the next screen, enter as many HTML5 elements as you can think of within five minutes. Correct answers will automatically be logged as you type within the input field. Once your time is up, any elements you missed will be listed so you can improve for next time!</p>
        <h2>One more thing…</h2>
        <p>This quiz was originally created by <a href="//kevinsweeney.info" rel="author" target="_blank">Kevin Sweeney</a> and has been modernized with vanilla JavaScript. Challenge yourself and see how many HTML5 elements you know!</p>
        <a href="#/play"><button type="button" id="start_button" title="Let's do this!">Let's do this!</button></a>
      </div>
    `;
  }

  getPlayHTML() {
    if (this.finished) {
      return this.getOutroHTML();
    }

    return `
      <div id="quiz">
        <div id="clock" class="${this.timeLeft < 60000 ? 'warning' : ''}">5:00</div>
        <input
          id="input"
          type="text"
          placeholder="Type an HTML element..."
          autocomplete="off"
          aria-label="HTML element input"
        >
        <p><b id="remaining">${this.elements.length}</b> elements remaining</p>
        <ul id="solved" class="element_list" aria-label="Solved elements"></ul>
      </div>
    `;
  }

  getOutroHTML() {
    return `
      <div id="outro">
        <h2>Finished!</h2>
        <p>You named <strong id="named">${this.solvedList.length}</strong> HTML5 elements in five minutes!</p>
        <div id="share">
          <h2>Share Your Score</h2>
          <div class="share_item">
            <button
              type="button"
              class="share-button twitter"
              onclick="window.open('https://twitter.com/intent/tweet?text=I%20named%20${this.solvedList.length}%20HTML5%20elements%20in%205%20minutes!%20Can%20you%20beat%20my%20score?&url=' + encodeURIComponent(window.location.origin), '_blank', 'width=550,height=420')"
            >
              Share on Twitter
            </button>
          </div>
          <div class="share_item">
            <button
              type="button"
              class="share-button facebook"
              onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.origin), '_blank', 'width=550,height=420')"
            >
              Share on Facebook
            </button>
          </div>
        </div>
        <p id="missed_message">You missed the following elements:</p>
        <ul id="missed_elements" class="element_list">
          ${this.elements.map(el => `<li>${el}</li>`).join('')}
        </ul>
        <a href="#/"><button type="button" id="replay">Again?</button></a>
      </div>
    `;
  }

  setupPlayView() {
    const input = document.getElementById('input');
    if (input) {
      input.addEventListener('input', (e) => this.handleInput(e));
      input.focus();
    }
  }

  startQuiz() {
    if (this.timer) return; // Already started

    this.timer = setInterval(() => this.tick(), 1000);
    this.updateClock();
  }

  resetQuiz() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.elements = 'data,html,head,title,base,link,meta,style,script,noscript,body,article,nav,aside,section,header,footer,h1,h2,h3,h4,h5,h6,hgroup,address,p,hr,pre,blockquote,ol,ul,li,dl,dt,dd,figure,figcaption,div,table,caption,thead,tbody,tfoot,tr,th,td,col,colgroup,form,fieldset,legend,label,input,button,select,datalist,optgroup,option,textarea,keygen,output,progress,meter,details,summary,command,menu,del,ins,img,iframe,embed,object,param,video,audio,source,canvas,track,map,area,a,em,strong,i,b,u,s,small,abbr,q,cite,dfn,sub,sup,time,code,kbd,samp,var,mark,bdi,bdo,ruby,rt,rp,span,br,wbr'.split(',');
    this.solvedList = [];
    this.timeLeft = 300000;
    this.finished = false;
  }

  handleInput(event) {
    const value = event.target.value.trim().toLowerCase();
    const index = this.elements.indexOf(value);

    if (index !== -1) {
      this.elements.splice(index, 1);
      this.solvedList.push(value);
      event.target.value = '';

      // Update UI
      this.updateSolvedList();
      this.updateRemaining();

      // Check if all elements found
      if (this.elements.length === 0) {
        this.stopQuiz();
      }
    }
  }

  tick() {
    this.timeLeft -= 1000;

    if (this.timeLeft <= 0) {
      this.stopQuiz();
      return;
    }

    this.updateClock();
  }

  updateClock() {
    const clockEl = document.getElementById('clock');
    if (!clockEl) return;

    const minutes = Math.floor(this.timeLeft / 60000);
    const seconds = Math.floor((this.timeLeft % 60000) / 1000);
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    clockEl.textContent = formattedTime;

    if (this.timeLeft < 60000) {
      clockEl.classList.add('warning');
    }
  }

  updateSolvedList() {
    const solvedEl = document.getElementById('solved');
    if (!solvedEl) return;

    const li = document.createElement('li');
    li.textContent = this.solvedList[this.solvedList.length - 1];
    solvedEl.appendChild(li);
  }

  updateRemaining() {
    const remainingEl = document.getElementById('remaining');
    if (remainingEl) {
      remainingEl.textContent = this.elements.length;
    }
  }

  stopQuiz() {
    clearInterval(this.timer);
    this.timer = null;
    this.finished = true;
    this.renderView();
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.quizApp = new QuizApp();
  });
} else {
  window.quizApp = new QuizApp();
}
