"use strict";
var Mapper = (function () {
    function Mapper(element, packetList) {
        if (packetList === void 0) { packetList = []; }
        this.map = new Microsoft.Maps.Map(element, {
            credentials: 'AuknkZ3WFkby8tWsY03iI9muVj4jcRdHztYdxJiOdu6PXPrX7Tm2ziXOsfz3wAPY',
            navigationBarMode: navigationBarMode.compact
        });
        this.packets = packetList;
    }
    ;
    Mapper.prototype.render = function () {
        this.drawPolyline(this.packets);
        for (var i = this.map.entities.getLength() - 1; i >= 0; i--) {
            var previousPin = this.map.entities.get(i);
            if (previousPin instanceof Microsoft.Maps.Pushpin) {
                this.map.entities.removeAt(i);
            }
        }
        var pushPin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(this._car.geo.lat, this._car.geo.lon), null);
        this.map.entities.push(pushPin);
    };
    Object.defineProperty(Mapper.prototype, "packets", {
        get: function () {
            return this._packets;
        },
        set: function (packetList) {
            if (packetList) {
                this._packets.concat(packetList);
                this._car = this._packets[this._packets.length - 1];
            }
            else {
                this._packets = new Array();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mapper.prototype, "car", {
        get: function () {
            return this._car;
        },
        enumerable: true,
        configurable: true
    });
    // set car(packet: any) {
    //     this._car = packet;
    // }
    Mapper.prototype.drawPolyline = function (packetList) {
        var locationList = [];
        for (var _i = 0, packetList_1 = packetList; _i < packetList_1.length; _i++) {
            var packet_1 = packetList_1[_i];
            locationList.push(new Microsoft.Maps.Location(packet_1.geo.lat, packet_1.geo.lon));
        }
        if (this._polyline instanceof null) {
            this._polyline = new Microsoft.Maps.Polyline(locationList, null);
            this.map.entities.push(this._polyline);
        }
        else {
            this._polyline.setLocations(locationList);
        }
    };
    return Mapper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Mapper;