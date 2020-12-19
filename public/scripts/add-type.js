// ADD PROPS AND OPTIONS LOGIC

let propCount = 0;
const optCounts = [];

const propList = document.getElementById('propsList');
const addPropBtn = document.getElementById('addMoreProps');
const deletePropBtn = document.getElementById('deleteProp');

addPropBtn.addEventListener('click', addPropHandler);
deletePropBtn.addEventListener('click', deletePropHandler);

function addPropHandler() {
    propCount++; // adding new prop
    optCounts.push(1); // adding new counter to options-count arr
    const newPropCard = document.createElement('li');
    newPropCard.setAttribute('class', 'card px-auto');
    newPropCard.innerHTML = `
           <h5 class="card-header">Свойство ${propCount}</h5>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mx-auto">
                            <label for="prop-${propCount}">Название свойства</label>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <div class="input-group-text"><i class="fa fa-cogs"></i></div>
                                </div>
                                <input type="text" required name="prop-${propCount}" class="form-control" placeholder="Модификация ${propCount}"
                                       id="prop-${propCount}">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label>Список возможный опций:</label>
                            <ul id="optList-${propCount}">
                                <li class="input-group input-group-sm mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="prop-${propCount}-opt-1">1</span>
                                    </div>
                                    <input type="text" required name="prop-${propCount}-opt-1" class="form-control" aria-label="Small"
                                           aria-describedby="prop-${propCount}-opt-1">
                                </li>
                            </ul>
                            <button type="button" class="float-left btn btn-dark btn-sm" id="addMoreOpt-${propCount}"><i
                                        class="fa fa-plus"></i></button>
                            <button type="button" class="float-right btn btn-danger btn-sm" id="deleteOpt-${propCount}"><i
                                        class="fa fa-times"></i></button>  
                        </div>
                    </div>
                </div>
    `;
    propList.appendChild(newPropCard);
    document.getElementById(`addMoreOpt-${propCount}`).addEventListener('click', addOptHandler.bind(this, propCount));
    document.getElementById(`deleteOpt-${propCount}`).addEventListener('click', deleteOptHandler.bind(this, propCount));
}

function deletePropHandler() {
    if (propCount > 0) {
        propList.removeChild(propList.lastChild);
        propCount--;
        optCounts.pop()
    }
}

function addOptHandler(propNum) {
    optCounts[propNum - 1]++;
    const optNum = optCounts[propNum - 1];
    const newOpt = document.createElement('li');
    newOpt.setAttribute('class', 'input-group input-group-sm mb-3');
    newOpt.innerHTML = `
    <div class="input-group-prepend">
        <span class="input-group-text" id="prop-${propNum}-opt-${optNum}">${optNum}</span>
    </div>
    <input type="text" required name="prop-${propNum}-opt-${optNum}" class="form-control" aria-label="Small"
        aria-describedby="prop-${propNum}-opt-${optNum}">
    `;
    document.getElementById(`optList-${propNum}`).appendChild(newOpt);
}

function deleteOptHandler(propNum) {
    if (optCounts[propNum - 1] === 1) {
        return
    }
    optCounts[propNum - 1]--;
    const targetList = document.getElementById(`optList-${propNum}`);
    targetList.removeChild(targetList.lastChild);
}