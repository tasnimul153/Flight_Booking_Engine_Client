import React from "react";

const CounterButton = ({ count, setCount }) => {
    return (
        <div className="counterButtonContainer">
            <button className="counterButton" onClick={() => {
                if (count > 1) {
                    setCount(count - 1);
                }
            }}>-</button>
            <span className="count">{count}</span>
            <button className="counterButton" onClick={() => {
                setCount(count < 9 ? count + 1 : count);
            }}>+</button>
        </div>
    );
};

export default CounterButton;