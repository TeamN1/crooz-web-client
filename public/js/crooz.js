"use strict";
var socket;
var mapper;
function main() {
    socket = io();
    mapper = Mapper.init(document.getElementById('mapCard'));
    socket.on('connected', function (users) {
        socket.emit('subscribe', users[0]);
//         console.log(users);
    });
    socket.on('newPacket', function (packet) {
        handlePackets([packet]);
    });
    
    socket.on('newPackets', function (packets) {
        handlePackets(packets);
    });
}

function handlePackets(packets) {
    if(!packets.length) {return}
    mapper.addPackets(packets);
//  console.log(mapper._packets);
    mapper.render();
    var car = mapper.car;
    document.getElementById('speedCard').innerText = car.speed*3.6 + " km/h";
    document.getElementById('songCard').innerText = car.song;
    document.getElementById('moodCard').innerText = Object.keys(car.mood).reduce(
        function(a, b) {
            return car.mood[a] > car.mood[b] ? a : b
        }
    );
}
