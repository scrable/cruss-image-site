let elem = document.querySelector('.grid');
let msnry = new Masonry(elem, {
    itemSelector: '.grid-item',
    columnWidth: 450,
    fitWidth: true,
    horizontalOrder: true,
    gutter: 4
});