let undo = [];
let fromElement;
function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
    fromElement = $("#"+ev.target.id).parent().attr("id");
    ev.dataTransfer.setData("text", ev.target.id);
  }
  
  function drop(ev) {

    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    //let test = document.getElementById();
    // console.log(data);
    // console.log(ev.target.className);

    if(ev.target.className.indexOf("poker") > -1 || ev.target.className.indexOf("putting-") > -1) {
      if(ev.target.className.indexOf("poker") > -1 && ev.target.firstChild !== null) {
        return;
      }
      if(ev.target.className.indexOf("putting-") > -1) {
        
        // 拿最後一個元素
        let rowLastElement = $('.'+ev.target.classList[1]).find('.poker').last();
        if(rowLastElement.length == 0) {
          undo.push([fromElement,data]);
          ev.target.appendChild(document.getElementById(data));
          updateDrag();
          return;
        }

        let color;
        if(rowLastElement.attr("id").indexOf("h") > -1 || rowLastElement.attr("id").indexOf("d") > -1 ) {
          color = "black"
        }
        if(rowLastElement.attr("id").indexOf("c") > -1 || rowLastElement.attr("id").indexOf("s") > -1 ) {
          color = "red"
        }

        let cardItem = document.getElementById(data);
        let cardItemNum = parseInt(cardItem.dataset.num);

        let isOkColor = false;
        if(color == 'black' && (rowLastElement.attr("id").indexOf("s") > -1 || rowLastElement.attr("id").indexOf("c") > -1)) {
          isOkColor = true;
        } else if(color == 'red' && (rowLastElement.attr("id").indexOf("h") > -1 || rowLastElement.attr("id").indexOf("d") > -1)) {
          isOkColor = true;
        }
        if((cardItemNum + 1) == rowLastElement.attr("data-num") && isOkColor) {
          undo.push([fromElement,data]);
          rowLastElement.append(document.getElementById(data));
          updateDrag();
          return;
        }
        return;
      }
    }

    let color;
    if(data.indexOf("h") > -1 || data.indexOf("d") > -1 ) {
      color = "black"
    }
    if(data.indexOf("c") > -1 || data.indexOf("s") > -1 ) {
      color = "red"
    }

    let parentNum = parseInt(ev.target.dataset.num);
    let addItem = document.getElementById(data);
    if(color == "black" && (ev.path[0].id.indexOf("c") > -1 ||ev.path[0].id.indexOf("s") > -1 ) && (parentNum - 1) == addItem.dataset.num) {
      undo.push([fromElement,data]);
      ev.target.appendChild(document.getElementById(data));
      updateDrag();
    }
    if(color == "red" && (ev.path[0].id.indexOf("h") > -1 ||ev.path[0].id.indexOf("d") > -1 ) && (parentNum - 1) == addItem.dataset.num) {
      undo.push([fromElement,data]);
      ev.target.appendChild(document.getElementById(data));
      updateDrag();
    }
    
  }

  function dropCollect(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    let cardItem = document.getElementById(data);
    if(document.getElementById(data).childElementCount > 0) return;

    if(ev.target.id.indexOf("all-") > -1 && cardItem.dataset.num == 1) {
      undo.push([fromElement,data]);
      ev.target.appendChild(document.getElementById(data));
      updateDrag();
      return;
    } else {
      let cardItemNum = parseInt(cardItem.dataset.num);
      if((cardItemNum - 1) == ev.target.dataset.num && ev.target.id.slice(0,1) == data.slice(0,1)) {
        undo.push([fromElement,data]);
        ev.target.appendChild(document.getElementById(data));
        updateDrag();
      }
    }
  }
  
  // 暫存卡牌區
  function dropPutting(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if(document.getElementById(data).childElementCount > 0) return;
    if(ev.path[0].className.indexOf("poker") === -1) {
      undo.push([fromElement,data]);
      ev.target.appendChild(document.getElementById(data));
      updateDrag();
      return;
    }
  }

  // ♥Hearts ♦Diamonds ♠Spades ♣Clubs
  let row = [
    ["d6","s1","c12","h13","c10","s10","c5"],
    ["d7","h2","d5","h1","s12","d12","h8"],
    ["h12","c11","d9","s3","s7","c4","h6"],
    ["c1","s11","s9","d3","h7","c7","h3"],
    ["h5","s2","h4","c9","s4","d10"],
    ["c3","h9","h10","h11","d11","s5"],
    ["c8","c6","c2","s8","s6","d13"],
    ["d8","c13","d1","s13","d2","d4"]]

  function open() {
    
    for(let x = 0; x < row.length; x++){
      for(let i = 0; i < row[x].length; i++) {
          if(i == 0) {
            let num = row[x][i].slice(1);
            let color = row[x][i].slice(0,1);
            let colorType;
            if(color == 'd' || color == 'h')  {
              colorType = true;
            }else {
              colorType = false;
            }
            let element = `<div draggable="true" class="poker ${row[x][i]}" ondragstart="drag(event)"  id="${row[x][i]}" data-num="${num}"  data-color="${colorType}"></div>`
            $(`.row-${x + 1}`).append(element);
          } else {
            let num = row[x][i].slice(1);
            let color = row[x][i].slice(0,1);
            let colorType;
            if(color == 'd' || color == 'h') {
              colorType = true;
            }else {
              colorType = false;
            }
            let element = `<div draggable="true" class="poker ${row[x][i]}" ondragstart="drag(event)" id="${row[x][i]}" data-num="${num}" data-color="${colorType}"></div>`
            $(`.${row[x][i - 1]}`).append(element);
          }
      }
    }
  }

  function updateDrag() {
    $(".putting-row .poker").attr("draggable", false);

    let gameFinished = false;
    for(let x = 1; x <= 8; x++) {
      let all = $(".row-" + x).find(".poker");
      let row1num;
      let row1color;
      for(let i = all.length; i > 0; i--){
        if(i == all.length) {
          $(".row-" + x).find(".poker").eq(i - 1).attr("draggable", true);
          row1num = $(".row-" + x).find(".poker").eq(i - 1).attr("data-num");
          row1color = $(".row-" + x).find(".poker").eq(i - 1).attr("data-color");
        } else {
  
          if(parseInt(row1num) + 1 == $(".row-" + x).find(".poker").eq(i - 1).attr("data-num") && row1color != $(".row-" + x).find(".poker").eq(i - 1).attr("data-color")) {
            $(".row-" + x).find(".poker").eq(i - 1).attr("draggable", true);
            row1color = $(".row-" + x).find(".poker").eq(i - 1).attr("data-color");
            row1num = $(".row-" + x).find(".poker").eq(i - 1).attr("data-num");
          }else {
            row1color = $(".row-" + x).find(".poker").eq(i - 1).attr("data-color");
            row1num = $(".row-" + x).find(".poker").eq(i - 1).attr("data-num");
            break;
          }
        }
        if(all.length == 0) {
          gameFinished = true;
        }else {
          gameFinished = false;
        }
      }

      if(gameFinished) {
        alert("恭喜你 居然可以完整跳過bug來到這裡！")
      }

    }
    
  }


  $('.undo').click(function(){
    if(undo.length == 0) return;
    let undoLength = undo.length;
    let element = $("." + undo[undoLength - 1][1])
    element.remove();
    $("#" + undo[undoLength - 1][0]).append(element);
    undo.splice(-1,1);
    //alert("移錯的牌就像人生無法從來一樣！");
  })
  $('.restart').click(function(){
    location.reload();
  })
  open();
  updateDrag();