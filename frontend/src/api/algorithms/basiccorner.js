export default function basicCorner(slideRight, slideLeft, slideDown) {
    let i = 0;
    let intervalID = setInterval(() => {
        // if 2048 or something
        // => clearInterval(intervalID);
        if (i % 2 == 0) {
            if (slideRight() == false) {
                slideLeft();
            }
        }
        else {
            if (slideDown() == false) {
                slideRight();
            };
        }
        i++;
    }, 50);
}