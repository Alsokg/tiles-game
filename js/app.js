var app;
$(document).ready(function(){
  var colors = [{
		"hex": "#009380"
	}, {
		"hex": "#663399"
	}, {
		"hex": "#d2a87e"
	}, {
		"hex": "#cb213d"
	}, {
		"hex": "#4785f4"
	}, {
		"hex": "#8ae32b"
	}, {
		"hex": "#208a18"
	}, {
		"hex": "#0000ff"
	}, {
		"hex": "#e25e75"
	}, {
		"hex": "#f4c0ff"
	}, {
		"hex": "#171515"
	}, {
		"hex": "#c8b03e"
	}, {
		"hex": "#084f3d"
	}, {
		"hex": "#6699cc"
	}, {
		"hex": "#00b0b6"
	}, {
		"hex": "#854442"
	}, {
		"hex": "#627e45"
	}]

//simple modal
  $('.overlay').hide();
  $('.overlay .msg a').click(function(e){
    e.preventDefault();
    $('.overlay').hide();
  })
var arr = [];
var finishedIndex = 0;
//one tile 
var Tile = React.createClass({
  propTypes: {
    data: React.PropTypes.shape({
      color: React.PropTypes.string
    }),
    finish: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      visible: false, //show or not tile 
      finished: false //final state (correct)
    };
  },
  tileHide: function(){
    
  },
  tileClick: function(e) {
    e.preventDefault();
    if( this.state.visible === false){
      this.setState({visible: true});
      var $opened = $('.open');
      arr[$opened.length] = this;
      if($opened.length > finishedIndex) {
        if(arr[finishedIndex] != null && arr[finishedIndex + 1] != null && arr[finishedIndex].props.data.hex != arr[finishedIndex + 1].props.data.hex) {
          $('.tiles').bind('click', function(e){
            stop(e)
          });
          setTimeout(function(){
            arr[finishedIndex].setState({visible: false});
            arr[finishedIndex + 1].setState({visible: false});
            arr.splice(finishedIndex, 1);
            arr.splice(finishedIndex + 1, 1);
            $('.tiles').unbind('click');
          }, 1000);
        }else{
          arr[finishedIndex].setState({finished: true, opacity: 0.1});
          arr[finishedIndex + 1].setState({finished: true, opacity: 0.1});
          finishedIndex += 2;
          if(parseInt(this.props.finish) == finishedIndex){
            $('.overlay').show();
          }
        }
      }
    }
  },
  render: function() {
    var color = this.props.data.hex,
        visible = this.state.visible,
        finished = this.state.finished,
        classes,
        containerClass = '';
    var style = {
      'backgroundColor': ''
    };
    if (visible) {
      classes = 'open flipInY';
      style = {
        'backgroundColor': color,
      };
    }else{
      classes = 'tran';
    }
    if(finished){
      containerClass = " good";
    }  
    else
      containerClass = "";
    return (
      <div className={'tile' + containerClass}>
        <a href="#"
          onClick={this.tileClick}
          className={'btn animated '  + classes }
          style={style}>
          {color}
        </a>
      </div>
    )
  }
});

//game class, tiles + controls
var Game = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired, //tiles value array
    size: React.PropTypes.string.isRequired //number of tiles
  },
  render: function() {
    var size = this.props.size;
    var data = this.props.data.slice(0, size/2);//cut array to valid size
    var duplicate = data;
    var bigTiles = data.concat(duplicate);//make copy for tile  
    
    var tiles;// tiles objects
    tiles = bigTiles.map(function(item, index) {
      return (
        <Tile key={index} data={item} finish={size}/>
      )
    });
      
    shuffle(tiles);//random order for tiles
    return (
      <div className='tiles'>
        {tiles}
      </div>
    );
  }
});

var App = React.createClass({
  render: function() {
    return (
      <div className='app'>
        <Game data={colors} size="16"/>
        <Restart />
      </div>
    );
  }
});

var Restart = React.createClass({
  getInitialState: function() {
    return {
      showit: false
    };
  },
  restartClick: function(e){
    e.preventDefault();
    arr.forEach(function(item, i, arr) {
      if(arr[i] != null){
        arr[i].setState({finished: false, visible: false});
      }
    });
    arr = [];
    finishedIndex = 0;
    setTimeout(function(){
      app = ReactDOM.render(
      <App></App>,
      document.getElementsByClassName('app-tiles-game')[0]
    );
    }, 500)
    
  },
  helpChange: function(input){
      
    if(this.state.showit == false){
      this.setState({showit: true});
      $('.tile > a').addClass('help');
    } else{
      this.setState({showit: false});
      $('.tile > a').removeClass('help');
    }
  },
  render: function(){
    return(
      <div className="controls">
			  <a href="#" onClick={this.restartClick} class="restart">restart</a>
			  <label htmlFor="help">Test Options</label>
			  <input onChange={this.helpChange} id="help" name="help" type="checkbox" />
		  </div>
		);
  }
});


app = ReactDOM.render(
  <App></App>,
  document.getElementsByClassName('app-tiles-game')[0]
);

   
});

function stop(e){e.stopPropagation()}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

