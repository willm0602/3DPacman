function main()
{
    var score = localStorage.getItem('3dpacmanscore');
    var scoreElement = document.getElementsByClassName('final-score');
    scoreElement[0].innerHTML = score;
}

window.onload = main;