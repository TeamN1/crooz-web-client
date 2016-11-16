var Mapper = {
    _packets: [],
    _polyline: null,
    car: null,
    map: null
};

Mapper.init = function(element, packetList) {
    if (packetList === void 0) { packetList = []; }
    this.map = new Microsoft.Maps.Map(element, {
        credentials: 'AuknkZ3WFkby8tWsY03iI9muVj4jcRdHztYdxJiOdu6PXPrX7Tm2ziXOsfz3wAPY',
        navigationBarMode: Microsoft.Maps.NavigationBarMode.compact;
    });
    this.addPackets(packetList);
    return this;
}

Mapper.render = function() {
    console.log(this._packets);
    this.drawPolyline(this._packets)
    for (var i = this.map.entities.getLength()-1; i >=0; i--) {
        var previousPin = this.map.entities.get(i);
        if (previousPin instanceof Microsoft.Maps.Pushpin) {
            this.map.entities.removeAt(i);
        }
    }
    console.log(this.car);
    var pushPin = new Microsoft.Maps.Pushpin(
        new Microsoft.Maps.Location(this.car.geo.lat, this.car.geo.lon),
        null
    )
    this.map.entities.push(pushPin);
}

Mapper.addPackets = function(packetList) {
    if (packetList.length) {
        console.log(packetList);
        this._packets = this._packets.concat(packetList);
        this.car = this._packets[this._packets.length-1];
    }
}

Mapper.drawPolyline = function(packetList) {
    var locationList = [];
    for (var packet of packetList) {
        locationList.push(new Microsoft.Maps.Location(packet.geo.lat, packet.geo.lon));
    }
    
    if (locationList.length) {
        this.map.setView({
            center: locationList[locationList.length-1],
            zoom: 15
        });
//         var rect = Microsoft.Maps.LocationRect.fromLocations(locationList);
//         this.map.setView({ bounds: rect, padding: 250, zoom: 15 });
    }
    if (!this._polyline) {
        this._polyline = new Microsoft.Maps.Polyline(locationList, null);
        this.map.entities.push(this._polyline);
    } else {
        this._polyline.setLocations(locationList);
    }    
}
