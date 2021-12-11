// Представляет информацию об итогах голосования.
import React from "react";

export const Total = (props) => {
    var total = []

    for (var i = 0; i < props.users.length; i++) {
        var user = props.users[i];
        console.log(user)
        if (user.mark !== undefined) {
            var mark = Number(user.mark)
            var current = total.get(mark)
            if (current === undefined) {
                current = 0
            }
            total.set(mark, current++)
        }
    }

    return (
        <div className="pt-2 alert alert-warning" role="alert">
            

            {total.forEach((value, key, map) => {
                <p>{value}</p>
                // <p>Оценка <span className="badge bg-info text-dark">{key}</span> выбрана <span className="badge bg-secondary text-dark">{value}</span>раз</p>
            })}



        </div>
    );
};
