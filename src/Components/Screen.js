import React, { Component } from 'react';
import GameParams from './GameParams'


class Screen extends Component {

    constructor(){
        super();
        this.smallMatrix = this.createSmallMatrix();
    }

    showNextBlock(){
        let matrix = this.smallMatrix;
        let nextBlock = this.createNextBlock();
        let result = [];
        for(let rowNo of Object.keys(matrix)){
            let row = matrix[rowNo];
            for (let pixelNo of Object.keys(row)){
                let pixel = row[pixelNo];
                let type = this.isHereActiveBlock(pixelNo, rowNo, nextBlock) ? this.props.nextBlock : pixel;

                result.push(
                    <div key={`${rowNo}/${pixelNo}`} className={`pixel-small pixel-${type}`}> </div>
                )

            }
            result.push(<br className={`br-${rowNo}`} />);
        }

        return result;
    }


    isHereActiveBlock(x,y,nextBlock){
        for (let i = 0; i < nextBlock.coordinates.length; i++) {
            if(nextBlock.coordinates[i].x === parseInt(x) && nextBlock.coordinates[i].y === parseInt(y)){
                return true;
            }
        }
        return false;
    }


    createNextBlock(){
        let type = this.props.nextBlock;
        let start = GameParams.smallMatrix.start
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
                // isMain: false
            })
        });

        return block;
    }

    createSmallMatrix() {
        let matrix = {};

        for(let y=1; y<= GameParams.smallMatrix.y; y++){
            matrix[y] = {};
            for(let x=1; x<=GameParams.smallMatrix.x; x++){
                matrix[y][x] = 0;
            }
        }
        return matrix;
    }


    render() {

        let nextBlock = this.showNextBlock();

        return (
            <div className='screen'>
                <div className='screen-box screen-box-left'>
                    <div className='screen-text'>Points: {this.props.score}</div>
                    <div className='screen-text'>Level: {this.props.level}</div>
                    <div></div>
                </div>
                <div className='screen-box'>
                    {nextBlock}
                </div>
                <div className='clearer'></div>
            </div>
        );
    }
}

export default Screen;
