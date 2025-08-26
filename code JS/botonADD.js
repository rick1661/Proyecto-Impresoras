const modal = document.getElementById('modalForm');
const btn = document.getElementsByClassName('addImpresoraBtn')[0];
const span = document.querySelector('.close');

console.log("Click");
btn.onclick = function () {
    modal.style.display = 'block';
}
span.onclick = function () {
    modal.style.display = 'none';
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
