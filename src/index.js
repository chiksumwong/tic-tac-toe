import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// import App from './App';
// import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

  // 判断游戏获胜方的算法函数
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

//函数定义组件
  function Square(props) {
      return (
        // when onClick, call the function which is handleClick() on "parent component" (Board)
        <button className="square" onClick={props.onClick}>
          {props.value}
        </button>
      );
  }
  
/* Components */
  /* 当你遇到需要同时获取多个"子组件"(Square)数据，或者两个组件之间需要相互通讯的情况时，
     把子组件的 state 数据提升至其"共同的父组件"(Board)当中保存。
     之后父组件"(Board)可以通过 props 将状态数据传递到"子组件"(Square)当中。
     这样应用当中的状态数据就能够更方便地交流共享了。 
     *change to from Game(parent) to Board(child) now
  */
  class Board extends React.Component {
    renderSquare(i) {
      return( 
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }


  
  class Game extends React.Component {
  /* 把 Board 中的状态数据再提升到 Game 组件中来 */
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,//将 X 默认设置为先手棋,切换 xIsNext 的值以此来实现轮流落子的功能
      };
      /* 在 Board 组件的构造函数中初始化一个包含"9个空值的数组"作为状态数据，
         并将这个数组中的9个元素分别传递到"对应的9个 Square 组件"当中。 
      */
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      
      //.slice() 方法来将之前的数组数据浅拷贝到了一个新的数组中，而不是修改已有的数组
      //目的是记录变化, 很轻松地实现 撤销/重做以及时间旅行
      const squares = current.squares.slice();

      //获胜就就无法继续落子
      if (calculateWinner(squares) || squares[i]) {
        return;
      }

      //which is next player
      squares[i] = this.state.xIsNext ? 'X' : 'O';

      //Change the state
      this.setState({
          history: history.concat([{
            squares: squares
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
  
      //展示每步历史记录链接
      const moves = history.map((step, move) => {
        const desc = move ?
          'Move #' + move :
          'Game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      //
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  