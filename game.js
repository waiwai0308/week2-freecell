let undo = [];
let fromElement;

function allowDrop(ev) {
    ev.preventDefault();
}

function dropentercard(ev, num) {
    // ev.target.classList
    $('.row-' +  num).addClass("rowfocus");
}
function dropleavecard(ev, num) {
    $('.row-' +  num).removeClass("rowfocus");
}

function dropenter(ev) {
    ev.target.classList.add("draggingfocus");
}

function dropleave(ev) {
    ev.target.classList.remove("draggingfocus");
}

function drag(ev) {
    if(ev.target.className.indexOf("dragging")== -1) {
        ev.target.classList.add("dragging");
    }

    fromElement = $("#" + ev.target.id).parent().attr("id");
    ev.dataTransfer.setData("text", ev.target.id);
}

function dragend(ev) {
    ev.target.classList.remove("dragging");
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    document.getElementById(data).classList.remove("dragging");
    if (ev.target.className.indexOf("poker") > -1 || ev.target.className.indexOf("putting-") > -1) {
        if (ev.target.className.indexOf("poker") > -1 && ev.target.firstChild !== null) {
            return;
        }
        if (ev.target.className.indexOf("putting-") > -1) {
            let rowLastElement = $('.' + ev.target.classList[1]).find('.poker').last();
            if (rowLastElement.length == 0) {
                undo.push([fromElement, data]);
                ev.target.appendChild(document.getElementById(data));
                updateDrag();
                return;
            }

            let color;
            if (rowLastElement.attr("id").indexOf("h") > -1 || rowLastElement.attr("id").indexOf("d") > -1) {
                color = "black"
            }
            if (rowLastElement.attr("id").indexOf("c") > -1 || rowLastElement.attr("id").indexOf("s") > -1) {
                color = "red"
            }

            let cardItem = document.getElementById(data);
            let cardItemNum = parseInt(cardItem.dataset.num);

            let isOkColor = false;
            if (color == 'black' && (rowLastElement.attr("id").indexOf("s") > -1 || rowLastElement.attr("id").indexOf("c") > -1)) {
                isOkColor = true;
            } else if (color == 'red' && (rowLastElement.attr("id").indexOf("h") > -1 || rowLastElement.attr("id").indexOf("d") > -1)) {
                isOkColor = true;
            }
            if ((cardItemNum + 1) == rowLastElement.attr("data-num") && isOkColor) {
                undo.push([fromElement, data]);
                rowLastElement.append(document.getElementById(data));
                updateDrag();
                return;
            }
            return;
        }
    }

    let color;
    if (data.indexOf("h") > -1 || data.indexOf("d") > -1) {
        color = "black"
    }
    if (data.indexOf("c") > -1 || data.indexOf("s") > -1) {
        color = "red"
    }

    let parentNum = parseInt(ev.target.dataset.num);
    let addItem = document.getElementById(data);
    if (color == "black" && (ev.path[0].id.indexOf("c") > -1 || ev.path[0].id.indexOf("s") > -1) && (parentNum - 1) == addItem.dataset.num) {
        undo.push([fromElement, data]);
        ev.target.appendChild(document.getElementById(data));
        updateDrag();
    }
    if (color == "red" && (ev.path[0].id.indexOf("h") > -1 || ev.path[0].id.indexOf("d") > -1) && (parentNum - 1) == addItem.dataset.num) {
        undo.push([fromElement, data]);
        ev.target.appendChild(document.getElementById(data));
        updateDrag();
    }

}

function dropCollect(ev) {
    ev.preventDefault();
    ev.target.classList.remove("draggingfocus");
    var data = ev.dataTransfer.getData("text");
    let cardItem = document.getElementById(data);
    if (document.getElementById(data).childElementCount > 0) return;

    if (ev.target.id.indexOf("all-") > -1 && cardItem.dataset.num == 1) {
        undo.push([fromElement, data]);
        ev.target.appendChild(document.getElementById(data));
        updateDrag();
        return;
    } else {
        let cardItemNum = parseInt(cardItem.dataset.num);
        if ((cardItemNum - 1) == ev.target.dataset.num && ev.target.id.slice(0, 1) == data.slice(0, 1)) {
            undo.push([fromElement, data]);
            ev.target.appendChild(document.getElementById(data));
            updateDrag();
        }
    }
}

// 暫存卡牌區
function dropPutting(ev) {
    ev.preventDefault();
    ev.target.classList.remove("draggingfocus");
    var data = ev.dataTransfer.getData("text");
    if (document.getElementById(data).childElementCount > 0) return;
    if (ev.path[0].className.indexOf("poker") === -1) {
        undo.push([fromElement, data]);
        ev.target.appendChild(document.getElementById(data));
        updateDrag();
        return;
    }
}

// ♥Hearts ♦Diamonds ♠Spades ♣Clubs
let combination = [
    [
        ["d6", "s1", "c12", "h13", "c10", "s10", "c5"],
        ["d7", "h2", "d5", "h1", "s12", "d12", "h8"],
        ["h12", "c11", "d9", "s3", "s7", "c4", "h6"],
        ["c1", "s11", "s9", "d3", "h7", "c7", "h3"],
        ["h5", "s2", "h4", "c9", "s4", "d10"],
        ["c3", "h9", "h10", "h11", "d11", "s5"],
        ["c8", "c6", "c2", "s8", "s6", "d13"],
        ["d8", "c13", "d1", "s13", "d2", "d4"]
    ],
    [
        ["s12", "s3", "d8", "h12", "h4", "c7", "d13"],
        ["h1", "d7", "c4", "h11", "s6", "s9", "c6"],
        ["s2", "s8", "h5", "h6", "s11", "d1", "h13"],
        ["s7", "h8", "h2", "c11", "c10", "h3", "s5"],
        ["d11", "c2", "s10", "c5", "d2", "d9"],
        ["h9", "c12", "c8", "d4", "d5", "s4"],
        ["s13", "c9", "h7", "d6", "s1", "h10"],
        ["d12", "c3", "d10", "d3", "c13", "c1"]
    ],
    [
        ["h8","h11","s5","h2","c13","h7","s11"],
        ["d2","d13","s1","s7","s8","d4","s4"],
        ["c12","c10","d10","h10","h12","d7","c6"],
        ["s12","h3","d12","c4","c2","d9","d3"],
        ["c9","h5","d11","h6","c7","s3"],
        ["s9","d6","c8","s10","d1","c11"],
        ["c5","h9","c3","s6","h1","h13"],
        ["h4","c1","s2","d5","s13","d8"]
    ],
    [
        ["h12","s4","s1","c7","s10","c13","d7"],
        ["h5","c5","c11","s3","c3","h1","s13"],
        ["h9","s8","c10","c12","c9","d6","d5"],
        ["h6","s7","d1","c8","d2","h7","s9"],
        ["d12","c1","h2","c2","h4","d3"],
        ["s2","h8","c4","h3","s6","d8"],
        ["s12","h10","d4","s11","d9","d10"],
        ["s5","d11","h13","h11","d13","c6"]
    ],
    [
        ["d9","d7","c2","h11","h2","s7","c7"],
        ["h10","c6","s11","c9","h12","c12","h1"],
        ["s13","c4","d5","c10","s9","s8","h7"],
        ["h13","c13","d12","d8","h3","d2","c1"],
        ["d6","s3","s4","d11","h8","s5"],
        ["s2","h9","h5","c5","s12","s10"],
        ["d13","c8","h4","d10","h6","c11"],
        ["d1","d4","d3","c3","s6","s1"]
    ]
];

let row = combination[getRandom(0, 4)];

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function open() {

    for (let x = 0; x < row.length; x++) {
        for (let i = 0; i < row[x].length; i++) {
            if (i == 0) {
                let num = row[x][i].slice(1);
                let color = row[x][i].slice(0, 1);
                let colorType;
                if (color == 'd' || color == 'h') {
                    colorType = true;
                } else {
                    colorType = false;
                }
                let element = `<div draggable="true" class="pokerIn poker ${row[x][i]}" ondragstart="drag(event)" ondragend="dragend(event)"  id="${row[x][i]}" data-num="${num}"  data-color="${colorType}"></div>`
                $(`.row-${x + 1}`).append(element);
            } else {
                let num = row[x][i].slice(1);
                let color = row[x][i].slice(0, 1);
                let colorType;
                if (color == 'd' || color == 'h') {
                    colorType = true;
                } else {
                    colorType = false;
                }
                let element = `<div draggable="true" class="pokerIn poker ${row[x][i]}" ondragstart="drag(event)" ondragend="dragend(event)"  id="${row[x][i]}" data-num="${num}" data-color="${colorType}"></div>`
                $(`.${row[x][i - 1]}`).append(element);
            }
        }
    }
    setTimeout(function() {
        $(".poker").removeClass("pokerIn");
    }, 3000)
}

function updateDrag() {
    $(".putting-row .poker").attr("draggable", false);
    for (let x = 1; x <= 8; x++) {
        let all = $(".row-" + x).find(".poker");
        let row1num;
        let row1color;
        for (let i = all.length; i > 0; i--) {
            if (i == all.length) {
                $(".row-" + x).find(".poker").eq(i - 1).attr("draggable", true);
                row1num = $(".row-" + x).find(".poker").eq(i - 1).attr("data-num");
                row1color = $(".row-" + x).find(".poker").eq(i - 1).attr("data-color");
            } else {

                if (parseInt(row1num) + 1 == $(".row-" + x).find(".poker").eq(i - 1).attr("data-num") && row1color != $(".row-" + x).find(".poker").eq(i - 1).attr("data-color")) {
                    $(".row-" + x).find(".poker").eq(i - 1).attr("draggable", true);
                    row1color = $(".row-" + x).find(".poker").eq(i - 1).attr("data-color");
                    row1num = $(".row-" + x).find(".poker").eq(i - 1).attr("data-num");
                } else {
                    row1color = $(".row-" + x).find(".poker").eq(i - 1).attr("data-color");
                    row1num = $(".row-" + x).find(".poker").eq(i - 1).attr("data-num");
                    break;
                }
            }
        }
    }
    if ($(".main-poker").find(".poker").length == 0) {
        alert("恭喜你 居然可以完整跳過bug來到這裡！")
    }
}
$('.undo').click(function() {
    if (undo.length == 0) return;
    let undoLength = undo.length;
    let element = $("." + undo[undoLength - 1][1])
    element.remove();
    $("#" + undo[undoLength - 1][0]).append(element);
    undo.splice(-1, 1);
    updateDrag();
    //alert("移錯的牌就像人生無法從來一樣！");
})
$('.restart').click(function() {
    location.reload();
})
open();
updateDrag();
