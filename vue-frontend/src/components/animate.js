import anime from "animejs";

export const translateRight = function (element, amount){
    anime({
        targets: element,
        translateX: amount
    })
}

export const translateLeft = function (element, amount){
    anime({
        targets: element,
        translateX: -amount
    })
}