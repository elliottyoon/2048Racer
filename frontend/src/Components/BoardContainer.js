import React from 'react'

function BoardContainer(props) {
    return (
        <div className="board-container">
            <div className="board-row">
                {props.renderSquare(0)}
                {props.renderSquare(1)}
                {props.renderSquare(2)}
                {props.renderSquare(3)}
            </div>
            <div className="board-row">
                {props.renderSquare(4)}
                {props.renderSquare(5)}
                {props.renderSquare(6)}
                {props.renderSquare(7)}
            </div>
            <div className="board-row">
                {props.renderSquare(8)}
                {props.renderSquare(9)}
                {props.renderSquare(10)}
                {props.renderSquare(11)}          
            </div>
            <div className="board-row">
                {props.renderSquare(12)}
                {props.renderSquare(13)}
                {props.renderSquare(14)}
                {props.renderSquare(15)}          
            </div>
        </div>
    )
}
export default BoardContainer;
