let pageNum = 0;

function req(url) {
    fetch(url).then(data => data.json()).then(data => buildTable(data))
}

function buildTable(data) {
    let table = document.getElementById("myTable");
    table.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        let row = `<tr id="tableRow_" + i>
                                <td>${data[i].id}</td>
                                <td id="name_${data[i].id}">${data[i].name}</td>
                                <td id="title_${data[i].id}">${data[i].title}</td>
                                <td id="race_${data[i].id}">${data[i].race}</td>
                                <td id="prof_${data[i].id}">${data[i].profession}</td>
                                <td>${data[i].level}</td>
                                <td>${data[i].birthday}</td>
                                <td id="ban_${data[i].id}">${data[i].banned}</td>
                                <td><button id="editButton_${data[i].id}" type="button" class="btn btn-outline-secondary" onclick="edit(${data[i].id})">
                                <i id="pen_${data[i].id}" class="bi bi-pen"></i></button></td>
                                <td><button id="deleteButton_${data[i].id}"  type="button" class="btn btn-outline-secondary" onclick="deleteAccount(${data[i].id})">
                                <i class="bi bi-trash"></i></button></td>
                            </tr>`
        table.innerHTML += row;
    }
    deleteButtons()
    createButton()
}

function edit(id) {
    let thisTr = document.getElementById("tableRow_" + id);
    let deleteBut = document.getElementById("deleteButton_" + id);
    let editBut = document.getElementById("editButton_" + id);
    let butt = document.getElementById("pen_" + id);
    let tdName = document.getElementById("name_" + id);
    let tdTitle = document.getElementById("title_" + id);
    let tdTRace = document.getElementById("race_" + id);
    let tdProf = document.getElementById("prof_" + id);
    let tdBan = document.getElementById("ban_" + id);
    let raceCur = tdTRace.innerText;
    let profCur = tdProf.innerText;
    let banCur = tdBan.innerText;

    tdName.innerHTML = `<input id='input_name_${id}'type='text' value= '${tdName.innerHTML}'>`;
    tdTitle.innerHTML = `<input id='input_title_${id}'type='text' value= '${tdTitle.innerHTML}'>`;


    changeRace(tdTRace, id);
    changeProf(tdProf, id);
    changeBanned(tdBan, id);
    currentRace(raceCur, id);
    currentProf(profCur, id);
    currentBan(banCur, id);

    deleteBut.remove();
    butt.removeAttribute("class");
    butt.setAttribute("class", "bi bi-save")
    editBut.removeAttribute("onclick");
    editBut.setAttribute("onclick", `saveChanges(${id})`)
}

function currentRace(raceCur, id) {
    document.querySelector("#select_race_" + id).value = raceCur;
}

function currentProf(profCur, id) {
    document.querySelector("#select_prof_" + id).value = profCur;
}

function currentBan(banCur, id) {
    document.querySelector("#select_ban_" + id).value = banCur;
}

function changeRace(tdRace, id) {
    tdRace.innerHTML = `<select id="select_race_${id}" class="form-select" aria-label="Default select example">
            <option value="HUMAN">HUMAN</option>
            <option value="DWARF">DWARF</option>
            <option value="ELF">ELF</option>
            <option value="GIANT">GIANT</option>
            <option value="ORC">ORC</option>
            <option value="TROLL">TROLL</option>
            <option value="HOBBIT">HOBBIT</option>
        </select>`
}

function changeProf(tdProf, id) {
    tdProf.innerHTML = `<select id="select_prof_${id}" class="form-select" aria-label="Default select example">
            <option value="WARRIOR">WARRIOR</option>
            <option value="ROGUE">ROGUE</option>
            <option value="SORCERER">SORCERER</option>
            <option value="CLERIC">CLERIC</option>
            <option value="PALADIN">PALADIN</option>
            <option value="NAZGUL">NAZGUL</option>
            <option value="WARLOCK">WARLOCK</option>
            <option value="DRUID">DRUID</option>
        </select>`
}

function changeBanned(tdBan, id) {
    tdBan.innerHTML = `<select id="select_ban_${id}" class="form-select" aria-label="Default select example">
            <option value="true">true</option>
            <option value="false">false</option>
        </select>`
}

function saveChanges(id) {
    let name = $("#input_name_" + id).val();
    let title = $("#input_title_" + id).val();
    let race = $("#select_race_" + id).val();
    let profession = $("#select_prof_" + id).val();
    let banned = $("#select_ban_" + id).val();

    $.ajax({
        url: "rest/players/" + id,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify({
            "name": name,
            "title": title,
            "race": race,
            "profession": profession,
            "banned": banned
        }),
        success: function () {
            req(getUrl(pageNum));
        }
    })
}

saveChanges(1)

function deleteButtons() {
    let butt = document.getElementById("button_div");
    butt.innerHTML = ``;
}

function getCount() {
    let url = "rest/players/count";
    let count = 0;
    $.ajax({
        url: url,
        async: false,
        success: function (result) {
            count = parseInt(result)
        }
    })
    return count;
}

function getButtonCount() {
    const count = getCount();
    const countPerPage = $("#count_1").val();
    const total = Math.ceil(count / parseInt(countPerPage))
    return total
}

function getUrl(i) {
    let url = "rest/players?pageSize=" + $("#count_1").val() + "&pageNumber=" + (i);
    return url;
}

function createButton() {
    const body = document.querySelector("body");
    const contForButt = document.getElementById("button_div")

    for (let i = 1; i <= getButtonCount(); i++) {
        const button = document.createElement("button");
        button.setAttribute("id", "button" + i)
        button.setAttribute("type", "submit")
        button.setAttribute("class", "btn btn-outline-secondary")
        button.addEventListener("click", () => {
            setPageNum(i)
            const url = getUrl(pageNum);
            req(url);
        })
        contForButt.append(button);
        button.innerText = `${i}`;
    }
}

function deleteAccount(id) {
    let url = "rest/players/" + id;
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function () {
            req(getUrl(pageNum));
        }
    });
}

function setPageNum(num) {
    pageNum = num - 1;
}

function createAccount() {
    let name = $("#cName").val();
    let title = $("#cTitle").val();
    let race = $("#cRace").val();
    let prof = $("#cProf").val();
    let lvl = $("#cLvl").val();
    let date = $("#cDate").val();
    let banned = $("#cBanned").val();

    if((name.length > 0 && name.length <= 12) &&
        (title.length > 0 && title.length <= 30) &&
        (parseInt(lvl) >= 0 && parseInt(lvl) <= 100)) {
        $.ajax({
            url: "rest/players",
            type: "POST",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                "name": name,
                "title": title,
                "race": race,
                "profession": prof,
                "banned": banned,
                "level": lvl,
                "birthday": new Date(date).getTime()
            }),
            success: function () {
                req(getUrl(pageNum));
                setForm()
            }
        })
    }
}

function setForm() {
   $("#cName").val("");
   $("#cTitle").val("");
   $("#cRace").val("");
   $("#cProf").val("");
   $("#cLvl").val("");
   $("#cDate").val("");
   $("#cBanned").val("");
}

