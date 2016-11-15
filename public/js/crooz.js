"use strict";
var Mapper_1 = require('./Mapper');
// var socket_io_client_1 = require('socket.io-client');
var socket = io();
var mapper = new Mapper_1.default(document.getElementById('mapCard'));
socket.on('connected', function (users) {
    socket.emit('subscribe', users[0]);
});
socket.on('newPackets', function (packets) {
    mapper.packets = packets;
    mapper.render();
    var car = mapper.car;
    document.getElementById('songCard').innerText = car.song;
    document.getElementById('moodCard').innerText = Object.keys(car.mood).reduce(
        function(a, b) {
            return car.mood[a] > car.mood[b] ? a : b
        }
    );
});