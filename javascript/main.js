function initialCount(data, id){
    return data.filter(x => x.Parent == id).length;
}

function finalCount(data, id, count = 0){
    if(id.length == 0){
        return count;
    } else {
        children =  data.filter(x => x.Parent == id[0]).map(x => x.Id);
        id.splice(0, 1);
        id = [...id, ...children];
        count += children.length;
        return finalCount(data, id, count);
    }
}

function generateCard(data, all) {

    if(data.Id == localStorage.getItem("marker")){
        let activeClass = 'activeTeam'
    }
    let activeClass = (data.Id == localStorage.getItem("marker") || data.Parent == localStorage.getItem("marker")) ? 'activeTeam' : '';
    return `
    <li class="card" data-id="${data.Id}">
        <div class="team ${activeClass}">
            ${data.Id}
        </div>
        <div class="name">
            <span>
                ${data.Name}
            </span>
            <br>
            <span>
                ${data.title}
            </span>
            <div class="members">
                <span>
                    ${initialCount(all, data.Id)}
                </span>
                <span>
                    ${finalCount(all, [data.Id])}
                </span>
                <span>
                    +
                </span>
            </div>
        </div>
    </li>
    `;
}

function newChild(data, marker) {
    flag = 0;
    current = data.find(x => x.Id == marker);
    tempMarker = current.Id;
    result = data.filter(x => {
        if(x.depth < current.depth && flag == 0){
            return true;
        } else if(x.depth == current.depth && x.Parent == current.Parent) {
            return true;
        }
        else if((x.Parent == tempMarker || x.Parent == marker) && x.depth - current.depth == 1) {
            flag = 1;
            tempMarker = x.Id;
            return true;
        } else {
            return false;
        }
    });
    printLevels(result, data);
    return result;
}

function printLevels(data, all) {
    temp = data[0].depth;
    html = data.map(x => {
        if(x.depth == temp){
            return generateCard(x, all);
        } else {
            temp++;
            return '<br>'+generateCard(x, all);
        }
    }).join('');
    root.innerHTML = html;
}
function handleClick(e, result) {
    let li = e.target.closest('li');    
    
    if (!li) return;
    if (!root.contains(li)) return;
    init(li.dataset.id);
}

const root = document.querySelector('#root');
root.addEventListener('click', handleClick);

function init(marker = 0){

data = [
    {"Id": 1,"Name": "Gilfoey","title": "Co-founder - CEO","Parent": "","root": "true", "depth": 0},
    {"Id": 2,"Name": "Ashton","title": "CTO","Parent": 1, "depth": 1},
    {"Id": 3,"Name": "Martin","title": "Backend","Parent": 2, "depth": 2},
    {"Id": 4,"Name": "Rock","title": "Frontend","Parent": 2, "depth": 2},
    {"Id": 5,"Name": "Dave","title": "Design","Parent": 2, "depth": 2},
    {"Id": 6,"Name": "Thet","title": "Devops","Parent": 2, "depth": 2},
    {"Id": 7,"Name": "Chris","title": "Sales","Parent": 3, "depth": 3},
    {"Id": 8,"Name": "Harris","title": "Frontend-intern","Parent": 4, "depth": 3},
    {"Id": 9,"Name": "Brad","title": "E-commerce","Parent": 5, "depth": 3},
    {"Id": 10,"Name": "Aman","title": "A-Pac","Parent": 5, "depth": 3},
    {"Id": 11,"Name": "Angel","title": "Europe","Parent": 6, "depth": 3},
    {"Id": 12,"Name": "Tirak","title": "HR","Parent": 8, "depth": 4}
];

        if(marker == localStorage.getItem("marker")){
            marker = data.find(x => x.Id == marker);
            if(marker.Parent != ""){
                localStorage.setItem("marker", marker.Parent);
                return newChild(data, marker.Parent);
            }
            return newChild(data, 1);
        } else {
            localStorage.setItem("marker", marker);
            return newChild(data, marker);
        }
}

let marker = localStorage.getItem("marker") || 1;
init(1);