$(async () => {

let deviceNum = 1;
const availableTypes = await requestForTypes(); // requesting for available types to database

// ============ ADD AND DELETE DEVICE LOGIC =================

const devicesList = document.getElementById('devices');
document.getElementById('addMoreDevices').addEventListener('click', addDeviceHandler);
document.getElementById('deleteDevices').addEventListener('click', deleteDeviceHandler);
document.getElementById('serial-1').addEventListener('blur', checkIsSerialExists.bind(this, deviceNum));
document.getElementById('serial-1').addEventListener('focus', resetWarning);
//document.getElementById('typeName-1').addEventListener('blur', activateSerialInput.bind(this, deviceNum));
//document.getElementById('typeName-1').addEventListener('focus', resetSerialInput.bind(this, deviceNum));
const cityInput = document.getElementById('city');

function resetWarning() {
    this.className = 'form-control'
}

function activateSerialInput(deviceNum) {
    if (!document.getElementById(`typeName-${deviceNum}`).value) {
        return
    }
    const serialInput = document.getElementById(`serial-${deviceNum}`);
    serialInput.removeAttribute('disabled');
    serialInput.value = '';
    resetWarning.call(serialInput);
}

// function resetSerialInput(deviceNum) {
//
// }

function checkIsSerialExists(deviceNum) {
    const serialInput = document.getElementById(`serial-${deviceNum}`);
    const checkingType = document.getElementById(`typeName-${deviceNum}`).value;
    const checkingSerial = serialInput.value;
    $.ajax({
        type: "GET",
        url: `/serial-check/${checkingType}-${checkingSerial}`
    }).done(status => {
        serialInput.classList.add(status);
    });
}

function addDeviceHandler() {
    deviceNum++;
    const newDeviceCard = document.createElement('div');
    newDeviceCard.setAttribute('class', 'card');
    newDeviceCard.setAttribute('id', `device-${deviceNum}`);
    newDeviceCard.innerHTML = `
            <h5 class="card-header">Устройство ${deviceNum}</h5>
            <div class="card-body">
              <div class="row">
              <div class="col-md-4" id=typeSelector-${deviceNum}> 
                            <label for="typeName-${deviceNum}">Тип устройства</label>
                            <select class="custom-select" id="typeName-${deviceNum}" name=typeName-${deviceNum}>
                                <option disabled selected>Выберите тип</option>
                                ${availableTypes.reduce((list, type) => {
        return (list + `<option value=${type}>${type}</option>`)}, '')}     
                            </select><div id="typeOpt-${deviceNum}" class="mt-3"></div>
                </div>
                <div class="col-md-4">
                    <label for="serial-${deviceNum}">Серийный номер</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <div class="input-group-text"><i class="fa fa-list-ol"></i></div>
                        </div>
                        <input type="number" disabled required name=serial-${deviceNum} class="form-control" placeholder="25" id="serial-${deviceNum}">
                        <div class="valid-feedback">
                            Серийный номер свободен!
                        </div>
                        <div class="invalid-feedback">
                            Серийный номер уже существует!
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="date-${deviceNum}">Дата производства</label>
                    <div class="input-group mb-3">
                        <input type="month" required name=date-${deviceNum} class="form-control" placeholder="июнь 2020" id="date-${deviceNum}">
                    </div>
                </div>
            </div>
            </div>
    `;
    devicesList.appendChild(newDeviceCard);
    document.getElementById(`serial-${deviceNum}`).addEventListener('blur', checkIsSerialExists.bind(this, deviceNum));
    document.getElementById(`serial-${deviceNum}`).addEventListener('focus', resetWarning);

    const typeSelector = document.getElementById(`typeName-${deviceNum}`);
    typeSelector.addEventListener('change', typeSelectHandler.bind(typeSelector, deviceNum));
    typeSelector.addEventListener('blur', activateSerialInput.bind(this, deviceNum));
}

function deleteDeviceHandler() {
    if (deviceNum > 1) {
        devicesList.removeChild(devicesList.lastChild);
        deviceNum--;
    }
}

// ================= CITY AUTOCOMPLETE LOGIC =================

ymaps.ready(init);

function init() {
    // Создаем выпадающую панель с поисковыми подсказками и прикрепляем ее к HTML-элементу по его id.
    new ymaps.SuggestView('city');
    new ymaps.SuggestView('country');
}

// ================= GENERATING AND SENDING COORDINATES LOGIC =================

const form = document.getElementById('add-device-form');
const YANDEX_API_KEY = 'ecf1da0d-157d-4bc1-b947-ba8cc775e35a'; // HERE IS YOUR YANDEX API KEY
form.addEventListener('submit', formSubmitHandler);

// Getting coords using Yandex Geocoding API
async function getCoordsFromAddress(address) {
    const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${YANDEX_API_KEY}&geocode=${address}`);
    if (!response.ok) {
        throw new Error('failed to fetch coordinates, try again')
    }
    const data = await response.json();
    if (data.error) {
        throw new Error(data.message)
    }
    const coordsArr = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
    return {lng: coordsArr[0], lat: coordsArr[1]}
}


// ================= DEVICE-TYPES OPTIONS LOGIC =================
document.getElementById('typeSelector-1').innerHTML = `
    <label for="typeName-1">Тип устройства</label>
        <select required class="custom-select" id="typeName-1" name="typeName-1">
        <option disabled selected value="">Выберите тип</option>
        ${availableTypes.reduce((list, type) => {
    return (list + `<option value=${type}>${type}</option>`)}, '')}  
        </select><div id="typeOpt-1" class="mt-3"></div>
`
const typeSelector = document.getElementById('typeName-1');
typeSelector.addEventListener('change', typeSelectHandler.bind(typeSelector, deviceNum));
typeSelector.addEventListener('blur', activateSerialInput.bind(this, deviceNum));

async function requestForTypes() {
    return await $.ajax({
        type: "GET",
        url: `/type-suggest/`
    }).done(types => {
        if (types.length === 0) {
            return []
        }
        return types
    });
}

function typeSelectHandler(deviceIdx) {
    this.nextSibling.innerHTML = ''
    $.ajax({
        type: "GET",
        url: `/type-suggest/${this.value}`
    }).done(([props, hashCalc]) => {
        this.nextSibling.innerHTML = `<input type="hidden" name=hashCalc-${deviceIdx} value=${hashCalc}>`
        if (props.length === 0) {
            return
        }
        const propsList = createOptionSelectors(props, deviceIdx);
        this.nextSibling.appendChild(propsList) // adding selector list below
    });
}

function createOptionSelectors(propArr, deviceIdx) {
    const propsList = document.createElement('div'); // wrapping div for type-props menu

    propArr.forEach((prop, propIdx) => {
        const optionList = prop.options.reduce((list, option) => {
            return (list + `<option value=${option}>${option}</option>`)}, '');        // Creating list of dropdown options

        const propSelector = document.createElement('div');           // Creating selectors with options
        propSelector.setAttribute('class', 'input-group mb-3');
        propSelector.innerHTML = `
            <div class="input-group-prepend">
                <label class="input-group-text" for="prop-${deviceIdx}-${propIdx + 1}">${prop.propname}</label>
                <input type="hidden" name=propName-${deviceIdx}-${propIdx + 1} value="${prop.propname}">
            </div>
            <select required class="custom-select" name=propVal-${deviceIdx}-${propIdx + 1} id="prop-${deviceIdx}-${propIdx + 1}">
                <option disabled selected value="">Выберите тип</option>
                ${optionList}
            </select>
        `;

        propsList.appendChild(propSelector)
    })
    return propsList
}

// ================= FORM-SUBMISSION LOGIC =================

// Adding coords to hidden input form and posting data to server
        async function formSubmitHandler(e) {
            e.preventDefault();
            if (!checkIsDuplicatingInputs(deviceNum)) {
                alert('Введены два или более устройств с одинаковым серийным номером!');
                return
            }
            const address = cityInput.value;
            const coords = await getCoordsFromAddress(address);
            document.getElementById('coords').value = JSON.stringify(coords);

            form.submit();
        }

// Check if stoopid user added >1 devices with the same serial
        function checkIsDuplicatingInputs(numOfInputs) {
            const InputsArr = [];
            for (let i = 1; i <= numOfInputs; i++) {
                InputsArr.push(document.getElementById(`serial-${i}`).value + '-' + document.getElementById(`typeName-${i}`).value);
            }
            return InputsArr.length === new Set(InputsArr).size;
        }
    }
)

