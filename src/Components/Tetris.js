import React, { Component } from 'react';
import GameParams from './GameParams'
import Board from './Board'
import Screen from './Screen'


class Tetris extends Component {

    constructor(){
        super();

        let nextBlock = this.drawNewBlock();
        this.state = {
            matrix: {},
            activeBlock: null,
            level: 1,
            score: 0,
            interval: null,
            nextBlock: nextBlock,
            pause: true,
            gameEnded: false
        };
    }

    componentWillMount(){

        this.initKeys();
        this.initMatrix();
        this.createNewBlock();
    }


    restartGame(){

        this.setState({
            pause: false,
            gameEnded: false,
            level: 1,
            score: 0
        });

        this.startLevel(1);
    }

    initKeys(){
        document.addEventListener('keydown', (e) => {
            if(e.keyCode === 37 && !this.state.pause){
                this.moveBlock('left');
                return true;
            }
            if(e.keyCode === 39 && !this.state.pause){
                this.moveBlock('right');
                return true;
            }
            if(e.keyCode === 38 && !this.state.pause){
                this.turnBlock();
                return true;
            }

            if(e.keyCode === 40 && !this.state.pause){
                this.dropBlock();
                return true;
            }

            if(e.keyCode === 32){
                this.startPauseGame();
                return true;
            }
        });
    }

    startPauseGame() {
        if(this.state.gameEnded){
            this.restartGame();
        }else if(this.state.pause){
            let interval = setInterval(this.gameInterval.bind(this), GameParams.level[this.state.level].speed);
            this.setState({
                interval: interval,
                pause: false
            });
        }else{
            clearInterval(this.state.interval);
            this.setState({
                pause: true
            });
        }
    }

    dropBlock(){
        if(!this.killActiveBlock()) {
            this.moveDownActiveBlock();
            this.dropBlock();
        }
    }

    turnBlock(){
        let activeBlock = this.state.activeBlock;
        let updatedCoordinates = [];
        let mainPixel = activeBlock.coordinates[0];
        updatedCoordinates.push(mainPixel);

        for (let i = 1; i < activeBlock.coordinates.length; i++) {
            let deltaX = activeBlock.coordinates[i].y - mainPixel.y;
            let deltaY = activeBlock.coordinates[i].x - mainPixel.x;

            let newCoordinate = {
                isMain: false,
                x: mainPixel.x + (-1 * deltaX),
                y: mainPixel.y + deltaY
            };

            if(!this.validateCoordinate(newCoordinate)){
                return false
            }

            updatedCoordinates.push(newCoordinate);
        }

        activeBlock.coordinates = updatedCoordinates;

        this.setState({
            activeBlock: activeBlock
        })
    }

    validateCoordinate(point){
        let x = point.x;
        let y = point.y;

        return !(x < 0 || x > GameParams.size.y || !this.state.matrix[y] || this.state.matrix[y][x] !== 0)
    }


    moveBlock(direction){
        let xMove;
        let outOfTheBoard;
        if(direction === 'left'){
            xMove = -1;
            outOfTheBoard = -1
        }else if(direction === 'right'){
            xMove = 1;
            outOfTheBoard = GameParams.size.x + 1
        } else{
            return false;
        }

        if(!this.checkMovePossibility(xMove, outOfTheBoard)){
            return false;
        }
        let activeBlock = this.state.activeBlock;

        for (let i = 0; i < activeBlock.coordinates.length; i++) {
            activeBlock.coordinates[i].x += xMove;
        }

        this.setState({
            activeBlock: activeBlock
        });

        return true
    }

    checkMovePossibility(xMove, outOfTheBoard){
        let activeBlock = this.state.activeBlock;
        for (let i = 0; i < activeBlock.coordinates.length; i++) {
            let y = activeBlock.coordinates[i].y;
            let x = activeBlock.coordinates[i].x + xMove;
            if(x === outOfTheBoard || !this.state.matrix[y] || this.state.matrix[y][x] !== 0){
                return false
            }
        }

        return true
    }

    drawNewBlock(){
        return Math.floor(Math.random() * Object.keys(GameParams.blockTypes).length) + 1
    }

    gameInterval(){
        if(!this.killActiveBlock()) {
            this.moveDownActiveBlock();
        }
    }


    killActiveBlock(){
        let activeBlock = this.state.activeBlock;
        for (let i = 0; i < activeBlock.coordinates.length; i++) {
            let y = activeBlock.coordinates[i].y + 1;
            let x = activeBlock.coordinates[i].x;
            if(y<0){
                continue;
            }
            if(y > GameParams.size.y || (this.state.matrix[y] && this.state.matrix[y][x] !== 0)){
                if(!this.updateMatrix()){
                    this.gameOver();
                }
                this.createNewBlock();
                return true;
            }
        }

        return false;
    }

    updateMatrix(){
        let activeBlock = this.state.activeBlock;
        let matrix = this.state.matrix;
        for (let i = 0; i < activeBlock.coordinates.length; i++) {
            if(matrix[activeBlock.coordinates[i].y] === undefined){
                return false;
            }
            matrix[activeBlock.coordinates[i].y][activeBlock.coordinates[i].x] = activeBlock.type;
        }

        matrix = this.checkIfNewPoints(matrix);

        this.setState({
            matrix: matrix
        });

        return true;
    }

    gameOver(){
        clearInterval(this.state.interval);
        this.startPauseGame();
        this.setState({
            gameEnded: true
        });
    }

    checkIfNewPoints(matrix){

        let fullRows = this.countFullRows(matrix);


        if(!fullRows.length){
            return matrix
        }

        let remainingRows = [];
        for(let rowNo of Object.keys(matrix)){
            if(fullRows.indexOf(rowNo) === -1){
                remainingRows.push(matrix[rowNo]);
            }
        }

        let newMatrix = this.createNewMatrix(remainingRows, fullRows);

        this.updateScore(fullRows);

        return newMatrix
    }

    countFullRows(matrix){
        let fullRows = [];
        for(let rowNo of Object.keys(matrix)){
            let row = matrix[rowNo];
            let isFull = true;
            for (let pixelNo of Object.keys(row)){
                let pixel = row[pixelNo];
                if(pixel === 0){
                    isFull = false;
                    break;
                }
            }
            if(isFull){
                fullRows.push(rowNo);
            }
        }

        return fullRows;
    }

    createNewMatrix(remainingRows, fullRows){
        let newMatrix = {};
        let numberOfDeletedRows = fullRows.length;

        for(let y=1; y<= numberOfDeletedRows; y++){
            newMatrix[y] = {};
            for(let x=1; x<=GameParams.size.x; x++){
                newMatrix[y][x] = 0;
            }
        }
        for(let y=numberOfDeletedRows+1; y<= GameParams.size.y; y++){
            newMatrix[y] = remainingRows.shift();
        }

        return newMatrix;
    }

    updateScore(fullRows){
        let numberOfDeletedRows = fullRows.length;
        let newPoints = GameParams.score.points * GameParams.score.multipleRate^(numberOfDeletedRows-1);
        let score = this.state.score+newPoints;
        if(score >= GameParams.level[this.state.level].points){
           this.nextLevel();
        }

        this.setState({
            score: score
        })

    }

    nextLevel(){
        let level = this.state.level + 1;
        this.startLevel(level);
    }


    startLevel(level){
        this.startPauseGame();
        this.clearMatrix();
        this.setState({
            level: level,
        })
    }



    moveDownActiveBlock(){
        let activeBlock = this.state.activeBlock;
        for (let i = 0; i < activeBlock.coordinates.length; i++) {
            activeBlock.coordinates[i].y += 1;
        }

        this.setState({
            activeBlock: activeBlock
        });
    }

    initMatrix(){
      let matrix = {};

      for(let y=1; y<= GameParams.size.y; y++){
          matrix[y] = {};
          for(let x=1; x<=GameParams.size.x; x++){
              matrix[y][x] = 0;
          }
      }
      this.setState({
          matrix: matrix
      });
    }

    clearMatrix(){
        let matrix = this.state.matrix;

        for(let rowNo of Object.keys(matrix)){
            let row = matrix[rowNo];
            for (let pixelNo of Object.keys(row)){
                matrix[rowNo][pixelNo] = 0;
            }
        }
        this.setState({
            matrix: matrix
        });
    }

    createNewBlock(){
        let start = GameParams.newBlockPosition;
        let type = this.state.nextBlock;
        let block = {
            type: type,
            coordinates: [
                {x: start.x, y: start.y, isMain: true}
            ]
        };
        GameParams.blockTypes[type].forEach(point => {
            block.coordinates.push({
                x: start.x + point.x,
                y: start.y + point.y,
                isMain: false
            })
        });
        let nextBlock = this.drawNewBlock();

        this.setState({
           nextBlock: nextBlock,
           activeBlock: block
        });
    }

    getPopup(){
        let popup = '';
        if(this.state.gameEnded){
            popup = <div className='popup'>
                <div className='popup-box'>
                    <div className='level-info game-ovre'>GAME OVER!</div>
                    <div className='level-info game-ovre'>LEVEL {this.state.level}, SCORE: {this.state.score}</div>
                    <div className='level-info game-ovre'>PRESS SPACE TO PLAY AGAIN</div>
                </div>
            </div>
        }else if(this.state.pause) {
            popup = <div className='popup'>
                <div className='popup-box'>
                    <div className='level-info'>LEVEL {this.state.level}</div>
                    <div className='level-info'>PRESS SPACE TO PLAY</div>
                </div>
            </div>
        }

        return popup;
    }

    render() {
        let popup = this.getPopup();
        return (
            <div className='main-container'>
                <Screen score={this.state.score} level={this.state.level} nextBlock={this.state.nextBlock}/>
                <br/>
                <Board matrix={this.state.matrix} activeBlock={this.state.activeBlock}/>
                {popup}
            </div>
        );
    }
}

export default Tetris;
