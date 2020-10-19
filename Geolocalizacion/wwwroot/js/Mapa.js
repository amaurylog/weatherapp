const o_date_es = new Intl.DateTimeFormat('es');

let map = L.map('map', {
    contextmenu: true,
    contextmenuWidth: 140,
    contextmenuItems: [{
        text: 'Mostrar Coordenadas',
        callback: showCoordinates
    }, {
        text: 'Centrar Mapa Aquí',
        callback: centerMap
    },{
        text: 'Agregar Marcador',
        callback: addMarkerHere
    }, '-', {
        text: 'Zoom in',
        icon: '../images/zoom-in.png',
        callback: zoomIn
    }, {
        text: 'Zoom out',
        icon: '../images/zoom-out.png',
        callback: zoomOut
    }],
    center: [12.62, -87.13],
    zoom: 14
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoid3d3YW1hdXJ5bG9nIiwiYSI6ImNrZzhoN2x3YTBoN24yeW9hcjJ4a2l2NnQifQ.7jCrclXltpv9T0KOYRgh_A'
}).addTo(map);

function showCoordinates(e) {
    //console.log(e);
}

function centerMap(e) {
    map.panTo(e.latlng);
}

function zoomIn(e) {
    map.zoomIn();
}

function zoomOut(e) {
    map.zoomOut();
}

function addMarkerHere(e) {
    var Key = '1c56cad6cef0a7e2e692e08631f0afab'

    $.ajax({

        type: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/weather?lat=' + e.latlng['lat'] + '&lon=' + e.latlng['lng'] + '&units=metric&lang=es&appid=' + Key,
        dataType: 'json',
        success: function (res) {

            var formReg =
           '<form asp-action="Create" id="frmRegistrarMarker"> ' +
                '<div asp-validation-summary="ModelOnly" class="text-danger"></div>' +
                '<div class="form-group">' +
                    '<label asp-for="Nombre" class="control-label">Ingresar Nombre</label>' +
                    '<input type="text" asp-for="Nombre" class="form-control form-control-sm txtNombre" id="txtNombre" />' +
                '</div>' + 
                '<div class="form-group">' +
                    '<input type="hidden" asp-for="Latitud" class="form-control txtLatitud" id="txtLatitud" />' +
                '</div>' + 
                '<div class="form-group">' +
                    '<input type="hidden" asp-for="Longuitud" class="form-control txtLonguitud" id="txtLonguitud" />' +
                '</div>' + 
                '<div class="form-group">' +
                    '<input type="hidden" asp-for="Temperatura" class="form-control txtTemperatura" id="txtTemperatura" />' +
                '</div>' + 
                '<div class="form-group">' +
                    '<input type="hidden" asp-for="Humedad" class="form-control txtHumedad" id="txtHumedad" />' +
                '</div>' +
                '<div class="form-group">' +
                    '<input type="button" value = "Create" class="btn btn-primary" id="btnRegistrarMarker"/>' +
                '</div>'+
           '</form>';

            L.popup()
            .setLatLng(e.latlng)
            //.setContent(res['name'])
            .setContent(formReg)
            .openOn(map);

            console.log(res);
            $("#txtLatitud").val(res['coord']['lat'])
            $("#txtLonguitud").val(res['coord']['lon'])
            $("#txtTemperatura").val(res['main']['temp'])
            $("#txtHumedad").val(res['main']['humidity'])

        },
        error: function (XMLHttpRequest, textStatus, errorThrow) {

        }

    });

    L.marker([e.latlng['lat'], e.latlng['lng']]).addTo(map)
}

$("#verRegistrosJson").click(function () {

    $.ajax({
        url: "/Ubicacion/GetAllJson",
        data: {},
        contentType: 'application/json',
        type: 'GET',
        success: function (res) {
            //console.log(res)
        }
    });

});

$(document).on('click', '#btnRegistrarMarker', function () {

    var nombre = $("#txtNombre").val();
    var latitud = $("#txtLatitud").val();
    var longitud = $("#txtLonguitud").val();
    var temperatura = $("#txtTemperatura").val();
    var humedad = $("#txtHumedad").val();

    $.ajax({
        type: 'POST',
        url: "/Ubicacion/AddMarker",
        data: { 'nombre': nombre, 'latitud': latitud, 'longitud': longitud, 'temperatura': temperatura, 'humedad': humedad },
        dataType: 'json',
        success: function (res) {
            if (res == 'Ok') {
                Swal.fire({
                    title: '¡Acción Realizada!',
                    text: 'Estación Registrada Correctamente.',
                    icon: 'success'
                }).then((r) => {
                    window.location = 'https://localhost:44380/Ubicacion'
                })
            }
        },
        error: function (req, status, error) {
        }
    });

    //console.log(nombre + ',' + latitud + ',' + longitud + ',' + temperatura + ',' + humedad);

});

function loadInfoWeather(cityInfo) {

    //console.log(cityInfo);

    var html = '';

    $.ajax({

        type: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/weather?lat=' + cityInfo['latitud'] + '&lon=' + cityInfo['longuitud'] +'&units=metric&lang=es&appid=1c56cad6cef0a7e2e692e08631f0afab',
        dataType: 'json',
        success: function (res) {
            html = '<div class="cardT">';
                html += '<input type="hidden" value="'+ cityInfo['id'] +'" />';
                html += '<div class="cardBody">';
                    html += '<div class="titleCardWeather">';
                        html += '<h5>' + cityInfo['nombre'] +'</h5>';
                    html += '</div>';
                    html += '<div class="bodyCardWeather">';
                        html += '<div class="row">';
                            html += '<div class="col-6">';
                                html += '<i class="fas fa-cloud-rain"></i>';
                                html += '<div class="form-group">';
                                    html += '<h5>'+ res['main']['humidity'] +'%</h5>';
                                    html += '<p>Humedad</p>';
                                html += '</div>';
                            html += '</div>';
                            html += '<div class="col-6">';
                                html += '<i class="fas fa-temperature-high"></i>';
                                html += '<div class="form-group">';
                                    html += '<h5>' + res['main']['temp'] +'°</h5>';
                                    html += '<p>Temperatura</p>';
                                html += '</div>';
                            html += '</div>';
                        html += '</div>';
                    html += '</div>';
                html += '</div>';
            html += '</div>';

            $(".cardsWeather").append(html);
        }
    });
}

function setMapMarkers(cityInfo) {

    var formUp = '';

    $.ajax({
        type: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/weather?lat=' + cityInfo['latitud'] + '&lon=' + cityInfo['longuitud'] + '&units=metric&lang=es&appid=1c56cad6cef0a7e2e692e08631f0afab',
        dataType: 'json',
        success: function (res) {
            formUp =
            '<form asp-action="Update" id="frmUpdateMarker"> ' +
                '<input type="hidden" value=' + cityInfo['id'] +' id="txtIdUp" />' +
                '<input type="hidden" value=' + cityInfo['latitud'] +' id="txtLatUp" />' +
                '<input type="hidden" value=' + cityInfo['longuitud'] + ' id="txtLonUp" />' +
                '<input type="hidden" value=' + cityInfo['fechaRegistro'] + ' id="txtRegUp" />' +
                '<div asp-validation-summary="ModelOnly" class="text-danger"></div>' +
                    '<div class="row">' +
                        '<div class="col-12">' +
                            '<div class="form-row">' +
                                '<div class="form-group">' +
                                    '<label asp-for="Nombre" class="sr-only">Ingresar Nombre</label>' +
                                    '<input type="text" asp-for="Nombre" class="form-control form-control-sm txtNomUp" id="txtNomUp" placeholder="Nombre" value="'+ cityInfo['nombre'] +'" readonly />' +
                                '</div>' +
                                '<div class="col-1">' +
                                    '<button type="button" class="btn btn-sm btn-dark btnActivarEdicion" id="btnActivarEdicion">' +
                                        '<i class="fas fa-pencil-alt"></i>' +
                                    '</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<hr />' +
                    '<div class="row">' +
                        '<div class="col-6 text-center">' +
                            '<i class="fas fa-cloud-rain" style="font-size: 32px"></i>' +
                            '<div class="form-row">' +
                                '<p class="m-1 p-2" style="font-size:28px" id="lblHum">' + res['main']['humidity'] +'</p><p class="m-1 p-2" style="margin-left:110px; font-size:28px">%</p>' +
                                '<p class="m-1 p-2" style="font-size:18px">Humedad</p>' +
                            '</div>' +
                        '</div>' +
                        '<div class="col-6 text-center">' +
                            '<i class="fas fa-temperature-high" style="font-size: 32px"></i>' +
                            '<div class="form-row">' +
                                '<p class="m-1 p-2" style="font-size:28px" id="lblTemp">' + res['main']['temp'] +'</p><p class="m-0 p-0" style="font-size:28px">°</p>' +
                                '<p class="m-1 p-2" style="font-size:18px">Temperatura</p>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<hr />' +
                    '<div class="form-group">' +
                        '<label asp-for="Nombre" class="control-label">Última Modificación: </label>' +
                        '<label asp-for="Nombre" class="control-label">' + new Date(cityInfo['fechaActualizacion']) +'</label>' +
                    '</div>' +
                    '<div class="btn-group">' +
                        '<input type="button" value="Actualizar" class="btn btn-sm btn-primary" id="btnActualizarMarcador" disabled/>' +
                        '<input type="button" value="Deshabilitar" class="btn btn-sm btn-danger" id="btnDeshabilitarMarcador"/>' +
                '</div>' +
            '</form>';

            var pop = L.popup()
                .setLatLng([cityInfo['latitud'], cityInfo['longuitud']])
                .setContent(formUp);

            L.marker([cityInfo['latitud'], cityInfo['longuitud']])
                .bindPopup(pop)
                .addTo(map);

            //console.log(res);
        }
    });
}

function loadMarkers() {

    var data = [];

    $.ajax({
        url: "/Ubicacion/GetAllJson",
        data: {},
        contentType: 'application/json',
        type: 'GET',
        success: function (res) {

            for (var i = 0; i < res.length; i++) {

                loadInfoWeather(res[i]);
                setMapMarkers(res[i]);
            }
        }
    });
}

function getTemp(temperatura) {
    return temperatura
}

function showBarChart(historicCity, city, colors) {
    var ctx = document.getElementById('chartBar').getContext('2d');

    // Variables para fecha
    var days = [];
    var newDays = [];
    var myObj = {};

    // Para Temperatura
    var temp = [];

    for (i = 0; i < historicCity['list'].length; i++) {
        var d = new Date(historicCity['list'][i]['dt_txt']);
        let day = d.getDate();
        let month = d.getMonth();
        let year = d.getFullYear();
        let fullDay = `${day}/${month}/${year}`

        // Campo para la Fecha dt_txt

        days.push(fullDay);
        temp.push(historicCity['list'][i]['main']['temp'])
    }

    days.forEach(el => !(el in myObj) && (myObj[el] = true) && newDays.push(el));


    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: newDays,
            datasets: [{
                label: 'Temperature',
                data: temp,
                backgroundColor: 'Blue',
            }]
        }
    })
}

function makeComputedItem(city, data) {
    console.log(city);
}

function getRegFromAPI(data, cityDb) {
    var temp = [];
    for (i = 0; i < cityDb.length; i++) {
        $.ajax({
            type: 'GET',
            url: 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityDb[i].latitud + '&lon=' + cityDb[i].longuitud + '&appid=7e0e4e6cdce20a9faf2b59da4e37dcc2&units=metric',
            dataType: 'json',
            success: function (res) {
                console.log(data, res[i]);
            }
        })
    }
}

function setValuesName(data) {
    console.log(data);
}

function getRegFromDB() {

    var data = {};

    var allData = [];
    var historyc;

    var colors = [
        '#943434', '#344494', '#7d2069', '#d67d0f', '#c2d60f', '#2d3009', '#6a990b', '#8ef56e', '#8a8a8a', '#a05cd1', '#d4a1cc', '#ff00d7', '#b5096d', '#09b5aa'
    ]

    $.ajax({
        type: 'GET',
        url: '/Ubicacion/GetAllJson',
        dataType: 'json',
        success: function (res) {
            for (i = 0; i < res.length; i++) {
                data['label'] = res[i].nombre;
                //console.log(res[i].nombre)
                //console.log(data)
                allData.push(data);
            }
        }
    })

    console.log(allData)
}

$(document).ready(function () {
    loadMarkers();
    //getRegFromDB();
});

$(document).on('click', '#btnActivarEdicion', function () {
    $("#btnActualizarMarcador").attr("disabled", false);
    $("#txtNomUp").attr("readonly", false);
});

$(document).on('click', '#btnActualizarMarcador', function () {

    var id = $("#txtIdUp").val();
    var nombre = $("#txtNomUp").val();
    var temp = $("#lblTemp").text();
    var hum = $("#lblHum").text();
    var lat = $("#txtLatUp").val();
    var lon = $("#txtLonUp").val();
    var reg = $("#txtRegUp").val();

    $.ajax({
        type: 'PUT',
        url: "/Ubicacion/UpdateRegister",
        data: { 'id': id, 'nombre': nombre, 'latitud': lat, 'longitud': lon, 'temperatura': temp, 'humedad': hum, 'fechaRegistro': reg },
        dataType: 'json',
        success: function (res) {
            if (res == 'Ok') {
                Swal.fire({
                    title: '¡Acción Realizada!',
                    text: 'Estación Actualizada Correctamente.',
                    icon: 'success'
                }).then((r) => {
                    window.location = 'https://localhost:44380/Ubicacion'
                })
            }
        },
        error: function (req, status, error) {
        }
    });
})

$(document).on('click', '#btnDeshabilitarMarcador', function () {

    var id = $("#txtIdUp").val();
    var nombre = $("#txtNomUp").val();
    var temp = $("#lblTemp").text();
    var hum = $("#lblHum").text();
    var lat = $("#txtLatUp").val();
    var lon = $("#txtLonUp").val();
    var reg = $("#txtRegUp").val();

    $.ajax({
        type: 'PUT',
        url: "/Ubicacion/DisableRegister",
        data: { 'id': id, 'nombre': nombre, 'latitud': lat, 'longitud': lon, 'temperatura': temp, 'humedad': hum, 'fechaRegistro': reg },
        dataType: 'json',
        success: function (res) {
            if (res == 'Ok') {
                Swal.fire({
                    title: '¡Acción Realizada!',
                    text: 'Estación Deshabilitada Correctamente.',
                    icon: 'success'
                }).then((r) => {
                    window.location = 'https://localhost:44380/Ubicacion'
                })
            }
        },
        error: function (req, status, error) {
        }
    });
})