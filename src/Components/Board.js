import React, { Component } from 'react';

class Board extends Component {

    constructor(){
        super();

    }


    processMatrix(){
        let matrix = this.props.matrix;
        let activeBlock = this.props.activeBlock;
        let result = [];
        for(let rowNo of Object.keys(matrix)){
            let row = matrix[rowNo];
            for (let pixelNo of Object.keys(row)){
                let pixel = row[pixelNo];
                let type = this.isHereActiveBlock(pixelNo, rowNo) ? activeBlock.type : pixel;

                result.push(
                    <div key={`${rowNo}/${pixelNo}`} className={`pixel pixel-${type}`}> </div>
                )

            }
            result.push(<br className={`br-${rowNo}`} />);
        }

        return result;
    }

    isHereActiveBlock(x,y){
        let activeBlock = this.props.activeBlock;
        for (let i = 0; i < activeBlock.coordinates.length; i++) {

            if(activeBlock.coordinates[i].x === parseInt(x) && activeBlock.coordinates[i].y === parseInt(y)){
                return true;
            }
        }

        return false;
    }



    render() {
        let matrix = this.processMatrix();

        return (
            <div className='game-container'>
                {matrix}
            </div>
        );
    }
}

export default Board;
